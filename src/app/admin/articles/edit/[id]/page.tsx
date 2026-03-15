import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/articles/store";
import { updateArticleAction } from "../../actions";
import { routes } from "@/lib/routes";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return { title: "Edit | Admin | MAIA" };
  return { title: `Edit: ${article.title} | Admin | MAIA` };
}

export default async function AdminEditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  return (
    <div className="container-page max-w-2xl">
      <Link
        href={routes.adminArticles}
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        ← Articles
      </Link>
      <h1 className="mt-4 mb-6 text-2xl font-bold text-foreground">
        Edit: {article.title}
      </h1>

      <form action={updateArticleAction.bind(null, id)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-foreground mb-1">
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={article.title}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Article title"
          />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-foreground mb-1">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={article.slug}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="url-slug"
          />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={article.excerpt}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Short summary"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-foreground mb-1">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={8}
            defaultValue={article.content}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
            placeholder="Article body"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={article.status === "published"}
            className="rounded border-border text-primary focus:ring-ring"
          />
          <label htmlFor="published" className="text-sm text-foreground">
            Published
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Save changes
          </button>
          <Link
            href={routes.adminArticles}
            className="px-4 py-2 text-sm font-medium rounded-md border border-border text-foreground hover:bg-surface transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
