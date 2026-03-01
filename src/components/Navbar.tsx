"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { routes, isExternalUrl } from "@/lib/routes";
import { useEffect, useState } from "react";

const SCROLL_THRESHOLD_PX = 16;

const navLinks = [
  { href: routes.about, label: "About" },
  { href: routes.overview, label: "Overview" },
  { href: routes.features, label: "Features" },
  { href: routes.contact, label: "Contact" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loginUrl = routes.login;
  const demoUrl = routes.demo;
  const isLoginExternal = isExternalUrl(loginUrl);
  const isDemoExternal = isExternalUrl(demoUrl);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/" && !window.location.hash) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  const loginClassName =
    "px-4 py-2.5 text-sm font-medium rounded-md border border-primary text-primary bg-transparent hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200";

  const linkClassName =
    "text-muted hover:text-foreground transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background py-1";

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-200 ${
          isScrolled
            ? "border-b border-border bg-background shadow-[0_1px_3px_0_rgba(0,0,0,0.06)]"
            : "border-b border-transparent bg-transparent shadow-none"
        }`}
      >
        <div className="container-page">
          <div className="flex items-center justify-between h-16 min-h-14 gap-4">
            {/* Logo – left */}
            <div className="flex-shrink-0 flex items-center">
              <Link
                href={routes.home}
                onClick={handleLogoClick}
                className="flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                aria-label="MAIA – go to top"
              >
                <img
                  src="/maia_white_bg.png"
                  alt="MAIA"
                  className="block h-12 max-h-12 w-auto max-w-[200px] object-contain object-left"
                />
              </Link>
            </div>

            {/* Nav links – centered, desktop only */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-8">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={linkClassName}>
                  {label}
                </Link>
              ))}
            </div>

            {/* Right: Login (desktop) or Hamburger (mobile/tablet) */}
            <div className="flex-shrink-0 flex justify-end items-center min-w-[4.5rem] gap-2">
              <div className="hidden md:block">
                {isLoginExternal ? (
                  <a href={loginUrl} target="_blank" rel="noopener noreferrer" className={loginClassName}>
                    Login
                  </a>
                ) : (
                  <Link href={loginUrl} className={loginClassName}>
                    Login
                  </Link>
                )}
              </div>
              {/* Hamburger / Close – mobile/tablet: same button toggles so X is always reachable */}
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                className="md:hidden p-2 -mr-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/tablet menu overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-200 ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMenuOpen}
      >
        {/* Backdrop */}
        <button
          type="button"
          onClick={closeMenu}
          className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
          aria-label="Close menu"
        />
        {/* Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-full max-w-sm bg-background border-l border-border shadow-xl flex flex-col transition-transform duration-200 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header: logo + close */}
          <div className="flex items-center justify-between h-16 min-h-14 px-4 border-b border-border flex-shrink-0">
            <Link
              href={routes.home}
              onClick={handleLogoClick}
              className="flex items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              aria-label="MAIA – go to top"
            >
              <img
                src="/maia_white_bg.png"
                alt="MAIA"
                className="block h-10 max-h-10 w-auto max-w-[160px] object-contain object-left"
              />
            </Link>
            <button
              type="button"
              onClick={closeMenu}
              className="p-2 -mr-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Links */}
          <nav className="flex-1 overflow-auto py-6 px-4">
            <ul className="space-y-1">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className="block py-3 px-2 text-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* CTAs at bottom of menu */}
            <div className="mt-8 pt-6 border-t border-border space-y-3">
              {isLoginExternal ? (
                <a
                  href={loginUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={loginClassName + " w-full block text-center"}
                  onClick={closeMenu}
                >
                  Login
                </a>
              ) : (
                <Link
                  href={loginUrl}
                  className={loginClassName + " w-full block text-center"}
                  onClick={closeMenu}
                >
                  Login
                </Link>
              )}
              {isDemoExternal ? (
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block text-center py-3 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  onClick={closeMenu}
                >
                  Schedule a Demo
                </a>
              ) : (
                <Link
                  href={demoUrl}
                  className="w-full block text-center py-3 px-4 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  onClick={closeMenu}
                >
                  Schedule a Demo
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
