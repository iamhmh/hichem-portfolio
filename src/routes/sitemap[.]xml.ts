import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { DEFAULT_LANG, LANGS, urlForLang } from "@/lib/i18n/content";

interface SitemapEntry {
  loc: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  /** Versions équivalentes de la page, déclarées en xhtml:link. */
  alternates?: Array<{ hreflang: string; href: string }>;
}

/** Les URL portent un `?lang=`, donc une esperluette : sans échappement le XML est invalide. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        // Chaque langue est une URL à part entière, et chacune déclare l'autre
        // en alternate : c'est ce qui évite que Google les traite comme du
        // contenu dupliqué plutôt que comme deux traductions.
        const alternates = [
          ...LANGS.map((lang) => ({ hreflang: lang, href: urlForLang(lang) })),
          { hreflang: "x-default", href: urlForLang(DEFAULT_LANG) },
        ];

        const entries: SitemapEntry[] = LANGS.map((lang) => ({
          loc: urlForLang(lang),
          changefreq: "weekly",
          priority: lang === DEFAULT_LANG ? "1.0" : "0.9",
          alternates,
        }));

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${escapeXml(e.loc)}</loc>`,
            ...(e.alternates ?? []).map(
              (alt) =>
                `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${escapeXml(alt.href)}" />`,
            ),
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
