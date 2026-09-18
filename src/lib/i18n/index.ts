import { useRouterState } from "@tanstack/react-router";

import { CONTENT, DEFAULT_LANG, isLang, type Content, type Lang } from "./content";

export {
  CONTENT,
  DEFAULT_LANG,
  LANGS,
  LINKS,
  SITE_URL,
  isLang,
  urlForLang,
  type Content,
  type Lang,
  type TimelineItem,
} from "./content";

/**
 * La langue vit dans l'URL (`?lang=en`), et nulle part ailleurs.
 *
 * Pas de `localStorage` : le serveur rendrait la page en français puis le
 * client rebasculerait en anglais après hydratation, ce qui produit un flash
 * visible. L'URL est connue du serveur comme du navigateur, donc les deux
 * rendus concordent — et un lien reste partageable dans la langue choisie.
 *
 * On lit `location.search` via `useRouterState` plutôt que `Route.useSearch()`
 * pour que le hook fonctionne partout dans l'arbre, y compris dans la coquille
 * racine qui n'appartient à aucune route.
 */
export function useLang(): Lang {
  return useRouterState({
    select: (state) => {
      const lang = (state.location.search as { lang?: unknown }).lang;
      return isLang(lang) ? lang : DEFAULT_LANG;
    },
  });
}

/** Le dictionnaire correspondant à la langue courante. */
export function useContent(): Content {
  return CONTENT[useLang()];
}

/**
 * Search params à poser pour une langue donnée.
 *
 * Le français étant la langue par défaut, il n'ajoute aucun paramètre : `/`
 * reste l'URL canonique et ne se dédouble pas en `/?lang=fr`.
 */
export function searchForLang(lang: Lang): { lang?: Lang } {
  return lang === DEFAULT_LANG ? {} : { lang };
}
