import Link from "next/link";
import { routes, isExternalUrl } from "@/lib/routes";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const loginUrl = routes.login;
  const isLoginExternal = isExternalUrl(loginUrl);

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

          {/* Right: links */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
            <Link href={routes.about} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              About
            </Link>
            <Link href={routes.overview} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Overview
            </Link>
            <Link href={routes.features} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Features
            </Link>
            <Link href={routes.contact} className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Contact
            </Link>
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
            <Link href="#" className="hover:text-foreground transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background">
              Terms
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-sm text-muted">
          © {currentYear} MAIA
        </div>
      </div>
    </footer>
  );
}
