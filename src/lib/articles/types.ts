/**
 * Article status. Only "published" articles are visible on the public site.
 */
export type ArticleStatus = "draft" | "published";

/**
 * Article data model. Persisted by the storage layer (file, DB, or MAIA backend).
 */
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  /** Alt text for cover image (SEO and accessibility). Optional for backward compatibility. */
  coverImageAlt?: string;
  status: ArticleStatus;
  /** ISO date string; set when status becomes "published". */
  publishedAt: string | null;
  /** ISO date string; updated on every change. */
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
}

/**
 * Input for creating a new article. Slug is optional; storage layer can
 * generate a unique slug from title via generateUniqueSlug().
 */
export interface CreateArticleInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  coverImageAlt?: string;
  status?: ArticleStatus;
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Input for updating an existing article. All fields optional; only provided
 * fields are updated. Slug uniqueness is validated when slug is present.
 */
export interface UpdateArticleInput {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  coverImageAlt?: string;
  status?: ArticleStatus;
  seoTitle?: string;
  seoDescription?: string;
}
