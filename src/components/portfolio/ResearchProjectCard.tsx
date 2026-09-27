import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { searchForLang, useContent, useLang, type ResearchProject } from "@/lib/i18n";

/**
 * Projet rédigé à la main, par opposition aux dépôts remontés automatiquement
 * par `ProjectCard`. Ces travaux sont académiques et n'ont pas tous de dépôt
 * public : le lien pointe vers l'article qui détaille la démarche, pas vers du
 * code.
 *
 * La carte entière est cliquable via un overlay posé sur le lien, pour que la
 * cible tactile couvre la carte sans imbriquer de balises interactives - ce qui
 * laisse un seul lien dans l'ordre de tabulation et un intitulé lisible pour un
 * lecteur d'écran.
 */
export function ResearchProjectCard({ project }: { project: ResearchProject }) {
  const { slug, title, kind, body, tags } = project;
  const lang = useLang();
  const t = useContent();

  return (
    <article className="group relative flex flex-col rounded-xl border border-border bg-card p-6 transition hover:border-foreground/30">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
        {kind}
      </div>

      <h3 className="mt-2 text-base font-semibold text-foreground">
        <Link
          to="/research/$slug"
          params={{ slug }}
          search={searchForLang(lang)}
          className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {title}
        </Link>
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>

      {tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-foreground">
        {t.projects.readArticle}
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </article>
  );
}
