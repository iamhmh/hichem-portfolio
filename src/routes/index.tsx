import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react";

import { AnchorLink } from "@/components/portfolio/AnchorLink";
import { ContributionGraph } from "@/components/portfolio/ContributionGraph";
import { Nav } from "@/components/portfolio/Nav";
import { ProjectCard } from "@/components/portfolio/ProjectCard";
import { ResearchProjectCard } from "@/components/portfolio/ResearchProjectCard";
import { Section } from "@/components/portfolio/Section";
import { TimelineList } from "@/components/portfolio/TimelineList";
import { getPortfolioData } from "@/lib/portfolio-fn";
import {
  CONTENT,
  DEFAULT_LANG,
  LANGS,
  LINKS,
  SITE_URL,
  isLang,
  urlForLang,
  useContent,
  type Lang,
} from "@/lib/i18n";

const OG_IMAGE = `${SITE_URL}/social-preview.png?v=1`;

export const Route = createFileRoute("/")({
  /**
   * La langue est un search param, pas une route : `/` sert le français et
   * `/?lang=en` l'anglais. Une valeur inconnue retombe silencieusement sur le
   * français plutôt que de déclencher une erreur de validation.
   */
  validateSearch: (search: Record<string, unknown>): { lang?: Lang } =>
    isLang(search.lang) && search.lang !== DEFAULT_LANG ? { lang: search.lang } : {},

  head: ({ match }) => {
    const lang = isLang(match.search.lang) ? match.search.lang : DEFAULT_LANG;
    const { title, description } = CONTENT[lang].meta;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: urlForLang(lang) },
        { property: "og:locale", content: lang === "fr" ? "fr_FR" : "en_US" },
        { property: "og:image", content: OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: OG_IMAGE },
      ],
      links: [
        // Sans canonical, `/` et `/?lang=en` se concurrencent dans l'index.
        { rel: "canonical", href: urlForLang(lang) },
        ...LANGS.map((l) => ({ rel: "alternate", hrefLang: l, href: urlForLang(l) })),
        { rel: "alternate", hrefLang: "x-default", href: urlForLang(DEFAULT_LANG) },
      ],
    };
  },

  // Les données GitHub sont chargées côté serveur : le token n'atteint jamais
  // le navigateur, et le contenu est présent dès le HTML initial. Le loader ne
  // dépend pas de la langue — changer de langue ne relance donc aucun appel API.
  loader: async () => ({ portfolio: await getPortfolioData() }),

  // Le loader ne dépend pas de la langue, mais sans `staleTime` le routeur
  // considère la donnée périmée à chaque navigation — y compris un simple
  // changement de `?lang=`. Ce délai garde la bascule FR/EN purement cliente.
  staleTime: 5 * 60 * 1000,

  component: Index,
});

function Index() {
  const { portfolio } = Route.useLoaderData();
  const t = useContent();

  // Seul le bloc « activité et dépôts » dépend des API : les projets rédigés
  // s'affichent quoi qu'il arrive, donc la section Projets ne disparaît jamais.
  const hasRepoData = Boolean(
    portfolio && (portfolio.repos.length > 0 || portfolio.activity.weeks.length > 0),
  );

  return (
    <div id="top" className="relative min-h-screen bg-background text-foreground">
      <Nav />

      {/* HERO */}
      <section className="relative pt-40 pb-24 sm:pt-48 sm:pb-32">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {t.hero.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> {t.hero.status}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              {t.hero.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {t.hero.intro}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <AnchorLink
                hash="experience"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                {t.hero.ctaJourney}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </AnchorLink>

              <a
                href={LINKS.resume}
                download
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/40"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {t.hero.ctaResume}
              </a>

              <AnchorLink
                hash="contact"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/40"
              >
                {t.hero.ctaContact}
              </AnchorLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" eyebrow={t.about.eyebrow} title={t.about.title}>
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
          {t.about.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 inline-flex max-w-3xl flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-5 py-4">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            {t.about.awardLabel}
          </span>
          <span className="text-sm text-foreground/85">{t.about.award}</span>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" eyebrow={t.experience.eyebrow} title={t.experience.title}>
        <TimelineList items={t.experience.items} upcomingBadge={t.experience.upcomingBadge} />
      </Section>

      {/* EDUCATION */}
      <Section id="education" eyebrow={t.education.eyebrow} title={t.education.title}>
        <TimelineList items={t.education.items} />
      </Section>

      {/* EXPERTISE */}
      <Section id="expertise" eyebrow={t.expertise.eyebrow} title={t.expertise.title}>
        <p className="max-w-2xl text-sm text-muted-foreground">{t.expertise.intro}</p>

        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {t.expertise.items.map((item) => (
            <div key={item.title} className="bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" eyebrow={t.projects.eyebrow} title={t.projects.title}>
        <p className="max-w-2xl text-sm text-muted-foreground">{t.projects.intro}</p>

        <h3 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {t.projects.researchTitle}
        </h3>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          {t.projects.items.map((project) => (
            <ResearchProjectCard
              key={project.title}
              title={project.title}
              kind={project.kind}
              body={project.body}
              tags={project.tags}
            />
          ))}
        </div>

        {portfolio && hasRepoData ? (
          <>
            <h3 className="mt-14 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {t.projects.openSourceTitle}
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              {t.projects.openSourceIntro}
            </p>

            {portfolio.activity.weeks.length > 0 ? (
              <div className="mt-6">
                <ContributionGraph activity={portfolio.activity} />
              </div>
            ) : null}

            {portfolio.repos.length > 0 ? (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {portfolio.repos.map((repo) => (
                  <ProjectCard key={repo.name} repo={repo} />
                ))}
              </div>
            ) : null}

            <div className="mt-8">
              <a
                href={`https://github.com/${portfolio.login}`}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition hover:opacity-70"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {t.projects.allRepos}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </>
        ) : null}
      </Section>

      {/* CONTACT */}
      <Section id="contact" eyebrow={t.contact.eyebrow} title={t.contact.title}>
        <div>
          {t.contact.paragraphs.map((paragraph, i) => (
            <p
              key={paragraph}
              className={`text-base leading-relaxed text-muted-foreground sm:text-lg ${
                i > 0 ? "mt-4" : ""
              }`}
            >
              {paragraph}
            </p>
          ))}

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={`mailto:${LINKS.email}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> {t.contact.email}
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" /> {t.contact.linkedin}
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <Github className="h-4 w-4" aria-hidden="true" /> {t.contact.github}
            </a>
            <a
              href={LINKS.resume}
              download
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <Download className="h-4 w-4" aria-hidden="true" /> {t.contact.resume}
            </a>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} Hichem Gouia</p>
          <p>{t.footer.location}</p>
        </div>
      </footer>
    </div>
  );
}
