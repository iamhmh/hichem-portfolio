import { z } from "zod";

import type { Level, Repo } from "./activity";

// ---------------------------------------------------------------------------
// Accès à l'API GitHub. Ce module ne doit JAMAIS être importé depuis un
// composant : il lit le token dans l'environnement du serveur. Il est chargé
// dynamiquement depuis portfolio.server.ts, lui-même appelé par une server
// function — le token reste donc hors du bundle navigateur.
//
// Les dépôts épinglés et le calendrier de contributions ne sont exposés que par
// l'API GraphQL, qui exige une authentification même pour des données
// publiques. Il n'existe aucun équivalent REST.
// ---------------------------------------------------------------------------

// Surchargeable pour pointer vers un mock en test, ou une instance GitHub Enterprise.
const ENDPOINT = process.env.GITHUB_API_URL ?? "https://api.github.com/graphql";

/** Durée de fraîcheur du cache. Au-delà, la donnée est encore servie mais rafraîchie en tâche de fond. */
const TTL_MS = 60 * 60 * 1000; // 1 h

/** Plafond d'attente d'un appel GitHub, pour ne jamais bloquer le rendu indéfiniment. */
const TIMEOUT_MS = 8_000;

const CONTRIBUTION_LEVELS = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

/** GitHub fournit déjà les quartiles : on se contente de les projeter sur 0–4. */
const LEVEL_INTENSITY: Record<(typeof CONTRIBUTION_LEVELS)[number], Level> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const QUERY = `
query PortfolioData($login: String!, $pinned: Int!, $topics: Int!) {
  user(login: $login) {
    login
    pinnedItems(first: $pinned, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
          repositoryTopics(first: $topics) { nodes { topic { name } } }
        }
      }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays { date contributionCount contributionLevel weekday }
        }
      }
    }
  }
}`;

// ---------------------------------------------------------------------------
// Validation de la réponse GraphQL.
//
// Les noms de champs suivent le schéma public de GitHub
// (https://docs.github.com/public/fpt/schema.docs.graphql).
// `pinnedItems` renvoie une union Gist | Repository : les gists arrivent sans
// les champs d'un dépôt, on les écarte au lieu de faire échouer toute la
// validation — d'où les champs optionnels puis le filtre dans `normalize()`.
// ---------------------------------------------------------------------------

const pinnedNodeSchema = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  url: z.string().optional(),
  stargazerCount: z.number().optional(),
  forkCount: z.number().optional(),
  primaryLanguage: z
    .object({ name: z.string(), color: z.string().nullable() })
    .nullable()
    .optional(),
  repositoryTopics: z
    .object({
      nodes: z.array(z.object({ topic: z.object({ name: z.string() }) })),
    })
    .optional(),
});

const contributionDaySchema = z.object({
  date: z.string(),
  contributionCount: z.number(),
  contributionLevel: z.enum(CONTRIBUTION_LEVELS),
  weekday: z.number(),
});

const githubResponseSchema = z.object({
  data: z.object({
    user: z
      .object({
        login: z.string(),
        pinnedItems: z.object({ nodes: z.array(pinnedNodeSchema).nullable() }),
        contributionsCollection: z.object({
          contributionCalendar: z.object({
            totalContributions: z.number(),
            weeks: z.array(
              z.object({ contributionDays: z.array(contributionDaySchema) }),
            ),
          }),
        }),
      })
      .nullable(),
  }),
});

type GithubResponse = z.infer<typeof githubResponseSchema>;

export interface GithubDay {
  date: string;
  weekday: number;
  count: number;
  level: Level;
}

export interface GithubData {
  login: string;
  repos: Repo[];
  /** Définit la fenêtre glissante de 12 mois sur laquelle le calendrier est bâti. */
  weeks: Array<{ days: GithubDay[] }>;
  total: number;
  fetchedAt: number;
}

function normalize(response: GithubResponse, fetchedAt: number): GithubData | null {
  const user = response.data.user;
  if (!user) return null;

  const repos: Repo[] = (user.pinnedItems.nodes ?? [])
    // Écarte les gists épinglés, qui n'ont ni `name` ni `url`.
    .filter((n): n is typeof n & { name: string; url: string } =>
      typeof n.name === "string" && typeof n.url === "string",
    )
    .map((n) => ({
      name: n.name,
      description: n.description ?? null,
      url: n.url,
      stars: n.stargazerCount ?? 0,
      forks: n.forkCount ?? 0,
      language: n.primaryLanguage ?? null,
      topics: (n.repositoryTopics?.nodes ?? []).map((t) => t.topic.name),
    }));

  const calendar = user.contributionsCollection.contributionCalendar;

  return {
    login: user.login,
    repos,
    total: calendar.totalContributions,
    weeks: calendar.weeks.map((w) => ({
      days: w.contributionDays.map((d) => ({
        date: d.date,
        weekday: d.weekday,
        count: d.contributionCount,
        level: LEVEL_INTENSITY[d.contributionLevel],
      })),
    })),
    fetchedAt,
  };
}

let cache: GithubData | null = null;
/** Déduplique les appels concurrents : un seul aller-retour même sous charge. */
let inflight: Promise<GithubData | null> | null = null;

async function fetchFromGithub(): Promise<GithubData | null> {
  const token = process.env.GITHUB_TOKEN;
  const login = process.env.GITHUB_LOGIN ?? "iamhmh";

  if (!token) {
    // Cas normal en développement local sans token : la section disparaît
    // simplement, le reste du site fonctionne.
    console.warn("[github] GITHUB_TOKEN absent — section Projets masquée.");
    return null;
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      // GitHub rejette les requêtes sans User-Agent.
      "User-Agent": "hichemgouia-portfolio",
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { login, pinned: 6, topics: 5 },
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`GitHub a répondu ${response.status} ${response.statusText}`);
  }

  const payload: unknown = await response.json();

  // Une réponse GraphQL peut être 200 tout en portant des erreurs.
  if (payload && typeof payload === "object" && "errors" in payload) {
    const errors = (payload as { errors: unknown }).errors;
    if (Array.isArray(errors) && errors.length > 0) {
      throw new Error(`Erreur GraphQL GitHub : ${JSON.stringify(errors)}`);
    }
  }

  const parsed = githubResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(`Réponse GitHub inattendue : ${parsed.error.message}`);
  }

  return normalize(parsed.data, Date.now());
}

function refresh(): Promise<GithubData | null> {
  if (inflight) return inflight;

  inflight = fetchFromGithub()
    .then((data) => {
      // `null` (token absent / utilisateur introuvable) n'écrase pas un cache valide.
      if (data) cache = data;
      return data ?? cache;
    })
    .catch((error: unknown) => {
      console.error("[github] récupération échouée", error);
      // Repli sur la dernière donnée connue, même périmée.
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/**
 * Renvoie les données GitHub, ou `null` si aucune n'a jamais pu être récupérée
 * (auquel cas l'appelant masque la section).
 *
 * Trois régimes :
 *  - cache frais   → renvoyé immédiatement ;
 *  - cache périmé  → renvoyé immédiatement, rafraîchi en tâche de fond ;
 *  - cache vide    → on attend l'appel réseau (borné par TIMEOUT_MS).
 */
export async function loadGithubData(): Promise<GithubData | null> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) {
    return cache;
  }

  if (cache) {
    // Périmé mais exploitable : on ne fait pas attendre le visiteur.
    void refresh();
    return cache;
  }

  return refresh();
}
