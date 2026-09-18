/**
 * Projet rédigé à la main, par opposition aux dépôts remontés automatiquement
 * par `ProjectCard`. Pas de lien : ces travaux sont académiques et n'ont pas
 * tous de dépôt public.
 */
export function ResearchProjectCard({
  title,
  kind,
  body,
  tags,
}: {
  title: string;
  kind: string;
  body: string;
  tags: string[];
}) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-6">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
        {kind}
      </div>

      <h3 className="mt-2 text-base font-semibold text-foreground">{title}</h3>

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>

      {tags.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
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
    </article>
  );
}
