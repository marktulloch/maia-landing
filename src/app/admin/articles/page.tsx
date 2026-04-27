import Link from "next/link";
import { getAllArticles } from "@/lib/articles/store";
import { routes } from "@/lib/routes";
import { DeleteArticleButton } from "./_components/DeleteArticleButton";
import type { Article } from "@/lib/articles/types";

export const metadata = {
  title: "Articles | Admin | MAIA",
  description: "Manage articles.",
};

function StatusBadge({ status }: { status: Article["status"] }) {
  const isPublished = status === "published";
  return (
    <span
      className={
        isPublished
          ? "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/15 text-primary"
          : "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted/50 text-muted"
      }
    >
      {status}
    </span>
  );
}

function formatUpdatedAt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <div className="container-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">Articles</h1>
        <Link
          href={routes.adminArticlesNew}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background shrink-0"
        >
          New Article
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-border bg-background p-8 text-center text-muted">
          No articles yet. Create one to get started.
        </div>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="hidden md:block rounded-lg border border-border bg-background overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface/50">
                  <th className="px-4 py-3 font-semibold text-foreground">Title</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Slug</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Updated</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr
                    key={article.id}
                    className="border-b border-border last:border-b-0 hover:bg-surface/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={routes.adminArticleView(article.id)}
                        className="font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
                      >
                        {article.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted font-mono text-xs truncate max-w-[12rem]">
                      {article.slug}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={article.status} />
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {formatUpdatedAt(article.updatedAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={routes.adminArticleEdit(article.id)}
                          className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
                        >
                          Edit
                        </Link>
                        <DeleteArticleButton id={article.id} title={article.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <ul className="md:hidden space-y-3">
            {articles.map((article) => (
              <li
                key={article.id}
                className="p-4 rounded-lg border border-border bg-background flex flex-col gap-3"
              >
                <div>
                  <Link
                    href={routes.adminArticleView(article.id)}
                    className="font-medium text-foreground hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
                  >
                    {article.title}
                  </Link>
                  <p className="text-xs text-muted font-mono mt-0.5 truncate">{article.slug}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={article.status} />
                  <span className="text-xs text-muted">{formatUpdatedAt(article.updatedAt)}</span>
                </div>
                <div className="flex gap-3 pt-1">
                  <Link
                    href={routes.adminArticleEdit(article.id)}
                    className="text-sm text-primary hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteArticleButton id={article.id} title={article.title} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
