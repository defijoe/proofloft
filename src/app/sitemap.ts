// Dynamic sitemap for Google/Bing: marketing + docs + legal pages, plus every
// live public wall that has at least one published testimonial. Walls are the
// growth loop (badge links back), so getting them indexed helps customers AND us.
import { MetadataRoute } from "next";
import { query } from "@factory/core";
import { POSTS } from "./blog/posts";

export const dynamic = "force-dynamic";

const BASE = "https://proofloft.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/docs/embed`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/support`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/vs/senja`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/vs/testimonial-to`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    ...POSTS.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(`${p.date}T12:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${BASE}/legal/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/legal/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/legal/ai`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/legal/dpa`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Public walls with published content. Empty walls stay out — thin pages
  // help nobody's ranking. If the DB hiccups, ship the static pages anyway.
  try {
    const walls = await query<{ slug: string }>(
      `select f.slug from forms f
       where not f.archived
         and exists (select 1 from testimonials t
                     where t.form_id = f.id and t.approved and t.consent)
       order by f.id`
    );
    for (const w of walls) {
      pages.push({ url: `${BASE}/w/${w.slug}`, lastModified: now, changeFrequency: "daily", priority: 0.5 });
    }
  } catch (e) {
    console.error("[sitemap] wall lookup failed:", e);
  }

  return pages;
}
