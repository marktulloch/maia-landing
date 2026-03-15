/**
 * Generate a clean, URL-safe slug from a title (lowercase, spaces → hyphens,
 * strip non-alphanumeric). Uniqueness is enforced in the store (generateUniqueSlug);
 * with a database, use a unique index on slug for consistency.
 */
export function slugFromTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "article";
}
