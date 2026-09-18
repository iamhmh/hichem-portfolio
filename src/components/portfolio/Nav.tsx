import { useEffect, useMemo, useState } from "react";

import { AnchorLink } from "@/components/portfolio/AnchorLink";
import { LanguageToggle } from "@/components/portfolio/LanguageToggle";
import { useContent } from "@/lib/i18n";

export function Nav() {
  const t = useContent();

  // Toutes les sections existent en permanence : les projets rédigés ne
  // dépendent d'aucune API, seul le bloc dépôts en bas de section peut manquer.
  const sections = useMemo(
    () => [
      { id: "about", label: t.nav.about },
      { id: "experience", label: t.nav.experience },
      { id: "education", label: t.nav.education },
      { id: "expertise", label: t.nav.expertise },
      { id: "projects", label: t.nav.projects },
      { id: "contact", label: t.nav.contact },
    ],
    [t],
  );

  const [active, setActive] = useState<string>("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <AnchorLink
          hash="top"
          className="group flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-xs font-semibold">
            HG
          </span>
          <span className="hidden sm:inline text-foreground/90">Hichem Gouia</span>
        </AnchorLink>

        {/* Le menu de sections passe sous `lg` : à six entrées traduites, il ne
            tient plus à côté du logo et du sélecteur de langue sur une tablette. */}
        <nav
          className={`hidden rounded-full border border-border bg-card/90 px-2 py-1.5 backdrop-blur lg:flex ${
            scrolled ? "shadow-sm" : ""
          }`}
        >
          {sections.map((s) => (
            <AnchorLink
              key={s.id}
              hash={s.id}
              className={`relative rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                active === s.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.label}
            </AnchorLink>
          ))}
        </nav>

        {/* Le sélecteur de langue reste visible à toutes les tailles : c'est le
            seul moyen d'accéder à la version anglaise. */}
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <AnchorLink
            hash="contact"
            className="hidden rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium transition hover:border-foreground/40 lg:inline-block"
          >
            {t.nav.cta}
          </AnchorLink>
        </div>
      </div>
    </header>
  );
}
