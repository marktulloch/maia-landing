import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dataEvent } from "@/lib/analytics-events";
import { routes, getBaseUrl } from "@/lib/routes";

const PAGE_TITLE = "Business Associate Agreement";

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | MAIA`,
  description:
    "How MAIA handles Business Associate Agreements (BAA) before patient-related or protected health information is processed — informational placeholder.",
  openGraph: {
    title: `${PAGE_TITLE} | MAIA`,
    description: "BAA process overview for MAIA customers and trial applicants.",
    type: "website",
  },
  ...(getBaseUrl() && {
    alternates: { canonical: `${getBaseUrl()}${routes.legalBaa}` },
  }),
};

export default function LegalBaaPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1 section-spacing" role="main">
        {/*
          LEGAL / LEAD ENGINEER

          - Replace this placeholder page with the final, counsel-approved BAA text and any required exhibits,
            signature blocks, and version history (effective dates).

          - Connect onboarding to a managed signature flow: DocuSign, Dropbox Sign, PandaDoc, or equivalent —
            triggered after trial approval or when PHI is in scope; store executed PDF + metadata in MAIA backend.

          - Gate PHI uploads and production data paths on signed BAA status (e.g. org.compliance.baaStatus ===
            'executed'); block UI and APIs until confirmed; align with HIPAA minimum necessary.
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
            <span className="text-foreground">BAA</span>
          </nav>

          <div className="rounded-2xl border border-dashed border-border bg-surface/60 p-6 sm:p-8 mb-8">
            <p className="text-sm font-medium text-primary uppercase tracking-wide">Informational placeholder</p>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              This is not the full legal Business Associate Agreement. It summarises how MAIA approaches BAA
              requirements until your organisation receives the official agreement and signature process from our team.
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{PAGE_TITLE}</h1>

          <div className="mt-8 space-y-8 text-base leading-relaxed">
            <section>
              <p className="text-muted">
                <strong className="font-semibold text-foreground">MAIA may require a signed Business Associate Agreement
                (BAA)</strong> before we process, store, or otherwise handle{" "}
                <strong className="font-semibold text-foreground">patient-related information</strong> or{" "}
                <strong className="font-semibold text-foreground">protected health information (PHI)</strong> on your
                behalf. A BAA documents the responsibilities of both your organisation (as a HIPAA covered entity or
                downstream covered entity) and MAIA (as a business associate) under applicable privacy and security
                rules.
              </p>
            </section>

            <section
              className="rounded-xl border border-primary/25 bg-primary/5 px-5 py-4 sm:px-6 sm:py-5"
              aria-label="PHI handling requirement"
            >
              <p className="text-sm font-semibold text-foreground">Before BAA completion is confirmed</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                <strong className="font-medium text-foreground">Do not upload or submit PHI</strong> through MAIA
                websites, trial forms, or ad-hoc channels until your MAIA contact confirms that BAA completion (or an
                approved alternative under your compliance programme) is in place. Use only de-identified or synthetic
                materials for early discussions unless counsel instructs otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">During onboarding</h2>
              <p className="text-muted">
                MAIA will provide the appropriate <strong className="font-medium text-foreground">BAA review and
                signature process</strong> as part of onboarding — including the current template, routing for your
                legal or privacy office, and any institutional addenda where applicable. Timeline depends on your
                internal review cycles; we will not ask for production PHI until the path is clear.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">Questions</h2>
              <p className="text-muted">
                This page does not constitute legal advice. Your privacy officer or counsel should review any BAA or
                data-use arrangement. For operational questions, contact your MAIA representative after submitting a
                trial request or use the{" "}
                <Link
                  href={`${routes.home}${routes.contact}`}
                  className="text-primary underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  contact
                </Link>{" "}
                section on the main site.
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
