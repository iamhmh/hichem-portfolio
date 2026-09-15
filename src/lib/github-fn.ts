import { createServerFn } from "@tanstack/react-start";
import type { GithubData } from "./github";

/**
 * Point d'entrée serveur pour les données GitHub.
 *
 * L'import de `./github.server` est dynamique et interne au handler : c'est ce
 * qui garantit que le module lisant GITHUB_TOKEN n'atterrit jamais dans le
 * bundle navigateur.
 *
 * Ne lève jamais : en cas d'échec on renvoie `null` et la section est masquée,
 * plutôt que de faire tomber toute la page d'accueil.
 */
export const getGithubData = createServerFn({ method: "GET" }).handler(
  async (): Promise<GithubData | null> => {
    try {
      const { loadGithubData } = await import("./github.server");
      return await loadGithubData();
    } catch (error) {
      console.error("[github] server function en échec", error);
      return null;
    }
  },
);
