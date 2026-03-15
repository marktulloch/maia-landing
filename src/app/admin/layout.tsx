import Link from "next/link";
import { routes } from "@/lib/routes";
import { isAdminAllowed } from "@/lib/admin/guard";
import Unauthorized from "./_components/Unauthorized";

/**
 * Admin layout: protects all /admin/* routes (including /admin/articles, new, edit).
 *
 * TEMPORARY: Guard is config-based (ADMIN_ACCESS_ENABLED). For production,
 * replace isAdminAllowed() in src/lib/admin/guard.ts with real session + role
 * checks, and optionally use requireAdminOrRedirect() here to send unauthorized
 * users to login (e.g. redirect('/login?returnUrl=' + pathname)) instead of
 * showing the Unauthorized page.
 */
export default function AdminLayout({
  children,
}: { children: React.ReactNode }) {
  if (!isAdminAllowed()) {
    return <Unauthorized />;
  }

  return (
    <div className="min-h-dvh flex flex-col bg-surface/30">
      <header className="border-b border-border bg-background">
        <div className="container-page py-4 flex items-center justify-between">
          <Link
            href={routes.home}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            ← MAIA
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              href={routes.adminArticles}
              className="text-muted hover:text-foreground transition-colors"
            >
              Articles
            </Link>
            <Link
              href={routes.adminArticlesNew}
              className="text-primary hover:underline"
            >
              New article
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 section-spacing">{children}</main>
    </div>
  );
}
