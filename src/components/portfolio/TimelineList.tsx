import type { TimelineItem } from "@/lib/i18n";

/**
 * Liste chronologique partagée par les sections Expérience et Formation : les
 * deux ont exactement la même forme (période à gauche, détail à droite), seul
 * le contenu change.
 */
export function TimelineList({
  items,
  upcomingBadge,
}: {
  items: TimelineItem[];
  /** Libellé du badge posé sur un poste signé mais pas encore commencé. */
  upcomingBadge?: string;
}) {
  return (
    <ol className="divide-y divide-border rounded-xl border border-border bg-card">
      {items.map((item) => (
        <li
          key={`${item.org}-${item.period}`}
          className="grid gap-3 p-6 sm:grid-cols-[180px_1fr] sm:gap-8 sm:p-8"
        >
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {item.period}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold text-foreground sm:text-lg">{item.role}</h3>
              {item.upcoming && upcomingBadge ? (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                  {upcomingBadge}
                </span>
              ) : null}
            </div>

            <p className="mt-0.5 text-sm text-muted-foreground">
              {item.org}
              {item.note ? <span className="text-muted-foreground/70"> · {item.note}</span> : null}
            </p>

            <p className="mt-3 text-sm leading-relaxed text-foreground/80 sm:text-base">
              {item.focus}
            </p>

            {item.highlights.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="relative pl-4 text-sm leading-relaxed text-muted-foreground before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-muted-foreground/60"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}

            {item.themes.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {item.themes.map((theme) => (
                  <span
                    key={theme}
                    className="rounded-md border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
