import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPublishedArticleBySlug,
  getLatestPublishedArticles,
} from "@/lib/articles/store";
import { routes, getBaseUrl } from "@/lib/routes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

const RELATED_ARTICLES_LIMIT = 4;

type Props = { params: Promise<{ slug: string }> };

// ---------------------------------------------------------------------------
// Data: article and related list come from local storage. When moving to
// backend, replace with API calls (e.g. getArticleBySlug(slug), getRelated(slug, limit)).
// Revalidation: after CMS/API mutations, call revalidatePath(`/articles/${slug}`) or revalidateTag('article-' + slug).
// Canonical: built below from getBaseUrl(); set NEXT_PUBLIC_SITE_URL in production.
// Sitemap: use getPublishedArticleSlugs() in app/sitemap.ts to list article URLs.
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) {
    return { title: "Article | MAIA" };
  }
  const title = article.seoTitle || `${article.title} | MAIA`;
  const description =
    article.seoDescription || article.excerpt || undefined;
  const canonicalUrl = getBaseUrl() ? `${getBaseUrl()}/articles/${slug}` : undefined;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      url: canonicalUrl,
    },
    ...(canonicalUrl && {
      alternates: { canonical: canonicalUrl },
    }),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  // Related: latest published, excluding current. Replace with backend API when available.
  const latest = await getLatestPublishedArticles(RELATED_ARTICLES_LIMIT + 1);
  const related = latest.filter((a) => a.id !== article.id).slice(0, RELATED_ARTICLES_LIMIT);

  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt)
    : new Date(article.updatedAt);

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 section-spacing" role="main">
        <div className="container-page">
          <article itemScope itemType="https://schema.org/Article">
            {/* Back to Articles — keep above the fold for navigation */}
            <nav aria-label="Breadcrumb" className="mb-6">
              <Link
                href={routes.articles}
                className="text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
              >
                ← Back to Articles
              </Link>
            </nav>

            <header className="max-w-3xl mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight" itemProp="headline">
                {article.title}
              </h1>
              <time
                className="mt-3 block text-sm text-muted"
                dateTime={publishedDate.toISOString()}
                itemProp="datePublished"
              >
                {publishedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <meta itemProp="dateModified" content={article.updatedAt} />
            </header>

            {/* Cover image: optional. Alt text from article.coverImageAlt (SEO and accessibility). */}
            {article.coverImage && (
              <figure className="max-w-3xl mb-8 w-full flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.coverImageAlt?.trim() || ""}
                  className="block max-w-full h-auto mx-auto rounded-xl border border-border bg-surface"
                />
              </figure>
            )}

            {/* Article body: supports plain text or HTML (e.g. from Tiptap). For production,
                sanitize HTML (e.g. DOMPurify) before rendering when content is backend-fed.
                Inline images in HTML: add alt text via Tiptap/editor or CMS when backend supports it. */}
            <div className="article-body">
              <ArticleContent content={article.content} />
            </div>

            {/* Related / latest articles */}
            {related.length > 0 && (
              <aside
                className="mt-16 pt-10 border-t border-border max-w-3xl"
                aria-label="Related articles"
              >
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  More articles
                </h2>
                <ul className="space-y-3">
                  {related.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={`/articles/${item.slug}`}
                        className="text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** Renders article body: HTML from Tiptap/CMS, or plain text as paragraphs. */
function ArticleContent({ content }: { content: string }) {
  if (!content.trim()) return null;
  const isHtml = content.trimStart().startsWith("<");
  if (isHtml) {
    return (
      <div
        className="article-body-html"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  const paragraphs = content.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i}>
          {para.split("\n").map((line, j) => (
            <span key={j}>
              {j > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
      ))}
    </>
  );
}
