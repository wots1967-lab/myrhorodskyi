// Single source of truth for sitemap URLs.
// Edit this file when adding new public pages — sitemap.xml is regenerated
// automatically on every build (see vite.config.ts plugin below).

const BASE = "https://myrhorodskyi.com";

/**
 * Routes excluded from sitemap (kept in sync with public/robots.txt Disallow):
 * /tests/beck-anxiety, /tests/broverman, /tests/beck-depression,
 * /tests/pss10, /tests/dark-triad, /tests/temperament
 * Also excluded: legacy redirects, /test/* aliases, take/result subpaths,
 * privacy/terms (low SEO value).
 */
export const sitemapRoutes = [
  // Core pages
  { path: "/", changefreq: "weekly", priority: 1.0 },
  { path: "/tests", changefreq: "weekly", priority: 0.9 },
  { path: "/courses", changefreq: "monthly", priority: 0.8 },
  { path: "/resources", changefreq: "monthly", priority: 0.7 },

  // Public test pages
  { path: "/tests/finansova-osobystist", changefreq: "monthly", priority: 0.85 },
  { path: "/tests/profil-ego-staniv", changefreq: "monthly", priority: 0.8 },
  { path: "/tests/rozshyrenyi-profil-ego-staniv", changefreq: "monthly", priority: 0.8 },
  { path: "/tests/5-mov-lyubovi", changefreq: "monthly", priority: 0.8 },
  { path: "/tests/opytuvalnyk-rannih-shem-ysq", changefreq: "monthly", priority: 0.8 },
  { path: "/tests/diagnostyka-samosti-ifs", changefreq: "monthly", priority: 0.8 },
  { path: "/tests/klinichna-shkala-ifs", changefreq: "monthly", priority: 0.8 },
  { path: "/tests/profil-zahysnykiv-ifs", changefreq: "monthly", priority: 0.8 },

  // Legal
  { path: "/privacy", changefreq: "yearly", priority: 0.3 },
  { path: "/terms", changefreq: "yearly", priority: 0.3 },
];

export function buildSitemapXml(routes = sitemapRoutes, lastmod = new Date().toISOString().slice(0, 10)) {
  const urls = routes
    .map(
      ({ path, changefreq, priority }) => `  <url>
    <loc>${BASE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}