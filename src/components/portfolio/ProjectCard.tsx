import { GitFork, Star } from "lucide-react";

import type { Repo } from "@/lib/activity";
import { useContent } from "@/lib/i18n";

export function ProjectCard({ repo }: { repo: Repo }) {
  const t = useContent();

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex flex-col rounded-xl border border-border bg-card p-6 transition hover:border-foreground/40"
    >
      <h3 className="text-base font-semibold text-foreground">{repo.name}</h3>

      {repo.description ? (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {repo.description}
        </p>
      ) : null}

      {repo.topics.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {repo.topics.map((topic) => (
            <span
              key={topic}
              className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
            >
              {topic}
            </span>
          ))}
        </div>
      ) : null}

      {/* `mt-auto` aligne cette ligne en bas quelles que soient les hauteurs de
          description : les cartes d'une même rangée restent cohérentes. */}
      <div className="mt-auto flex flex-wrap items-center gap-4 pt-5 text-xs text-muted-foreground">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full ring-1 ring-inset ring-foreground/10"
              // GitHub fournit la couleur officielle du langage ; repli neutre si absente.
              style={{ backgroundColor: repo.language.color ?? "var(--muted-foreground)" }}
              aria-hidden="true"
            />
            {repo.language.name}
          </span>
        ) : null}

        {repo.stars > 0 ? (
          <span className="inline-flex items-center gap-1">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">{t.repo.stars}</span>
            {repo.stars.toLocaleString(t.locale)}
          </span>
        ) : null}

        {repo.forks > 0 ? (
          <span className="inline-flex items-center gap-1">
            <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">{t.repo.forks}</span>
            {repo.forks.toLocaleString(t.locale)}
          </span>
        ) : null}
      </div>
    </a>
  );
}
