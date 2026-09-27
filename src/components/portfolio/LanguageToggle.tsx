import { Link, useRouterState } from "@tanstack/react-router";

import { CONTENT, LANGS, searchForLang, useContent, useLang } from "@/lib/i18n";

/**
 * Sélecteur de langue segmenté FR | EN.
 *
 * Chaque option est un vrai lien : navigable au clavier, ouvrable dans un
 * nouvel onglet, et suivable par un crawler. Le hash courant est conservé pour
 * que la bascule ne renvoie pas le visiteur en haut de page, et `resetScroll`
 * est désactivé pour la même raison.
 *
 * `articleSlug` indique qu'on se trouve sur une page d'article : la bascule doit
 * alors rester sur cet article plutôt que de ramener à l'accueil. Les deux
 * branches sont écrites séparément pour que le routeur garde ses types - un
 * `to` calculé perdrait la vérification des paramètres de route.
 */
export function LanguageToggle({ articleSlug }: { articleSlug?: string }) {
  const lang = useLang();
  const t = useContent();
  const hash = useRouterState({ select: (state) => state.location.hash });

  return (
    <div
      className="flex items-center rounded-full border border-border bg-card p-0.5"
      role="group"
      aria-label={t.nav.switchLabel}
    >
      {LANGS.map((option) => {
        const active = option === lang;
        const shared = {
          search: searchForLang(option),
          replace: true,
          resetScroll: false,
          hrefLang: option,
          "aria-current": active ? ("true" as const) : undefined,
          title: CONTENT[option].langName,
          className: `rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
          }`,
          children: CONTENT[option].langShort,
        };

        return articleSlug ? (
          <Link key={option} to="/research/$slug" params={{ slug: articleSlug }} {...shared} />
        ) : (
          <Link key={option} to="/" hash={hash || undefined} {...shared} />
        );
      })}
    </div>
  );
}
