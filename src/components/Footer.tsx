import Link from "next/link";
import TrialNavLink from "@/components/TrialNavLink";
import { routes, isExternalUrl, homeSectionHref } from "@/lib/routes";
import { getLatestPublishedArticles } from "@/lib/articles/store";

const LATEST_ARTICLES_LIMIT = 10;

// Footer: only published articles. getLatestPublishedArticles() returns published only; safe for public links.
// Can later be fed from backend content APIs or CMS.
export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const loginUrl = routes.login;
  const isLoginExternal = isExternalUrl(loginUrl);
  const latestArticles = await getLatestPublishedArticles(LATEST_ARTICLES_LIMIT);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page py-10 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-10">
          {/* Left: logo placeholder + tagline */}
          <div className="max-w-xs">
            <div className="text-xl font-bold text-foreground mb-2">MAIA</div>
            <p className="text-sm text-muted leading-relaxed">
              AI documentation + compliance for EMS.
            </p>
          </div>

          {/* Right: links + latest articles */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            <Link
              href={homeSectionHref(routes.about)}
              className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              About
            </Link>
            <Link
              href={homeSectionHref(routes.overview)}
              className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              Overview
            </Link>
            <Link
              href={homeSectionHref(routes.features)}
              className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              Features
            </Link>
            <Link href={routes.articles} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Articles
            </Link>
            <Link
              href={homeSectionHref(routes.contact)}
              className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              Contact
            </Link>
            <TrialNavLink className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Start FREE TRIAL
            </TrialNavLink>
            {isLoginExternal ? (
              <a
                href={loginUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              >
                Login
              </a>
            ) : (
              <Link href={loginUrl} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
                Login
              </Link>
            )}
            <Link href="#" className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Privacy Policy
            </Link>
            <Link href={routes.legalTerms} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Terms
            </Link>
            <Link href={routes.legalBaa} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              BAA
            </Link>
            </div>
            {latestArticles.length > 0 && (
              <div className="text-sm min-w-0">
                <p className="font-medium text-foreground mb-2">Latest articles</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-muted">
                  {latestArticles.map((article) => (
                    <li key={article.id}>
                      <Link
                        href={`/articles/${article.slug}`}
                        className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background truncate block"
                      >
                        {article.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-sm text-muted">
          © {currentYear} MAIA
        </div>
      </div>
    </footer>
  );
}
