import type { Activity, ActivityWeek, Level, PortfolioData } from "./activity";
import { loadGithubData, type GithubData } from "./github.server";
import { loadGitlabCalendar, type GitlabCalendar } from "./gitlab.server";

// ---------------------------------------------------------------------------
// Fusion des deux sources d'activité.
//
// GitHub définit la grille : c'est lui qui fournit la fenêtre glissante de
// 12 mois découpée en semaines. Les compteurs GitLab s'y greffent par date.
// Conséquence assumée : sans GitHub, pas de section — y compris si GitLab
// répond. L'inverse est supporté (calendrier en vert seul).
// ---------------------------------------------------------------------------

/**
 * GitHub fournit ses propres quartiles ; GitLab ne renvoie que des compteurs
 * bruts. On calcule donc les seuils sur la distribution GitLab elle-même, pour
 * qu'une journée à 3 contributions GitLab ne s'affiche pas avec la même
 * intensité qu'une journée à 30 sur GitHub.
 *
 * Les quartiles sont calculés sur les seuls jours actifs : inclure les zéros
 * écraserait l'échelle vers le bas pour un compte peu actif.
 */
function gitlabThresholds(days: Record<string, number>): [number, number, number] {
  const counts = Object.values(days)
    .filter((c) => c > 0)
    .sort((a, b) => a - b);

  if (counts.length === 0) return [1, 2, 3];

  const at = (q: number) => counts[Math.min(counts.length - 1, Math.floor(counts.length * q))];
  return [at(0.25), at(0.5), at(0.75)];
}

function gitlabLevel(count: number, [q1, q2, q3]: [number, number, number]): Level {
  if (count <= 0) return 0;
  if (count <= q1) return 1;
  if (count <= q2) return 2;
  if (count <= q3) return 3;
  return 4;
}

function merge(github: GithubData, gitlab: GitlabCalendar | null): Activity {
  const glDays = gitlab?.days ?? {};
  const thresholds = gitlabThresholds(glDays);

  let gitlabTotal = 0;

  const weeks: ActivityWeek[] = github.weeks.map((week) => ({
    days: week.days.map((day) => {
      // Seules les dates couvertes par la grille GitHub sont comptées : une
      // contribution GitLab hors fenêtre ne serait de toute façon pas affichée,
      // et la compter fausserait le total annoncé sous le calendrier.
      const glCount = glDays[day.date] ?? 0;
      gitlabTotal += glCount;

      return {
        date: day.date,
        weekday: day.weekday,
        github: day.count,
        githubLevel: day.level,
        gitlab: glCount,
        gitlabLevel: gitlabLevel(glCount, thresholds),
      };
    }),
  }));

  return {
    weeks,
    githubTotal: github.total,
    gitlabTotal,
    // Une source qui répond `{}` (option de profil désactivée, compte inactif)
    // ne justifie pas d'afficher une légende et des demi-cases orange vides.
    hasGitlab: gitlabTotal > 0,
  };
}

/**
 * Budget accordé à GitLab DANS le rendu de la page.
 *
 * GitHub est structurant : sans lui il n'y a pas de calendrier, on l'attend.
 * GitLab n'est qu'un complément — le faire attendre pénaliserait le visiteur
 * pour une demi-case. Passé ce délai on rend sans lui ; la requête continue en
 * arrière-plan et remplit le cache pour la visite suivante.
 *
 * Observé en conditions réelles : gitlab.com dépasse parfois plusieurs secondes
 * sur calendar.json.
 */
const GITLAB_RENDER_BUDGET_MS = 2_500;

/** Renvoie la valeur si elle arrive à temps, `null` sinon — sans annuler l'appel sous-jacent. */
function withinBudget<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      const timer = setTimeout(() => resolve(null), ms);
      // Ne pas retenir le process Node vivant pour un simple garde-temps.
      timer.unref?.();
    }),
  ]);
}

/**
 * Charge les deux sources en parallèle et les fusionne.
 * Renvoie `null` si GitHub n'a jamais pu être joint, auquel cas la section
 * et son entrée de menu disparaissent.
 */
export async function loadPortfolioData(): Promise<PortfolioData | null> {
  // Les deux partent ensemble ; seul GitHub est attendu sans limite de budget.
  const githubPromise = loadGithubData();
  const gitlabPromise = withinBudget(loadGitlabCalendar(), GITLAB_RENDER_BUDGET_MS);

  // `allSettled` : une panne GitLab ne doit pas empêcher GitHub de s'afficher.
  const [githubResult, gitlabResult] = await Promise.allSettled([githubPromise, gitlabPromise]);

  const github = githubResult.status === "fulfilled" ? githubResult.value : null;
  if (!github) return null;

  const gitlab = gitlabResult.status === "fulfilled" ? gitlabResult.value : null;

  return {
    login: github.login,
    repos: github.repos,
    activity: merge(github, gitlab),
    fetchedAt: Math.min(github.fetchedAt, gitlab?.fetchedAt ?? github.fetchedAt),
  };
}
