import type { Article, ArticleStatus, CreateArticleInput, UpdateArticleInput } from "./types";
import type { IArticleStorage } from "./storage";
import { FileArticleStorage } from "./adapters/file-storage";
import { slugFromTitle } from "./slug";

// ---------------------------------------------------------------------------
// Storage adapter: swap here to use MAIA backend or database instead of file.
// e.g. storage = new MaiaApiArticleStorage(process.env.MAIA_API_URL)
// ---------------------------------------------------------------------------
const storage: IArticleStorage = new FileArticleStorage();

function nextId(): string {
  return crypto.randomUUID();
}

function now(): string {
  return new Date().toISOString();
}

/** Seed data written when the store is empty (e.g. first run or missing file). */
function getSeedArticles(): Article[] {
  return [
    {
      id: "seed-1",
      title: "Why Documentation Speed Matters in EMS",
      slug: "why-documentation-speed-matters-in-ems",
      excerpt: "Faster, accurate reports mean less overtime and fewer compliance risks.",
      content: "Accurate and timely documentation is critical in emergency medical services. Delays lead to overtime, compliance risks, and billing backlogs. MAIA helps medics complete reports in a fraction of the time while keeping quality high.",
      coverImage: "",
      coverImageAlt: "",
      status: "published",
      publishedAt: "2025-01-15T10:00:00.000Z",
      updatedAt: "2025-01-15T10:00:00.000Z",
      seoTitle: "Why Documentation Speed Matters in EMS | MAIA",
      seoDescription: "Faster, accurate reports mean less overtime and fewer compliance risks.",
    },
    {
      id: "seed-2",
      title: "AI and Compliance: What You Need to Know",
      slug: "ai-and-compliance-what-you-need-to-know",
      excerpt: "How AI-assisted documentation can stay within regulatory guidelines.",
      content: "AI tools must support—not replace—clinical judgment. We outline how MAIA is designed to keep your documentation compliant with local and national standards while speeding up the process.",
      coverImage: "",
      coverImageAlt: "",
      status: "published",
      publishedAt: "2025-02-01T10:00:00.000Z",
      updatedAt: "2025-02-01T10:00:00.000Z",
      seoTitle: "AI and Compliance: What You Need to Know | MAIA",
      seoDescription: "How AI-assisted documentation can stay within regulatory guidelines.",
    },
    {
      id: "seed-3",
      title: "Draft: Future of EMS Tech",
      slug: "draft-future-of-ems-tech",
      excerpt: "Draft article—not visible on the public site.",
      content: "Coming soon.",
      coverImage: "",
      coverImageAlt: "",
      status: "draft",
      publishedAt: null,
      updatedAt: "2025-03-01T10:00:00.000Z",
      seoTitle: "",
      seoDescription: "",
    },
  ];
}

async function ensureSeed(): Promise<void> {
  const articles = await storage.readAll();
  if (articles.length === 0) {
    await storage.writeAll(getSeedArticles());
  }
}

/** Sort by updatedAt descending (newest first). */
function sortByUpdated(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => (b.updatedAt > a.updatedAt ? 1 : -1));
}

/**
 * Returns a slug that is unique among all articles. If existingSlug is provided,
 * that slug is treated as allowed (e.g. for the article being updated).
 * With a database backend, enforce uniqueness via a unique constraint on slug.
 */
export async function generateUniqueSlug(
  title: string,
  existingSlug?: string
): Promise<string> {
  await ensureSeed();
  const all = await storage.readAll();
  const existingSlugs = new Set(all.map((a) => a.slug));
  let base = slugFromTitle(title) || "article";
  if (!existingSlugs.has(base) || base === existingSlug) {
    return base;
  }
  let candidate = base;
  let n = 1;
  while (existingSlugs.has(candidate) && candidate !== existingSlug) {
    candidate = `${base}-${n}`;
    n += 1;
  }
  return candidate;
}

/** All articles (for admin), newest first. */
export async function getAllArticles(): Promise<Article[]> {
  await ensureSeed();
  const articles = await storage.readAll();
  return sortByUpdated(articles);
}

/** Only published articles, newest first (by updatedAt). */
export async function getPublishedArticles(): Promise<Article[]> {
  await ensureSeed();
  const articles = await storage.readAll();
  return sortByUpdated(articles.filter((a) => a.status === "published"));
}

/** Get one article by slug (any status). Returns null if not found. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  await ensureSeed();
  const articles = await storage.readAll();
  const found = articles.find((a) => a.slug === slug);
  return found ?? null;
}

/** Get one published article by slug. Returns null if not found or not published. */
export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "published") return null;
  return article;
}

/** Get one article by id (for admin edit). */
export async function getArticleById(id: string): Promise<Article | null> {
  await ensureSeed();
  const articles = await storage.readAll();
  const found = articles.find((a) => a.id === id);
  return found ?? null;
}

/** Latest N published articles (e.g. for footer). Only published; safe for public links. */
export async function getLatestPublishedArticles(limit: number): Promise<Article[]> {
  const published = await getPublishedArticles();
  return published.slice(0, limit);
}

/**
 * All published article slugs (e.g. for sitemap). Replace with DB/API when adding
 * sitemap integration (e.g. app/sitemap.ts using this or your backend).
 */
export async function getPublishedArticleSlugs(): Promise<string[]> {
  const articles = await getPublishedArticles();
  return articles.map((a) => a.slug);
}

/** Create article. Slug is made unique via generateUniqueSlug if not provided or conflicting. */
export async function createArticle(data: CreateArticleInput): Promise<Article> {
  await ensureSeed();
  const articles = await storage.readAll();
  const rawSlug = data.slug?.trim() || slugFromTitle(data.title) || "article";
  const existingSlugs = new Set(articles.map((a) => a.slug));
  const finalSlug = existingSlugs.has(rawSlug)
    ? await generateUniqueSlug(data.title, undefined)
    : rawSlug;

  const id = nextId();
  const updatedAt = now();
  const status: ArticleStatus = data.status ?? "draft";
  const publishedAt = status === "published" ? updatedAt : null;

  const article: Article = {
    id,
    title: data.title.trim(),
    slug: finalSlug,
    excerpt: (data.excerpt ?? "").trim(),
    content: (data.content ?? "").trim(),
    coverImage: (data.coverImage ?? "").trim(),
    coverImageAlt: (data.coverImageAlt ?? "").trim(),
    status,
    publishedAt,
    updatedAt,
    seoTitle: (data.seoTitle ?? "").trim(),
    seoDescription: (data.seoDescription ?? "").trim(),
  };
  articles.push(article);
  await storage.writeAll(articles);
  return article;
}

/** Update article by id. Validates slug uniqueness (current article's slug is allowed). */
export async function updateArticle(
  id: string,
  data: UpdateArticleInput
): Promise<Article | null> {
  await ensureSeed();
  const articles = await storage.readAll();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const existing = articles[index];
  const title = data.title !== undefined ? data.title.trim() : existing.title;
  let slug = existing.slug;
  if (data.slug !== undefined && data.slug.trim()) {
    const candidate = data.slug.trim();
    const takenByOther = articles.some((a) => a.id !== id && a.slug === candidate);
    slug = takenByOther ? await generateUniqueSlug(title, existing.slug) : candidate;
  } else if (data.title !== undefined) {
    slug = await generateUniqueSlug(title, existing.slug);
  }

  const updatedAt = now();
  const status: ArticleStatus = data.status ?? existing.status;
  const publishedAt =
    status === "published"
      ? existing.publishedAt || updatedAt
      : existing.status === "published"
        ? existing.publishedAt
        : null;

  const article: Article = {
    ...existing,
    title,
    slug,
    excerpt: data.excerpt !== undefined ? data.excerpt.trim() : existing.excerpt,
    content: data.content !== undefined ? data.content.trim() : existing.content,
    coverImage: data.coverImage !== undefined ? data.coverImage.trim() : existing.coverImage,
    coverImageAlt: data.coverImageAlt !== undefined ? data.coverImageAlt.trim() : existing.coverImageAlt,
    status,
    publishedAt,
    updatedAt,
    seoTitle: data.seoTitle !== undefined ? data.seoTitle.trim() : existing.seoTitle,
    seoDescription: data.seoDescription !== undefined ? data.seoDescription.trim() : existing.seoDescription,
  };
  articles[index] = article;
  await storage.writeAll(articles);
  return article;
}

/** Delete article by id. Returns true if removed, false if not found. */
export async function deleteArticle(id: string): Promise<boolean> {
  await ensureSeed();
  const articles = await storage.readAll();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  await storage.writeAll(filtered);
  return true;
}
