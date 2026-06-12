import { writeFileSync } from "fs";
import { resolve } from "path";

const SITE_URL = "https://artivistaa.com";

const BLOG_SLUGS = [
  "how-to-create-an-original-anime-character",
  "best-dnd-character-design-ideas",
  "fantasy-character-commission-guide",
  "character-design-tips-for-beginners",
  "how-professional-character-artists-work",
];

export function generateSitemap() {
  const pages = [
    { loc: "/", priority: "1.0", changefreq: "weekly" },
    { loc: "/about", priority: "0.7", changefreq: "monthly" },
    { loc: "/blog", priority: "0.8", changefreq: "weekly" },
    ...BLOG_SLUGS.map((slug) => ({
      loc: `/blog/${slug}`,
      priority: "0.6",
      changefreq: "monthly",
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url>
    <loc>${SITE_URL}${p.loc}</loc>
    <priority>${p.priority}</priority>
    <changefreq>${p.changefreq}</changefreq>
  </url>`).join("\n")}
</urlset>`;

  writeFileSync(resolve("dist", "sitemap.xml"), xml, "utf-8");
  console.log("sitemap.xml generated");
}
