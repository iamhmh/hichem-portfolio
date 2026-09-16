import { z } from "zod";

// ---------------------------------------------------------------------------
// Contributions GitLab.
//
// GitLab expose le calendrier de son profil sur `/users/<login>/calendar.json`,
// sous la forme d'un simple objet date -> nombre. C'est la source qu'utilise la
// page de profil elle-même, elle ne demande aucune authentification.
//
// Les contributions sur projets privés n'y figurent que si le compte a activé
// « Inclure les contributions privées sur mon profil » (Préférences → Profil).
// Sans cette option, la réponse est `{}` et la moitié GitLab du calendrier
// reste vide — sans rien casser.
// ---------------------------------------------------------------------------

const BASE_URL = process.env.GITLAB_URL ?? "https://gitlab.com";

const TTL_MS = 60 * 60 * 1000; // 1 h, aligné sur GitHub
// Généreux : cet appel ne bloque plus le rendu (cf. GITLAB_RENDER_BUDGET_MS).
const TIMEOUT_MS = 15_000;

/** `{"2026-03-14": 7, …}`. Les clés non conformes sont ignorées plutôt que fatales. */
const calendarSchema = z.record(z.string(), z.number());

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface GitlabCalendar {
  /** date ISO -> nombre de contributions. */
  days: Record<string, number>;
  total: number;
  fetchedAt: number;
}

let cache: GitlabCalendar | null = null;
let inflight: Promise<GitlabCalendar | null> | null = null;

async function fetchFromGitlab(): Promise<GitlabCalendar | null> {
  const login = process.env.GITLAB_LOGIN;

  // GitLab est optionnel : sans login configuré, la section reste en vert seul.
  if (!login) return null;

  const response = await fetch(`${BASE_URL}/users/${encodeURIComponent(login)}/calendar.json`, {
    headers: { Accept: "application/json", "User-Agent": "hichemgouia-portfolio" },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`GitLab a répondu ${response.status} ${response.statusText}`);
  }

  const parsed = calendarSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error(`Réponse GitLab inattendue : ${parsed.error.message}`);
  }

  const days: Record<string, number> = {};
  let total = 0;
  for (const [date, count] of Object.entries(parsed.data)) {
    if (!DATE_RE.test(date) || !Number.isFinite(count) || count <= 0) continue;
    days[date] = count;
    total += count;
  }

  return { days, total, fetchedAt: Date.now() };
}

function refresh(): Promise<GitlabCalendar | null> {
  if (inflight) return inflight;

  inflight = fetchFromGitlab()
    .then((data) => {
      if (data) cache = data;
      return data ?? cache;
    })
    .catch((error: unknown) => {
      console.error("[gitlab] récupération échouée", error);
      return cache;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

/** Même politique que GitHub : frais → servi, périmé → servi puis rafraîchi, vide → attendu. */
export async function loadGitlabCalendar(): Promise<GitlabCalendar | null> {
  if (cache && Date.now() - cache.fetchedAt < TTL_MS) return cache;
  if (cache) {
    void refresh();
    return cache;
  }
  return refresh();
}
