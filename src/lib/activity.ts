// ---------------------------------------------------------------------------
// Types exposés à l'UI pour la section Projets.
//
// Module isomorphe et volontairement minuscule : il est importé par les
// composants, donc embarqué dans le bundle navigateur. Les appels réseau, la
// validation zod et la fusion des deux sources vivent dans les modules
// `*.server.ts`.
// ---------------------------------------------------------------------------

/** Intensité d'une demi-case : 0 = aucune activité, 4 = quartile le plus haut. */
export type Level = 0 | 1 | 2 | 3 | 4;

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: { name: string; color: string | null } | null;
  topics: string[];
}

/**
 * Une journée du calendrier, portant les deux sources.
 *
 * Les niveaux sont calculés indépendamment par source : une journée à 3
 * contributions GitLab et une journée à 30 sur GitHub ne doivent pas s'afficher
 * avec la même intensité simplement parce qu'elles cohabitent.
 */
export interface ActivityDay {
  /** Date ISO (YYYY-MM-DD). */
  date: string;
  /** 0 = dimanche … 6 = samedi, convention GitHub. */
  weekday: number;
  github: number;
  githubLevel: Level;
  gitlab: number;
  gitlabLevel: Level;
}

export interface ActivityWeek {
  days: ActivityDay[];
}

export interface Activity {
  weeks: ActivityWeek[];
  githubTotal: number;
  gitlabTotal: number;
  /** `false` quand GitLab n'a rien renvoyé : le rendu bascule en vert seul. */
  hasGitlab: boolean;
}

export interface PortfolioData {
  login: string;
  repos: Repo[];
  activity: Activity;
  /** Epoch ms de la récupération la plus ancienne des deux sources. */
  fetchedAt: number;
}
