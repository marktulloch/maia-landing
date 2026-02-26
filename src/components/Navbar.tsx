import Link from "next/link";
import { routes, isExternalUrl } from "@/lib/routes";

export default function Navbar() {
  const loginUrl = routes.login;
  const isLoginExternal = isExternalUrl(loginUrl);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={routes.home} className="text-2xl font-bold text-gray-900">
              MAIA
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href={routes.about}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              href={routes.features}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href={routes.contact}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Login Button */}
          <div className="flex items-center">
            {isLoginExternal ? (
              <a
                href={loginUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Login
              </a>
            ) : (
              <Link
                href={loginUrl}
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
