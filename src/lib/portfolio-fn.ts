import { createServerFn } from "@tanstack/react-start";

import type { PortfolioData } from "./activity";

/**
 * Point d'entrée serveur de la section Projets.
 *
 * L'import de `./portfolio.server` est dynamique et interne au handler : c'est
 * ce qui garantit que les modules lisant l'environnement (token GitHub) et
 * appelant les API n'atterrissent jamais dans le bundle navigateur.
 *
 * Ne lève jamais : en cas d'échec on renvoie `null` et la section est masquée,
 * plutôt que de faire tomber toute la page d'accueil.
 */
export const getPortfolioData = createServerFn({ method: "GET" }).handler(
  async (): Promise<PortfolioData | null> => {
    try {
      const { loadPortfolioData } = await import("./portfolio.server");
      return await loadPortfolioData();
    } catch (error) {
      console.error("[portfolio] server function en échec", error);
      return null;
    }
  },
);
