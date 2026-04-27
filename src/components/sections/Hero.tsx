import Link from "next/link";
import { dataEvent } from "@/lib/analytics-events";
import { routes } from "@/lib/routes";

export default function Hero() {
  return (
    <section className="pt-6 md:pt-10 pb-10 md:pb-16 hero-bg-accent relative overflow-hidden">
      {/* Soft blob shapes behind content */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -right-20 w-[28rem] h-[28rem] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container-page relative">
        {/* Top: title, subtitle, CTAs */}
        <div className="text-center max-w-[720px] mx-auto">
          <p className="inline-block px-3 py-1 text-sm font-medium text-primary rounded-full bg-primary/10 border border-primary/20 mb-4">
            Built for EMS teams
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
            The Intelligence Layer for EMS Documentation
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-muted mb-6 max-w-xl mx-auto">
            MAIA converts frontline voice capture into structured reports, automated QA insights, and billing-ready claims — without adding workload to crews.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center sm:items-stretch">
            <Link
              href={routes.bookTrial}
              data-event={dataEvent.freeTrialCtaClick}
              className="inline-flex justify-center items-center py-2.5 px-6 sm:py-3 sm:px-8 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background shadow-sm"
            >
              Start FREE TRIAL
            </Link>
          </div>
          <p className="mt-4 text-sm text-muted">
            Built for EMS. Designed for compliance. Powered by AI.
          </p>
        </div>
      </div>

      {/* Bottom: hero image — constrained width (like reference), never scaled beyond natural size */}
      <div className="container-page relative mt-8 md:mt-10">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/maia_tablet.png"
            alt="MAIA tablet interface showing run summary and QA"
            className="w-auto max-w-full rounded-xl shadow-lg object-contain"
            style={{ maxWidth: "min(100%, 900px)" }}
          />
        </div>
      </div>
    </section>
  );
}
