// ---------------------------------------------------------------------------
// Types exposés à l'UI. Ce module est isomorphe et volontairement minuscule :
// il est importé par les composants, donc embarqué dans le bundle navigateur.
// La validation zod et le mapping vivent dans github.server.ts.
//
// Ces types sont volontairement découplés de la forme brute de l'API GraphQL :
// un changement côté GitHub s'absorbe dans le mapping serveur, sans remonter
// jusqu'aux composants.
// ---------------------------------------------------------------------------

export const CONTRIBUTION_LEVELS = [
  "NONE",
  "FIRST_QUARTILE",
  "SECOND_QUARTILE",
  "THIRD_QUARTILE",
  "FOURTH_QUARTILE",
] as const;

export type ContributionLevel = (typeof CONTRIBUTION_LEVELS)[number];

/** Index 0–4 utilisé pour choisir la nuance de vert (var(--gh-N)). */
export const LEVEL_INTENSITY: Record<ContributionLevel, 0 | 1 | 2 | 3 | 4> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: { name: string; color: string | null } | null;
  topics: string[];
}

export interface ContributionDay {
  /** Date ISO (YYYY-MM-DD). */
  date: string;
  count: number;
  level: ContributionLevel;
  /** 0 = dimanche … 6 = samedi, tel que renvoyé par GitHub. */
  weekday: number;
}

export interface ContributionWeek {
  days: ContributionDay[];
}

export interface Contributions {
  total: number;
  weeks: ContributionWeek[];
}

export interface GithubData {
  login: string;
  repos: Repo[];
  contributions: Contributions;
  /** Epoch ms de la récupération, sert au cache et à l'affichage « mis à jour ». */
  fetchedAt: number;
}
