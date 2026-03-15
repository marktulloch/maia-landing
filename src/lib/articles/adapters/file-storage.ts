import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { Article } from "../types";
import type { IArticleStorage } from "../storage";

/** Path to the JSON file. Uses project root / data / articles.json. */
const DEFAULT_DATA_DIR = "data";
const DEFAULT_FILENAME = "articles.json";

/**
 * File-based article storage. Data persists across server restarts but is
 * not shared across multiple instances or serverless invocations.
 *
 * REPLACE WITH: MAIA backend API or database (Prisma/Drizzle). Implement
 * IArticleStorage in a new adapter (e.g. adapters/maia-api.ts or
 * adapters/prisma-storage.ts) and swap the default in store.ts.
 */
export class FileArticleStorage implements IArticleStorage {
  private readonly filePath: string;

  constructor(options?: { dataDir?: string; filename?: string }) {
    const dataDir = options?.dataDir ?? DEFAULT_DATA_DIR;
    const filename = options?.filename ?? DEFAULT_FILENAME;
    this.filePath = join(process.cwd(), dataDir, filename);
  }

  async readAll(): Promise<Article[]> {
    try {
      const raw = await readFile(this.filePath, "utf-8");
      const data = JSON.parse(raw) as unknown;
      return Array.isArray(data) ? (data as Article[]) : [];
    } catch (err) {
      const code = err && typeof err === "object" && "code" in err ? (err as NodeJS.ErrnoException).code : null;
      if (code === "ENOENT") {
        return [];
      }
      throw err;
    }
  }

  async writeAll(articles: Article[]): Promise<void> {
    const dir = join(process.cwd(), DEFAULT_DATA_DIR);
    await mkdir(dir, { recursive: true });
    await writeFile(this.filePath, JSON.stringify(articles, null, 2), "utf-8");
  }
}
