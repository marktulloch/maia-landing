import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dataEvent } from "@/lib/analytics-events";
import { routes, getBaseUrl, isExternalUrl } from "@/lib/routes";

const PAGE_TITLE = "Onboarding";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | MAIA`,
  description:
    "Your MAIA trial request is in. Next steps: review, BAA if needed, uploads when approved, and booking a demo.",
  openGraph: {
    title: `${PAGE_TITLE} | MAIA`,
    description: "Post–free-trial onboarding: what happens next for your MAIA trial.",
    type: "website",
  },
  ...(getBaseUrl() && {
    alternates: { canonical: `${getBaseUrl()}${routes.onboarding}` },
  }),
};

const nextStepCards = [
  {
    key: "review",
    label: "Review",
    title: "MAIA team reviews your request",
    body: "We match your agency profile and goals to the right trial setup and reach out with any clarifying questions.",
  },
  {
    key: "baa",
    label: "BAA",
    title: "If patient-related data is required, complete BAA first",
    body: "When PHI is in scope, your organisation signs a Business Associate Agreement with MAIA before production data or uploads move forward.",
    linkHref: routes.legalBaa,
    linkText: "BAA overview",
  },
  {
    key: "upload",
    label: "Upload",
    title: "Share protocols or sample reports once approved",
    body: "After review (and BAA when applicable), your MAIA contact will confirm what to share and how — de-identified samples only until intake is cleared.",
  },
  {
    key: "demo",
    label: "Demo",
    title: "Book a guided walkthrough",
    body: "See MAIA against your workflows: ePCR context, QA checks, and how crews experience documentation with less friction.",
  },
] as const;

const primaryBtnClass =
  "inline-flex justify-center items-center min-h-[48px] py-2.5 px-6 sm:px-8 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background shadow-sm";

const secondaryBtnClass =
  "inline-flex justify-center items-center min-h-[48px] py-2.5 px-6 sm:px-8 text-sm font-medium rounded-md border border-border text-foreground bg-background hover:bg-surface hover:border-primary/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

export default function OnboardingPage() {
  const demoUrl = routes.demo;
  const isDemoExternal = isExternalUrl(demoUrl);

  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1" role="main">
        {/* 1. Confirmation hero */}
        <section className="pt-6 md:pt-12 pb-10 md:pb-14 hero-bg-accent relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 -right-20 w-[28rem] h-[28rem] rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute bottom-1/4 -left-16 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container-page relative">
            <Link
              href={routes.home}
              className="inline-block text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
            >
              ← Home
            </Link>
            <div className="mt-8 text-center max-w-[42rem] mx-auto">
              <p className="inline-block px-3 py-1 text-sm font-medium text-primary rounded-full bg-primary/10 border border-primary/20 mb-5">
                Trial request received
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
                Your MAIA Trial Request Is In
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-muted leading-relaxed max-w-2xl mx-auto">
                We&apos;ll review your details and help you move into the right onboarding path.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Next steps cards */}
        <section className="section-spacing border-t border-border" aria-labelledby="onboarding-next-heading">
          <div className="container-page max-w-5xl">
            <h2 id="onboarding-next-heading" className="sr-only">
              Next steps
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
              {nextStepCards.map((card) => (
                <article
                  key={card.key}
                  className="rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-sm hover:border-primary/20 hover:shadow-md transition-all duration-200 flex flex-col"
                >
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{card.label}</span>
                  <h3 className="mt-2 text-lg font-semibold text-foreground leading-snug">{card.title}</h3>
                  <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{card.body}</p>
                  {"linkHref" in card && card.linkHref && (
                    <p className="mt-4">
                      <Link
                        href={card.linkHref}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                      >
                        {card.linkText}
                        <span aria-hidden>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </Link>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/*
          LEAD ENGINEER — Secure file upload

          - Replace the placeholder card below with a real upload surface (e.g. presigned S3 URLs, Uploadcare,
            or MAIA API multipart upload). Wire the component here or lazy-load when `uploadEnabled` from API.

          - Gate upload behind backend auth / session: only authenticated org users (or magic-link recipients)
            should reach `/onboarding/upload` or embedded upload UI. Do not rely on this public page alone.

          - Before enabling file pickers or generating upload tokens, call MAIA backend to verify BAA status
            (e.g. GET /api/orgs/:id/compliance → baaStatus === 'executed'). Block UI with clear copy until signed.
        */}
        <section className="section-spacing pt-0 md:pt-0 border-t border-border bg-surface/50" aria-label="Upload">
          <div className="container-page max-w-2xl">
            <div className="rounded-2xl border border-dashed border-border bg-background/80 px-6 py-8 sm:px-8 sm:py-10 text-center shadow-sm">
              <div
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted/20 text-muted"
                aria-hidden
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Upload</p>
              <p className="mt-3 text-base text-foreground font-medium leading-relaxed">
                Secure upload coming soon. Your MAIA contact will provide the correct upload link once BAA
                requirements are complete.
              </p>
            </div>
          </div>
        </section>

        {/* 4. CTA */}
        <section className="section-spacing pt-0 md:pt-0 pb-12 md:pb-16">
          <div className="container-page max-w-2xl text-center">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              {isDemoExternal ? (
                <a
                  href={demoUrl}
                  data-event={dataEvent.demoCtaClick}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryBtnClass}
                >
                  Book a Demo
                </a>
              ) : (
                <Link href={demoUrl} data-event={dataEvent.demoCtaClick} className={primaryBtnClass}>
                  Book a Demo
                </Link>
              )}
              <Link href={routes.home} className={secondaryBtnClass}>
                Back to Home
              </Link>
            </div>
            <p className="mt-8 text-sm text-muted">
              Want to add another agency?{" "}
              <Link
                href={routes.bookTrial}
                data-event={dataEvent.freeTrialCtaClick}
                className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Start another trial request
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
