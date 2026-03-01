const steps = [
  {
    number: 1,
    title: "Capture",
    description: "Medics dictate during or after the call.",
  },
  {
    number: 2,
    title: "Compile",
    description: "AI structures and formats compliant reports.",
  },
  {
    number: 3,
    title: "Verify",
    description: "QA checks ensure accuracy before submission.",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-spacing bg-surface">
      <div className="container-page">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center mb-10 md:mb-12">
          How it works
        </h2>

        {/* Desktop: horizontal timeline with connector line */}
        <div className="relative hidden md:block">
          <div
            className="absolute top-8 left-1/2 h-0.5 w-[calc(100%-8rem)] -translate-x-1/2 bg-border z-0"
            aria-hidden
          />
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <article
                key={step.number}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="w-16 h-16 rounded-full bg-primary text-primary-foreground text-xl font-bold flex items-center justify-center shrink-0 mb-4 border-4 border-surface"
                  aria-hidden
                >
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-4 md:hidden">
          {steps.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-border bg-background p-6 flex flex-col items-center text-center"
            >
              <div
                className="w-14 h-14 rounded-full bg-primary text-primary-foreground text-lg font-bold flex items-center justify-center shrink-0 mb-4"
                aria-hidden
              >
                {step.number}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        <p className="text-center text-sm text-muted mt-10">
          Designed to fit your existing ePCR workflow.
        </p>
      </div>
    </section>
  );
}