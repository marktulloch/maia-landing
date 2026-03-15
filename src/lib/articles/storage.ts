import type { Article } from "./types";

/**
 * Storage abstraction for articles. Swap this implementation to connect to
 * MAIA backend APIs or a database (e.g. Prisma, Drizzle) without changing
 * the rest of the app.
 *
 * Replace file-based storage by:
 * 1. Implementing IArticleStorage with your backend client (fetch to MAIA API,
 *    or Prisma/Drizzle repository).
 * 2. Passing that implementation to the store or default export in store.ts.
 */
export interface IArticleStorage {
  /** Load all articles. Called on every read; keep fast (e.g. index/query). */
  readAll(): Promise<Article[]>;
  /** Persist the full article list. For file store we replace entire file. */
  writeAll(articles: Article[]): Promise<void>;
}
