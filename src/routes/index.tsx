import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { Section } from "@/components/portfolio/Section";
import { POSTS, isInternal } from "@/lib/writing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hichem Gouia — Votre titre professionnel" },
      {
        name: "description",
        content:
          "Une phrase de description du site, reprise par Google et les aperçus de partage. 150 caractères environ.",
      },
      { property: "og:title", content: "Hichem Gouia — Votre titre professionnel" },
      {
        property: "og:description",
        content:
          "Une phrase de description du site, reprise par Google et les aperçus de partage. 150 caractères environ.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://hichemgouia.com/social-preview.png?v=1" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Hichem Gouia — Votre titre professionnel" },
      {
        name: "twitter:description",
        content:
          "Une phrase de description du site, reprise par Google et les aperçus de partage. 150 caractères environ.",
      },
      { name: "twitter:image", content: "https://hichemgouia.com/social-preview.png?v=1" },
    ],
  }),
  component: Index,
});

const EXPERIENCE = [
  {
    role: "Votre poste",
    company: "Entreprise",
    period: "2024 – Présent",
    focus: "Décrivez en une ou deux phrases ce que vous construisez et l'impact que ça a.",
    themes: ["Thème 1", "Thème 2", "Thème 3"],
  },
  {
    role: "Votre poste précédent",
    company: "Entreprise précédente",
    period: "2022 – 2024",
    focus: "Décrivez en une ou deux phrases ce que vous y avez fait.",
    themes: ["Thème 1", "Thème 2"],
  },
  {
    role: "Un poste plus ancien",
    company: "Entreprise",
    period: "2021 – 2022",
    focus: "Une phrase suffit pour les expériences plus anciennes.",
    themes: ["Thème 1"],
  },
  {
    role: "Stage ou alternance",
    company: "Entreprise",
    period: "2020 – 2021",
    focus: "Une phrase.",
    themes: ["Thème 1"],
  },
];

const INTERESTS = [
  {
    title: "Premier centre d'intérêt",
    body: "Deux lignes qui expliquent ce que recouvre ce sujet et pourquoi il vous intéresse.",
  },
  {
    title: "Deuxième centre d'intérêt",
    body: "Deux lignes qui expliquent ce que recouvre ce sujet et pourquoi il vous intéresse.",
  },
  {
    title: "Troisième centre d'intérêt",
    body: "Deux lignes qui expliquent ce que recouvre ce sujet et pourquoi il vous intéresse.",
  },
  {
    title: "Quatrième centre d'intérêt",
    body: "Deux lignes qui expliquent ce que recouvre ce sujet et pourquoi il vous intéresse.",
  },
  {
    title: "Cinquième centre d'intérêt",
    body: "Deux lignes qui expliquent ce que recouvre ce sujet et pourquoi il vous intéresse.",
  },
  {
    title: "Sixième centre d'intérêt",
    body: "Deux lignes qui expliquent ce que recouvre ce sujet et pourquoi il vous intéresse.",
  },
];

function Index() {
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
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Paris, France
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Votre accroche principale, en une phrase qui dit ce que vous faites et pour qui.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Deux ou trois lignes de sous-titre pour développer l'accroche : les problèmes
              que vous résolvez, les technologies que vous utilisez, le type de projets qui
              vous intéressent.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#experience"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:bg-foreground/90"
              >
                Voir mon parcours
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-foreground/40"
              >
                Me contacter
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <Section id="about" eyebrow="À propos" title="Parcours.">
        <div className="max-w-3xl space-y-5 text-base leading-relaxed text-foreground/85 sm:text-lg">
          <p>Première phrase : qui vous êtes, ce que vous faites, où vous êtes basé.</p>
          <p>
            Deuxième paragraphe : votre expérience, les domaines que vous avez couverts, le
            type de systèmes ou de produits sur lesquels vous avez travaillé.
          </p>
          <p>
            Troisième paragraphe : votre formation et les sujets techniques qui vous
            intéressent particulièrement.
          </p>
          <p>
            Quatrième paragraphe : ce que vous faites en dehors du travail, ou ce vers quoi
            vous voulez aller.
          </p>
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" eyebrow="Expérience" title="Postes principaux.">
        <div className="divide-y divide-border rounded-xl border border-border bg-card">
          {EXPERIENCE.map((job) => (
            <div key={job.company + job.period} className="grid gap-3 p-6 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-8">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {job.period}
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground sm:text-lg">{job.role}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
                <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">{job.focus}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.themes.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* INTERESTS */}
      <Section id="interests" eyebrow="Centres d'intérêt" title="Ce qui m'occupe l'esprit.">
        <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {INTERESTS.map((item) => (
            <div key={item.title} className="bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* WRITING */}
      <Section id="writing" eyebrow="Écrits" title="Notes et articles.">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Une phrase pour annoncer les sujets sur lesquels vous écrivez.
        </p>
        <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
          {POSTS.map((essay) => {
            const content = (
              <div className="grid gap-3 p-6 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-8">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {essay.date}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {essay.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
                    {essay.excerpt}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                    {isInternal(essay) ? "Lire l'article" : `Lire sur ${essay.source}`}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
            return isInternal(essay) ? (
              <Link
                key={essay.slug}
                to="/writing/$slug"
                params={{ slug: essay.slug }}
                className="block transition hover:bg-background/50"
              >
                {content}
              </Link>
            ) : (
              <a
                key={essay.title}
                href={essay.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition hover:bg-background/50"
              >
                {content}
              </a>
            );
          })}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" eyebrow="Contact" title="Me contacter.">
        <div className="max-w-2xl">
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Deux lignes sur le type d'échanges qui vous intéressent : opportunités,
            collaborations, sujets techniques.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Une phrase d'invitation à écrire.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <a
              href="mailto:contact@hichemgouia.com"
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href="https://linkedin.com/in/votre-profil"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a
              href="https://github.com/iamhmh"
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition hover:border-foreground/40"
            >
              <Github className="h-4 w-4" /> GitHub
            </a>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} Hichem Gouia</p>
          <p>Paris, France</p>
        </div>
      </footer>
    </div>
  );
}
