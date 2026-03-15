import Link from "next/link";
import { routes } from "@/lib/routes";
import { NewArticleForm } from "./_components/NewArticleForm";

export const metadata = {
  title: "New article | Admin | MAIA",
  description: "Create a new article.",
};

export default function AdminNewArticlePage() {
  return (
    <div className="container-page max-w-3xl">
      <Link
        href={routes.adminArticles}
        className="text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
      >
        ← Articles
      </Link>
      <header className="mt-4 mb-8">
        <h1 className="text-2xl font-bold text-foreground">New article</h1>
        <p className="mt-1 text-sm text-muted">
          Create a new article. Content is saved to local storage; connect the save action to your backend/API when ready.
        </p>
      </header>
      <NewArticleForm />
    </div>
  );
}
