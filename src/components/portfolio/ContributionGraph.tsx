import { useMemo } from "react";

import type { Activity, ActivityDay } from "@/lib/activity";
import { useContent, type Content } from "@/lib/i18n";

// Les semaines renvoyées par GitHub peuvent être partielles aux deux extrémités
// (l'année glissante ne commence pas forcément un dimanche). On projette donc
// chaque semaine sur 7 cases indexées par `weekday`, les manquantes restant vides.
const DAYS_IN_WEEK = 7;

/** 13 px au lieu des 11 px de GitHub : en dessous, la coupe diagonale devient illisible. */
const CELL = 13;

function toSlots(days: ActivityDay[]): Array<ActivityDay | null> {
  const slots = Array.from<ActivityDay | null>({ length: DAYS_IN_WEEK }).fill(null);
  for (const day of days) {
    if (day.weekday >= 0 && day.weekday < DAYS_IN_WEEK) slots[day.weekday] = day;
  }
  return slots;
}

function label(
  day: ActivityDay,
  hasGitlab: boolean,
  t: Content,
  dateFmt: Intl.DateTimeFormat,
): string {
  const date = dateFmt.format(new Date(`${day.date}T00:00:00Z`));
  if (!hasGitlab) {
    return day.github === 0 ? t.graph.noneOn(date) : t.graph.countOn(day.github, date);
  }
  if (day.github === 0 && day.gitlab === 0) return t.graph.noneOn(date);
  return t.graph.bothOn(day.github, day.gitlab, date);
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
  const t = useContent();

  return (
    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
      <span className="mr-0.5">{prefix}</span>
      <span>{t.graph.less}</span>
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
      <span>{t.graph.more}</span>
    </div>
  );
}

export function ContributionGraph({ activity }: { activity: Activity }) {
  const { weeks, githubTotal, gitlabTotal, hasGitlab } = activity;
  const total = githubTotal + gitlabTotal;
  const t = useContent();

  // Dates et nombres suivent la langue affichée, pas la locale du navigateur :
  // le rendu serveur et le rendu client doivent produire le même texte.
  const { dateFmt, monthFmt } = useMemo(
    () => ({
      dateFmt: new Intl.DateTimeFormat(t.locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      monthFmt: new Intl.DateTimeFormat(t.locale, { month: "short" }),
    }),
    [t.locale],
  );

  const num = (value: number) => value.toLocaleString(t.locale);

  // Une étiquette de mois est posée sur la première semaine où le mois change.
  const monthLabels = weeks.map((week, i) => {
    const first = week.days[0];
    if (!first || i === 0) return null; // évite un libellé tronqué sur une semaine partielle
    const prev = weeks[i - 1]?.days[0];
    if (!prev) return null;
    const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    const prevMonth = new Date(`${prev.date}T00:00:00Z`).getUTCMonth();
    return month === prevMonth ? null : monthFmt.format(new Date(`${first.date}T00:00:00Z`));
  });

  const summary = t.graph.summary(num(hasGitlab ? total : githubTotal));

  return (
    <figure className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <span className="text-sm font-semibold text-foreground">{summary}</span>
        {hasGitlab ? (
          <span className="text-xs text-muted-foreground">
            {t.graph.split(num(githubTotal), num(gitlabTotal))}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">{t.graph.sourceGithub}</span>
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
              <span key={weekday} className="flex items-center pr-1" style={{ height: CELL }}>
                {t.graph.weekdays[weekday] ?? ""}
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
                  ? t.graph.ariaBoth(githubTotal, gitlabTotal)
                  : t.graph.ariaGithub(githubTotal)
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
                        title={label(day, hasGitlab, t, dateFmt)}
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
                  background: "linear-gradient(135deg, var(--gh-3) 0 50%, var(--gl-3) 50% 100%)",
                }}
                aria-hidden="true"
              />
              <span>{t.graph.bothSameDay}</span>
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
