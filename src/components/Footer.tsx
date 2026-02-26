import Link from "next/link";
import { routes, isExternalUrl } from "@/lib/routes";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const loginUrl = routes.login;
  const isLoginExternal = isExternalUrl(loginUrl);

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link
              href={routes.about}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              href={routes.features}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href={routes.contact}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
            {isLoginExternal ? (
              <a
                href={loginUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </a>
            ) : (
              <Link
                href={loginUrl}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-600">
            © {currentYear} MAIA
          </div>
        </div>
      </div>
    </footer>
  );
}
