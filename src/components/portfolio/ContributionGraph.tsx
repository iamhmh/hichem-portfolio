import type { Activity, ActivityDay } from "@/lib/activity";

// Les semaines renvoyées par GitHub peuvent être partielles aux deux extrémités
// (l'année glissante ne commence pas forcément un dimanche). On projette donc
// chaque semaine sur 7 cases indexées par `weekday`, les manquantes restant vides.
const DAYS_IN_WEEK = 7;

/** 13 px au lieu des 11 px de GitHub : en dessous, la coupe diagonale devient illisible. */
const CELL = 13;

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});
const MONTH_FMT = new Intl.DateTimeFormat("fr-FR", { month: "short" });

/** Libellés de gauche : seules 3 lignes sont annotées, comme sur GitHub. */
const WEEKDAY_LABELS: Record<number, string> = { 1: "Lun", 3: "Mer", 5: "Ven" };

function toSlots(days: ActivityDay[]): Array<ActivityDay | null> {
  const slots = Array.from<ActivityDay | null>({ length: DAYS_IN_WEEK }).fill(null);
  for (const day of days) {
    if (day.weekday >= 0 && day.weekday < DAYS_IN_WEEK) slots[day.weekday] = day;
  }
  return slots;
}

function plural(n: number) {
  return n > 1 ? "s" : "";
}

function label(day: ActivityDay, hasGitlab: boolean): string {
  const date = DATE_FMT.format(new Date(`${day.date}T00:00:00Z`));
  if (!hasGitlab) {
    return day.github === 0
      ? `Aucune contribution le ${date}`
      : `${day.github} contribution${plural(day.github)} le ${date}`;
  }
  if (day.github === 0 && day.gitlab === 0) return `Aucune contribution le ${date}`;
  return `${day.github} GitHub · ${day.gitlab} GitLab le ${date}`;
}

/**
 * La coupe en diagonale est réservée aux journées où les DEUX sources ont eu de
 * l'activité : elle signale un chevauchement, elle n'est pas le rendu par
 * défaut. Une journée à source unique reste un carré plein de sa couleur, ce
 * qui rend la grille nettement plus lisible qu'une diagonale systématique.
 *
 * Le dégradé à transition nette (0 50% / 50% 100%) produit la coupe sans
 * surcoût de balisage : une seule div par jour dans tous les cas.
 */
function cellBackground(day: ActivityDay, hasGitlab: boolean): string {
  const gh = `var(--gh-${day.githubLevel})`;
  if (!hasGitlab) return gh;

  if (day.github > 0 && day.gitlab > 0) {
    return `linear-gradient(135deg, ${gh} 0 50%, var(--gl-${day.gitlabLevel}) 50% 100%)`;
  }

  // GitLab seul -> carré orange plein. GitHub seul ou journée vide -> carré
  // vert plein ; --gh-0 et --gl-0 étant identiques, un jour sans activité reste
  // neutre quelle que soit la branche empruntée.
  return day.gitlab > 0 ? `var(--gl-${day.gitlabLevel})` : gh;
}

function Legend({ prefix, token }: { prefix: string; token: "gh" | "gl" }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span className="mr-0.5">{prefix}</span>
      <span>Moins</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <span
          key={level}
          className="rounded-[2px] ring-1 ring-inset ring-foreground/5"
          style={{
            width: CELL,
            height: CELL,
            backgroundColor: `var(--${token}-${level})`,
          }}
        />
      ))}
      <span>Plus</span>
    </div>
  );
}

export function ContributionGraph({ activity }: { activity: Activity }) {
  const { weeks, githubTotal, gitlabTotal, hasGitlab } = activity;
  const total = githubTotal + gitlabTotal;

  // Une étiquette de mois est posée sur la première semaine où le mois change.
  const monthLabels = weeks.map((week, i) => {
    const first = week.days[0];
    if (!first || i === 0) return null; // évite un libellé tronqué sur une semaine partielle
    const prev = weeks[i - 1]?.days[0];
    if (!prev) return null;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    const prevMonth = new Date(`${prev.date}T00:00:00Z`).getUTCMonth();
    return month === prevMonth ? null : MONTH_FMT.format(new Date(`${first.date}T00:00:00Z`));
  });

  const summary = hasGitlab
    ? `${total.toLocaleString("fr-FR")} contributions sur les 12 derniers mois`
    : `${githubTotal.toLocaleString("fr-FR")} contributions sur les 12 derniers mois`;

  return (
    <figure className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-semibold text-foreground">{summary}</span>
        {hasGitlab ? (
          <span className="text-xs text-muted-foreground">
            {githubTotal.toLocaleString("fr-FR")} sur GitHub ·{" "}
            {gitlabTotal.toLocaleString("fr-FR")} sur GitLab
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">Source : GitHub</span>
        )}
      </figcaption>

      {/* Le calendrier dépasse en largeur sur mobile : il défile dans son propre
          conteneur, jamais le corps de la page. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <div className="inline-flex min-w-full gap-2">
          {/* Colonne des jours */}
          <div
            className="grid shrink-0 gap-[3px] text-[10px] leading-none text-muted-foreground"
            style={{ gridTemplateRows: `repeat(${DAYS_IN_WEEK}, ${CELL}px)`, paddingTop: 18 }}
            aria-hidden="true"
          >
            {Array.from({ length: DAYS_IN_WEEK }, (_, weekday) => (
              <span
                key={weekday}
                className="flex items-center pr-1"
                style={{ height: CELL }}
              >
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
                  className="shrink-0 text-[10px] leading-none text-muted-foreground"
                  style={{ width: CELL }}
                >
                  {month ? <span className="whitespace-nowrap">{month}</span> : null}
                </span>
              ))}
            </div>

            {/* Le tableau lui-même : une colonne par semaine. */}
            <div
              className="flex gap-[3px]"
              role="img"
              aria-label={
                hasGitlab
                  ? `Calendrier de contributions : ${githubTotal} sur GitHub et ${gitlabTotal} sur GitLab au cours des 12 derniers mois`
                  : `Calendrier de contributions GitHub : ${githubTotal} contributions sur les 12 derniers mois`
              }
            >
              {weeks.map((week, i) => (
                <div
                  key={i}
                  className="grid shrink-0 gap-[3px]"
                  style={{ gridTemplateRows: `repeat(${DAYS_IN_WEEK}, ${CELL}px)` }}
                >
                  {toSlots(week.days).map((day, weekday) =>
                    day ? (
                      <span
                        key={weekday}
                        title={label(day, hasGitlab)}
                        className="rounded-[2px] ring-1 ring-inset ring-foreground/5"
                        style={{
                          width: CELL,
                          height: CELL,
                          background: cellBackground(day, hasGitlab),
                        }}
                      />
                    ) : (
                      <span key={weekday} style={{ width: CELL, height: CELL }} />
                    ),
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-end gap-x-6 gap-y-2">
        {hasGitlab ? (
          <>
            {/* Sans cette mention, une case coupée se lit comme une troisième
                couleur au lieu d'un chevauchement entre les deux sources. */}
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span
                className="rounded-[2px] ring-1 ring-inset ring-foreground/5"
                style={{
                  width: CELL,
                  height: CELL,
                  background:
                    "linear-gradient(135deg, var(--gh-3) 0 50%, var(--gl-3) 50% 100%)",
                }}
                aria-hidden="true"
              />
              <span>les deux le même jour</span>
            </div>
            <Legend prefix="GitHub" token="gh" />
            <Legend prefix="GitLab" token="gl" />
          </>
        ) : (
          <Legend prefix="" token="gh" />
        )}
      </div>
    </figure>
  );
}
