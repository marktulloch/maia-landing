import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FreeTrialForm from "@/components/FreeTrialForm";
import { dataEvent } from "@/lib/analytics-events";
import { routes, getBaseUrl } from "@/lib/routes";

const PAGE_TITLE = "MAIA Free Trial — Book & Onboard";

/** Google Calendar appointment scheduling embed (`?gv=true` is Google’s embed flag). */
const GOOGLE_BOOKING_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3ftdXWH1cHHc9QokzCLHlG56oHCOomRLAcZa8qajtt868AhTXPvUS7tucLP51LrlI9bQwc4yMb?gv=true";

const flowSteps = [
  { step: 1, label: "Book Call", href: "#book-call" as const },
  { step: 2, label: "Complete Trial Form", href: "#trial-form" as const },
  { step: 3, label: "BAA + Onboarding", href: "#baa-onboarding" as const },
];

const trustBadges = [
  { label: "EMS-focused", sub: "Ambulance operations" },
  { label: "QA/QI ready", sub: "Review-ready workflows" },
  { label: "BAA required before PHI", sub: "Enterprise HIPAA norm" },
] as const;

const nextSteps = [
  {
    step: "1",
    title: "Review & follow-up",
    body: "We review your onboarding responses and confirm timelines, access path, and the right contacts on your team.",
  },
  {
    step: "2",
    title: "BAA when patient data applies",
    body: "If your trial involves PHI, we complete a Business Associate Agreement first—a routine step for enterprise EMS and health systems.",
  },
  {
    step: "3",
    title: "Onboarding & next steps",
    body: "Protocols, sample reports where appropriate, and optional walkthroughs aligned to your ePCR context.",
  },
] as const;

export const metadata: Metadata = {
  title: `${PAGE_TITLE} | MAIA`,
  description:
    "Book your MAIA trial call, then complete onboarding on the same page — including BAA acknowledgment before submit.",
  openGraph: {
    title: `${PAGE_TITLE} | MAIA`,
    description: "Schedule your call and complete the trial form in one place.",
    type: "website",
  },
  ...(getBaseUrl() && {
    alternates: { canonical: `${getBaseUrl()}${routes.bookTrial}` },
  }),
};

function TrustBadge({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-center rounded-xl border border-border/90 bg-background/95 px-3 py-3 sm:px-4 sm:py-3.5 shadow-sm flex-1 min-w-0 sm:flex-none sm:max-w-[11.5rem]">
      <span className="text-[11px] sm:text-xs font-semibold text-primary leading-tight text-balance">{label}</span>
      <span className="mt-1 text-[10px] sm:text-[11px] text-muted leading-snug">{sub}</span>
    </div>
  );
}

export default function BookTrialPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/*
          LEAD ENGINEER — Scheduling + intake

          - Calendar iframe is cross-origin; booking completion is not visible to the parent. Users scroll to
            #trial-form after booking. Optional: Calendly/Cal.com for redirect-on-submit.

          - Trial form + BAA/terms acknowledgements live in FreeTrialForm (POST /api/free-trial unchanged).
        */}
        <section
          className="pt-6 md:pt-10 pb-6 md:pb-8 hero-bg-accent relative overflow-hidden border-b border-border"
          aria-label="Book a MAIA free trial call"
        >
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/4 -right-20 w-[28rem] h-[28rem] rounded-full bg-primary/5 blur-3xl" />
          </div>
          <div className="container-page relative max-w-4xl mx-auto">
            <Link
              href={routes.home}
              className="inline-block text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded"
            >
              ← Home
            </Link>

            <nav
              className="mt-5 rounded-xl border border-border bg-background/90 shadow-sm px-3 py-2 sm:px-4 sm:py-2.5 max-w-3xl mx-auto"
              aria-label="Trial setup steps — jump to section"
            >
              <ol className="flex flex-col sm:flex-row sm:items-stretch sm:justify-between gap-2 sm:gap-0 list-none p-0 m-0 text-center sm:text-left">
                {flowSteps.map((s, i) => (
                  <li
                    key={s.step}
                    className={`flex flex-1 min-w-0 ${i > 0 ? "sm:border-l sm:border-border sm:pl-3 sm:ml-2" : ""}`}
                  >
                    <a
                      href={s.href}
                      className="group flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0 w-full rounded-lg px-1 py-1.5 -mx-0.5 outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                    >
                      <span
                        className={`inline-flex mx-auto sm:mx-0 h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors group-hover:border-primary/35 ${
                          s.step === 1
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-surface text-muted border-border group-hover:text-foreground"
                        }`}
                      >
                        {s.step}
                      </span>
                      <span
                        className={`text-xs sm:text-sm font-medium leading-tight transition-colors ${
                          s.step === 1 ? "text-foreground" : "text-muted group-hover:text-foreground"
                        }`}
                      >
                        {s.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-3 md:mt-4 text-center max-w-[40rem] mx-auto">
              <p className="inline-block px-3 py-1 text-sm font-medium text-primary rounded-full bg-primary/10 border border-primary/20 mb-2.5">
                Free trial
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight text-balance">
                Book Your MAIA Free Trial Call
              </h1>
              <p className="mt-3 text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto text-pretty">
                Choose a time below, then scroll to complete your trial onboarding and BAA acknowledgment on this same
                page.
              </p>
            </div>

            {/* Google Calendar Appointment Scheduling */}
            <div
              id="book-call"
              className="mt-4 md:mt-5 scroll-mt-24 md:scroll-mt-28 rounded-2xl border border-border bg-surface shadow-md ring-1 ring-border/50 overflow-hidden"
            >
              <div className="border-b border-border bg-background/80 px-4 py-2.5 sm:px-5 sm:py-3">
                <p className="text-sm font-medium text-foreground">Step 1 · Select a time</p>
                <p className="text-xs text-muted mt-0.5">Google Calendar — pick a slot below</p>
              </div>
              <div className="relative w-full bg-background aspect-[4/3] min-h-[min(70vh,480px)] sm:min-h-[560px] md:min-h-[600px]">
                <iframe
                  title="Book a MAIA free trial call"
                  src={GOOGLE_BOOKING_URL}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="calendar"
                />
              </div>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-sm">
              <a
                href={GOOGLE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary font-medium underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Having trouble viewing the calendar? Open booking page
              </a>
              <span className="hidden sm:inline text-border" aria-hidden>
                |
              </span>
              <a
                href="#trial-form"
                data-event={dataEvent.freeTrialCtaClick}
                className="text-primary font-medium underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                Jump to trial form
              </a>
            </div>
          </div>
        </section>

        {/* Step 2–3: Trial form (includes BAA + terms acknowledgements before submit) */}
        <section
          id="trial-form"
          className="scroll-mt-24 md:scroll-mt-28 border-t border-border bg-gradient-to-b from-surface/90 via-surface/70 to-background py-8 md:py-10"
          aria-labelledby="trial-form-heading"
        >
          <div className="container-page max-w-4xl mx-auto">
            <header className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
              <p className="inline-block px-3 py-1 text-xs font-medium text-primary rounded-full bg-primary/10 border border-primary/20 mb-3">
                Steps 2 &amp; 3 · On this page
              </p>
              <h2
                id="trial-form-heading"
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight text-balance"
              >
                Complete Your MAIA Trial Onboarding
              </h2>
              <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">
                Tell us about your agency, ePCR workflow, and QA/QI needs. You&apos;ll confirm BAA expectations and
                terms before you submit — no PHI in this form.
              </p>
            </header>

            <p className="text-center text-sm font-medium text-foreground/90 tracking-wide mb-5">
              This takes less than 2 minutes.
            </p>

            <div
              className="flex flex-wrap justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto mb-8 md:mb-10"
              aria-label="Trust and compliance highlights"
            >
              {trustBadges.map((b) => (
                <TrustBadge key={b.label} label={b.label} sub={b.sub} />
              ))}
            </div>

            <div className="mx-auto max-w-2xl">
              <FreeTrialForm />
              <p className="mt-8 text-sm text-muted text-center leading-relaxed">
                Prefer email first?{" "}
                <Link
                  href={`${routes.home}${routes.contact}`}
                  className="text-primary font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Contact us
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section
          id="baa-onboarding"
          className="scroll-mt-24 md:scroll-mt-28 py-8 md:py-10 border-t border-border bg-background"
          aria-labelledby="next-heading"
        >
          <div className="container-page max-w-4xl mx-auto">
            <header className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
              <h2 id="next-heading" className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                What happens next
              </h2>
              <p className="mt-3 text-muted text-base sm:text-lg leading-relaxed">
                After you submit, including BAA acknowledgment where applicable — a predictable path to onboarding.
              </p>
            </header>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 list-none p-0 m-0">
              {nextSteps.map((item) => (
                <li key={item.step}>
                  <div className="h-full rounded-2xl border border-border bg-surface p-6 sm:p-7 shadow-sm flex flex-col">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary border border-primary/20 mb-4"
                      aria-hidden
                    >
                      {item.step}
                    </span>
                    <h3 className="text-lg font-semibold text-foreground leading-snug">{item.title}</h3>
                    <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex justify-center">
              <Link
                href={routes.legalBaa}
                className="text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                How we handle BAA →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
