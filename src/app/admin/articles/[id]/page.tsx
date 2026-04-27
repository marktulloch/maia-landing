import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/articles/store";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  return {
    title: article ? `${article.title} | Admin | MAIA` : "Article | Admin | MAIA",
  };
}

export default async function AdminArticleViewPage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div className="container-page">
      <nav className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link
          href={routes.adminArticles}
          className="text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
        >
          ← Articles
        </Link>
        <Link
          href={routes.adminArticleEdit(article.id)}
          className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
        >
          Edit
        </Link>
        {article.status === "published" && (
          <Link
            href={`/articles/${article.slug}`}
            className="text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
          >
            View on site
          </Link>
        )}
      </nav>

      <article>
        <header className="max-w-3xl mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            {article.title}
          </h1>
          <p className="mt-2 text-sm text-muted">
            <span className="font-mono">{article.slug}</span>
            <span className="mx-2">·</span>
            <span>{article.status}</span>
          </p>
        </header>

        {article.coverImage?.trim() && (
          <figure className="mb-8 w-full flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImage}
              alt={article.coverImageAlt?.trim() || ""}
              className="block max-w-full h-auto mx-auto rounded-xl border border-border bg-surface"
            />
          </figure>
        )}

        <div className="article-body max-w-3xl">
          <ArticleContent content={article.content} />
        </div>
      </article>
    </div>
  );
}

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
