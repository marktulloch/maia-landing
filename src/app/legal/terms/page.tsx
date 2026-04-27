import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dataEvent } from "@/lib/analytics-events";
import { routes, getBaseUrl } from "@/lib/routes";

const PAGE_TITLE = "Terms & Conditions";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | MAIA`,
  description:
    "MAIA website terms — professional placeholder. Not final legal terms; counsel-approved text will replace this page.",
  openGraph: {
    title: `${PAGE_TITLE} | MAIA`,
    description: "MAIA Terms & Conditions (placeholder).",
    type: "website",
  },
  ...(getBaseUrl() && {
    alternates: { canonical: `${getBaseUrl()}${routes.legalTerms}` },
  }),
};

export default function LegalTermsPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 section-spacing" role="main">
        {/*
          LEGAL / CONTENT

          - Replace this entire placeholder with final, lawyer-approved Terms & Conditions (and version / effective
            date). Link related policies (e.g. Acceptable Use, SLA) as your programme requires.

          - Add a dedicated Privacy Policy page and cross-links when ready (footer, trial form, auth flows). Until
            then, avoid implying this page covers privacy rights or data-processing disclosures in full.
        */}
        <article className="container-page max-w-3xl">
          <nav className="text-sm text-muted mb-6 flex flex-wrap gap-x-3 gap-y-1">
            <Link
              href={routes.home}
              className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              Home
            </Link>
            <span aria-hidden className="text-border">
              /
            </span>
            <span className="text-foreground">Terms</span>
          </nav>

          <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-6 sm:p-8 mb-8">
            <p className="text-sm font-medium text-primary uppercase tracking-wide">Informational placeholder</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              This is not final legal advice and not a binding contract. It summarises topics MAIA may cover in
              formal terms later. Your organisation should rely on counsel for compliance decisions.
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{PAGE_TITLE}</h1>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            The sections below are placeholders for future legal copy. They describe how we intend this public site
            and trial flow to behave — not enforceable terms until replaced by approved documentation.
          </p>

          <div className="mt-10 space-y-10 text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Use of Website</h2>
              <p className="text-muted">
                By using this website you agree to use it only for lawful purposes and in a way that does not
                infringe the rights of others or restrict their use of the site. Final terms will describe permitted
                use, intellectual property, disclaimers, and limitation of liability as determined by MAIA counsel.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Free Trial Requests</h2>
              <p className="text-muted">
                Submitting a free trial request does not guarantee access. MAIA may accept, defer, or decline requests
                based on capacity, fit, and compliance review. Formal terms will describe eligibility, trial scope, and
                how communications about your request are handled.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">No PHI Submission Through Public Forms</h2>
              <p className="text-muted">
                Public forms on this marketing site are not designed for protected health information (PHI). Do not
                include patient names, medical record numbers, clinical narrative, or other PHI in free trial or
                contact submissions. Final terms and related policies will restate this obligation and may reference
                incident reporting if misuse is detected.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">BAA Requirement</h2>
              <p className="text-muted">
                Where patient-related data or PHI will be processed in MAIA systems, a Business Associate Agreement
                (BAA) or equivalent arrangement may be required before production use. High-level information appears on
                our{" "}
                <Link
                  href={routes.legalBaa}
                  className="text-primary underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  BAA overview
                </Link>
                ; binding language will appear in executed agreements, not on this placeholder page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
              <p className="text-muted">
                For questions about this site or a trial request, use the{" "}
                <Link
                  href={`${routes.home}${routes.contact}`}
                  className="text-primary underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  contact
                </Link>{" "}
                section on the MAIA home page. Final terms may specify notice addresses and support channels.
              </p>
            </section>
          </div>

          <div className="mt-12">
            <Link
              href={`${routes.bookTrial}#trial-form`}
              data-event={dataEvent.freeTrialCtaClick}
              className="inline-flex justify-center items-center min-h-[48px] py-2.5 px-6 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background shadow-sm"
            >
              Return to Free Trial
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
