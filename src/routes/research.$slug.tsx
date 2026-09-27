import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { LanguageToggle } from "@/components/portfolio/LanguageToggle";
import {
  CONTENT,
  DEFAULT_LANG,
  LANGS,
  SITE_URL,
  findResearchProject,
  isLang,
  searchForLang,
  urlForArticle,
  useContent,
  useLang,
  type Lang,
} from "@/lib/i18n";

const OG_IMAGE = `${SITE_URL}/social-preview.png?v=1`;

export const Route = createFileRoute("/research/$slug")({
  /** Même convention que la page d'accueil : la langue est un search param. */
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } =>
    isLang(search.lang) && search.lang !== DEFAULT_LANG ? { lang: search.lang } : {},

  /**
   * Le slug est vérifié sur le contenu français, qui fait référence : les deux
   * langues partagent les mêmes slugs et le typage de `en` garantit qu'aucune
   * traduction ne manque. Un slug inconnu tombe donc sur le 404 de la racine
   * plutôt que de rendre une page vide.
   */
  loader: ({ params }) => {
    if (!findResearchProject(DEFAULT_LANG, params.slug)) throw notFound();
  },

  head: ({ match }) => {
    const lang = isLang(match.search.lang) ? match.search.lang : DEFAULT_LANG;
    const project = findResearchProject(lang, match.params.slug);

    // Slug inconnu : le loader a déjà déclenché le 404, on ne produit aucune
    // métadonnée plutôt que d'annoncer une page qui n'existe pas.
    if (!project) return {};

    const t = CONTENT[lang];
    const title = `${project.title} - ${t.meta.siteName}`;
    const description = project.article.metaDescription;
    const url = urlForArticle(lang, project.slug);

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: lang === "fr" ? "fr_FR" : "en_US" },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [
        { rel: "canonical", href: url },
        ...LANGS.map((l) => ({
          rel: "alternate",
          hrefLang: l,
          href: urlForArticle(l, project.slug),
        })),
        {
          rel: "alternate",
          hrefLang: "x-default",
          href: urlForArticle(DEFAULT_LANG, project.slug),
        },
      ],
    };
  },

  component: ResearchArticle,
});

function ResearchArticle() {
  const { slug } = Route.useParams();
  const lang = useLang();
  const t = useContent();

  const project = findResearchProject(lang, slug);
  // Le loader a déjà filtré les slugs inconnus ; ce garde-fou n'existe que pour
  // le typage, `findResearchProject` renvoyant un `ResearchProject | undefined`.
  if (!project) return null;

  const others = t.projects.items.filter((item) => item.slug !== slug);
  const backToProjects = (
    <Link
      to="/"
      search={searchForLang(lang)}
      hash="projects"
      className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {t.article.backToProjects}
    </Link>
  );

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* La nav de l'accueil ancre six sections qui n'existent pas ici : cette
          page a son propre en-tête, réduit au retour et au choix de langue. */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            to="/"
            search={searchForLang(lang)}
            className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md border border-border bg-card text-xs font-semibold">
              HG
            </span>
            <span className="hidden text-foreground/90 sm:inline">Hichem Gouia</span>
          </Link>

          <LanguageToggle articleSlug={slug} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-28 sm:px-6 sm:pb-32 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {backToProjects}

          <div className="mt-8 text-[11px] font-semibold uppercase tracking-wider text-primary/80">
            {project.kind}
          </div>

          <h1 className="mt-3 text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl">
            {project.title}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            {project.article.lede}
          </p>

          {project.tags.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          className="mt-12 border-t border-border pt-12"
        >
          {project.article.sections.map((section, i) => (
            <section key={section.heading} className={i > 0 ? "mt-12" : ""}>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-base leading-relaxed text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </motion.article>

        {others.length > 0 ? (
          <aside className="mt-16 border-t border-border pt-10">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t.article.otherProjects}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {others.map((item) => (
                <Link
                  key={item.slug}
                  to="/research/$slug"
                  params={{ slug: item.slug }}
                  search={searchForLang(lang)}
                  className="group flex flex-col rounded-xl border border-border bg-card p-5 transition hover:border-foreground/30"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
                    {item.kind}
                  </span>
                  <span className="mt-2 text-sm font-semibold text-foreground">{item.title}</span>
                  <span className="mt-auto flex items-center gap-1.5 pt-4 text-sm font-medium text-foreground">
                    {t.projects.readArticle}
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        ) : null}

        <div className="mt-12">{backToProjects}</div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col items-start justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} Hichem Gouia</p>
          <p>{t.footer.location}</p>
        </div>
      </footer>
    </div>
  );
}
