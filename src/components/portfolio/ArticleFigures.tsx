import { useContent } from "@/lib/i18n";
import type { ArticleChart, ArticleFigure, ArticleMetric, ArticleStat } from "@/lib/i18n";

/**
 * Illustration d'article : une image produite par le projet lui-même, avec sa
 * légende. `width` et `height` sont les dimensions intrinsèques du fichier -
 * les fournir réserve la place avant le chargement et évite que le texte saute.
 *
 * Le fond blanc est explicite : ces figures sont des sorties matplotlib sur
 * fond blanc, elles resteraient illisibles sur une surface sombre.
 */
export function Figure({ figure }: { figure: ArticleFigure }) {
  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <img
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full"
        />
      </div>
      <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {figure.caption}
      </figcaption>
    </figure>
  );
}

/**
 * Comparaison référence / modèle sur des mesures partageant une même unité.
 *
 * Barres horizontales groupées sur un axe unique : deux mesures d'échelles
 * différentes iraient dans deux graphes séparés, jamais sur deux axes. Le rendu
 * est en CSS pur - pas de JavaScript, donc le graphe est complet dès le HTML
 * servi, et il se redimensionne sans recalcul.
 *
 * Chaque barre porte sa valeur en clair : l'identité d'une série ne repose
 * jamais sur la seule couleur.
 */
export function MetricChart({ chart }: { chart: ArticleChart }) {
  const t = useContent();

  // Le séparateur décimal suit la langue affichée, pas celle du navigateur :
  // « 60,3 % » en français, « 60.3% » en anglais, et le rendu serveur et le
  // rendu client produisent le même texte.
  const num = (value: number) =>
    value.toLocaleString(t.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  // L'ordre des séries est fixe - référence d'abord, modèle ensuite - et chaque
  // teinte reste attachée à sa série quel que soit l'article.
  const series: Array<{ label: string; token: string; pick: (m: ArticleMetric) => number }> = [
    { label: chart.baselineLabel, token: "var(--viz-1)", pick: (m) => m.baseline },
    { label: chart.valueLabel, token: "var(--viz-2)", pick: (m) => m.value },
  ];

  return (
    <figure className="mt-8 rounded-xl border border-border bg-card p-5 sm:p-6">
      <figcaption className="text-sm font-semibold text-foreground">{chart.title}</figcaption>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {series.map((s) => (
          <span key={s.label} className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ backgroundColor: s.token }}
              aria-hidden="true"
            />
            {s.label}
          </span>
        ))}
      </div>

      <div className="mt-5 space-y-5">
        {chart.metrics.map((metric) => (
          <div key={metric.label}>
            <div className="text-xs font-medium text-foreground/80">{metric.label}</div>

            <div className="mt-2 space-y-[2px]">
              {series.map((s) => {
                const value = s.pick(metric);
                const width = `${Math.max(0, Math.min(100, (value / chart.max) * 100))}%`;

                return (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className="h-3.5 min-w-0 flex-1 rounded-[2px] bg-muted">
                      <div
                        className="h-full rounded-r-[4px]"
                        style={{ width, backgroundColor: s.token }}
                        role="img"
                        aria-label={`${s.label} - ${metric.label} : ${num(value)}${chart.unit}`}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                      {num(value)}
                      {chart.unit}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
        {chart.source}
      </p>
    </figure>
  );
}

/**
 * Chiffres isolés qui ne gagneraient rien à être tracés : une valeur seule se
 * lit mieux en grand qu'en barre d'un pixel.
 */
export function StatTiles({ stats }: { stats: ArticleStat[] }) {
  return (
    <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card p-5">
          <div className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {stat.value}
          </div>
          <div className="mt-1 text-xs leading-relaxed text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
