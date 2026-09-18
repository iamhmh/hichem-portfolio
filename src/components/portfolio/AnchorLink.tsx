import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { searchForLang, useLang } from "@/lib/i18n";

/**
 * Lien vers une section de la page.
 *
 * On passe par `Link` plutôt qu'un `<a href="#section">` brut pour deux
 * raisons : la langue courante est reconduite dans l'URL, et le routeur reste
 * au courant du hash — ce dont dépend le sélecteur de langue pour ramener le
 * visiteur à la section qu'il lisait.
 */
export function AnchorLink({
  hash,
  className,
  children,
}: {
  hash: string;
  className?: string;
  children: ReactNode;
}) {
  const lang = useLang();

  return (
    <Link to="/" search={searchForLang(lang)} hash={hash} resetScroll={false} className={className}>
      {children}
    </Link>
  );
}
