import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles/store";
import { routes, getBaseUrl } from "@/lib/routes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import type { Article } from "@/lib/articles/types";

const PAGE_TITLE = "Articles";
const INTRO_COPY =
  "Insights and updates from MAIA on EMS operations, AI-powered documentation, QA/QI best practices, compliance, and medical billing automation. Stay current with the ideas and tools shaping prehospital care.";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | MAIA`,
  description:
    "MAIA insights on EMS, AI documentation, QA/QI, compliance, and medical billing automation. Expert perspectives for ambulance and prehospital teams.",
  openGraph: {
    title: `${PAGE_TITLE} | MAIA`,
    description:
      "MAIA insights on EMS, AI documentation, QA/QI, compliance, and medical billing automation.",
    type: "website",
  },
  // Canonical: set NEXT_PUBLIC_SITE_URL for production. Sitemap: see getPublishedArticleSlugs() in store and app/sitemap.ts.
  ...(getBaseUrl() && {
    alternates: { canonical: `${getBaseUrl()}${routes.articles}` },
  }),
};

// ---------------------------------------------------------------------------
// Data: replace with backend API when adding pagination, database-backed search,
// or filtering. e.g. getPublishedArticles({ page, limit, q?, topic? })
// Revalidation: after mutations, call revalidatePath('/articles') or revalidateTag('articles').
// ---------------------------------------------------------------------------
export default async function ArticlesPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 section-spacing" role="main">
        <div className="container-page">
          {/* Page header */}
          <header className="mb-10 md:mb-12">
            <Link
              href={routes.home}
              className="text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
            >
              ← Home
            </Link>
            <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
              {PAGE_TITLE}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted leading-relaxed">
              {INTRO_COPY}
            </p>
          </header>

          {/* Article grid — hook pagination/filter UI here when backed by API */}
          {articles.length === 0 ? (
            <section aria-label="Article list">
              <p className="text-muted">No published articles yet.</p>
            </section>
          ) : (
            <section
              aria-label="Article list"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt)
    : new Date(article.updatedAt);
  const href = `/articles/${article.slug}`;

  return (
    <article
      className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
      itemScope
      itemType="https://schema.org/Article"
    >
      {/* Cover image or placeholder */}
      <div className="relative w-full aspect-[16/10] bg-surface border-b border-border shrink-0">
        {article.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImage}
            alt={article.coverImageAlt?.trim() || ""}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-muted/10 text-muted/50"
            aria-hidden
          >
            <svg
              className="w-12 h-12 sm:w-14 sm:h-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v12a2 2 0 01-2 2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 9h6M9 13h6"
              />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <time
          className="text-xs font-medium text-muted uppercase tracking-wide"
          dateTime={publishedDate.toISOString()}
        >
          {publishedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <h2 className="mt-2 text-lg font-semibold text-foreground leading-tight" itemProp="name">
          <Link
            href={href}
            itemProp="url"
            className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
          >
            {article.title}
          </Link>
        </h2>
        {article.excerpt && (
          <p className="mt-2 text-sm text-muted line-clamp-3 flex-grow leading-relaxed">
            {article.excerpt}
          </p>
        )}
        <p className="mt-4">
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
          >
            Read article
            <span aria-hidden>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>
        </p>
      </div>
    </article>
  );
}
