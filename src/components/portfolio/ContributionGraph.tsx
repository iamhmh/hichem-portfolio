import { LEVEL_INTENSITY, type Contributions, type ContributionDay } from "@/lib/github";

// Les semaines renvoyées par GitHub peuvent être partielles aux deux extrémités
// (l'année glissante ne commence pas forcément un dimanche). On projette donc
// chaque semaine sur 7 cases indexées par `weekday`, les manquantes restant vides.
const DAYS_IN_WEEK = 7;

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const MONTH_FMT = new Intl.DateTimeFormat("fr-FR", { month: "short" });

/** Libellés de gauche : seules 3 lignes sont annotées, comme sur GitHub. */
const WEEKDAY_LABELS: Record<number, string> = { 1: "Lun", 3: "Mer", 5: "Ven" };

function toSlots(days: ContributionDay[]): Array<ContributionDay | null> {
  const slots = Array.from<ContributionDay | null>({ length: DAYS_IN_WEEK }).fill(null);
  for (const day of days) {
    if (day.weekday >= 0 && day.weekday < DAYS_IN_WEEK) slots[day.weekday] = day;
  }
  return slots;
}

function label(day: ContributionDay): string {
  const date = DATE_FMT.format(new Date(`${day.date}T00:00:00Z`));
  if (day.count === 0) return `Aucune contribution le ${date}`;
  return `${day.count} contribution${day.count > 1 ? "s" : ""} le ${date}`;
}

export function ContributionGraph({ contributions }: { contributions: Contributions }) {
  const weeks = contributions.weeks;

  // Une étiquette de mois est posée sur la première semaine où le mois change.
  const monthLabels = weeks.map((week, i) => {
    const first = week.days[0];
    if (!first) return null;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (i === 0) return null; // évite un libellé tronqué sur une semaine partielle
    const prev = weeks[i - 1]?.days[0];
    if (!prev) return null;
    const prevMonth = new Date(`${prev.date}T00:00:00Z`).getUTCMonth();
    return month === prevMonth ? null : MONTH_FMT.format(new Date(`${first.date}T00:00:00Z`));
  });

  return (
    <figure className="mt-10 rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">
          {contributions.total.toLocaleString("fr-FR")} contributions sur les 12 derniers mois
        </span>
        <span className="text-xs text-muted-foreground">Source : GitHub</span>
      </figcaption>

      {/* Le calendrier dépasse en largeur sur mobile : il défile dans son propre
          conteneur, jamais le corps de la page. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="inline-flex min-w-full gap-2">
          {/* Colonne des jours */}
          <div
            className="grid shrink-0 gap-[3px] pt-[18px] text-[10px] leading-none text-muted-foreground"
            style={{ gridTemplateRows: `repeat(${DAYS_IN_WEEK}, 11px)` }}
            aria-hidden="true"
          >
            {Array.from({ length: DAYS_IN_WEEK }, (_, weekday) => (
              <span key={weekday} className="flex h-[11px] items-center pr-1">
                {WEEKDAY_LABELS[weekday] ?? ""}
              </span>
            ))}
          </div>

          <div>
            {/* Étiquettes de mois, alignées sur les colonnes de semaines */}
            <div className="flex gap-[3px] pb-[6px]" aria-hidden="true">
              {monthLabels.map((month, i) => (
                <span
                  key={i}
                  className="w-[11px] shrink-0 text-[10px] leading-none text-muted-foreground"
                >
                  {month ? <span className="whitespace-nowrap">{month}</span> : null}
                </span>
              ))}
            </div>

            {/* Le tableau lui-même : une colonne par semaine. */}
            <div
              className="flex gap-[3px]"
              role="img"
              aria-label={`Calendrier de contributions GitHub : ${contributions.total} contributions sur les 12 derniers mois`}
            >
              {weeks.map((week, i) => (
                <div
                  key={i}
                  className="grid shrink-0 gap-[3px]"
                  style={{ gridTemplateRows: `repeat(${DAYS_IN_WEEK}, 11px)` }}
                >
                  {toSlots(week.days).map((day, weekday) =>
                    day ? (
                      <span
                        key={weekday}
                        title={label(day)}
                        className="h-[11px] w-[11px] rounded-[2px] ring-1 ring-inset ring-foreground/5"
                        style={{ backgroundColor: `var(--gh-${LEVEL_INTENSITY[day.level]})` }}
                      />
                    ) : (
                      <span key={weekday} className="h-[11px] w-[11px]" />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-muted-foreground">
        <span>Moins</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span
            key={level}
            className="h-[11px] w-[11px] rounded-[2px] ring-1 ring-inset ring-foreground/5"
            style={{ backgroundColor: `var(--gh-${level})` }}
          />
        ))}
        <span>Plus</span>
      </div>
    </figure>
  );
}
