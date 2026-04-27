import { getBaseUrl, routes } from "@/lib/routes";
import { getPublishedArticleSlugs } from "@/lib/articles/store";

/**
 * Sitemap for SEO. Lists the articles index and all published article URLs.
 * Requires NEXT_PUBLIC_SITE_URL (absolute base URL) for valid absolute URLs.
 * Replace getPublishedArticleSlugs() with your backend/API when moving to
 * database-backed content (e.g. fetch slugs from CMS or search index).
 */
export default async function sitemap() {
  const base = getBaseUrl();
  if (!base) {
    return [];
  }

  const slugs = await getPublishedArticleSlugs();
  const articleEntries = slugs.map((slug) => ({
    url: `${base}/articles/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const staticPages = [
    { path: routes.bookTrial, changeFrequency: "monthly" as const, priority: 0.9 },
    { path: routes.freeTrial, changeFrequency: "monthly" as const, priority: 0.85 },
    { path: routes.onboarding, changeFrequency: "monthly" as const, priority: 0.5 },
    { path: routes.legalBaa, changeFrequency: "yearly" as const, priority: 0.4 },
    { path: routes.legalTerms, changeFrequency: "yearly" as const, priority: 0.4 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 1 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    ...staticPages,
    ...articleEntries,
  ];
}
