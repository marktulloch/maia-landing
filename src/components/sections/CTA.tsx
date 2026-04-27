import Link from "next/link";
import { dataEvent } from "@/lib/analytics-events";
import { routes } from "@/lib/routes";

export default function CTA() {
  return (
    <section className="section-spacing bg-primary">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
        <div className="rounded-3xl border border-primary-foreground/20 bg-primary-foreground/5 py-12 px-8 sm:py-14 sm:px-12 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Give Your Medics Their Time Back.
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Book your free trial call, then tell us about your agency so we can set up MAIA the right way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={routes.bookTrial}
              data-event={dataEvent.freeTrialCtaClick}
              className="inline-flex justify-center items-center py-2.5 px-6 sm:py-3 sm:px-8 text-sm font-semibold rounded-md bg-primary-foreground text-primary hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground focus-visible:ring-offset-2 ring-offset-primary"
            >
              Start FREE TRIAL
            </Link>
          </div>
          <p className="text-sm text-primary-foreground/70 mt-6">
            No disruption to your current ePCR workflow.
          </p>
        </div>
        </div>
      </div>
    </section>
  );
}
