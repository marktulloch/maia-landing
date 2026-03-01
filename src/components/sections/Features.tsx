const features = [
  {
    category: "AI ePCR Reporting",
    headline: "Real-Time AI Report Generation",
    body: "Voice capture converts field activity into structured, NEMSIS-compliant ePCR reports instantly.",
    bullets: ["Faster documentation", "Structured output", "Works with existing systems"],
    icon: (
      <svg className="w-10 h-10 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
        <path d="M10 9H8" />
      </svg>
    ),
  },
  {
    category: "QA / QI Intelligence",
    headline: "Automated QA / QI Review",
    body: "MAIA flags protocol gaps, missing fields, and compliance risks before submission.",
    bullets: ["Reduce errors", "Improve training", "Standardize reporting"],
    icon: (
      <svg className="w-10 h-10 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    category: "Medical Billing Optimization",
    headline: "Billing-Ready Documentation",
    body: "Ensure complete, defensible documentation aligned to reimbursement requirements.",
    bullets: ["Reduce claim denials", "Increase revenue capture", "Audit protection"],
    icon: (
      <svg className="w-10 h-10 text-primary shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="section-spacing">
      <div className="container-page">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5">
            Documentation + Compliance + Revenue
          </h2>
          <p className="text-lg text-muted">
            Save up to 80% of time spent on reports, QA/QI and medical billing with increase revenue
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <article
              key={index}
              className="flex flex-col rounded-2xl border border-border bg-surface p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <span className="inline-flex items-center justify-center" aria-hidden>
                  {feature.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-primary">{feature.category}</p>
                  <h3 className="text-xl font-semibold text-foreground mt-0.5">
                    {feature.headline}
                  </h3>
                </div>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-5 flex-grow">
                {feature.body}
              </p>
              <ul className="space-y-2 text-sm text-muted">
                {feature.bullets.map((bullet, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-primary shrink-0" aria-hidden>•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5 sm:px-8 sm:py-6 text-center">
          <p className="text-foreground font-medium">
            Save up to 80% of time spent on reports, QA/QI and medical billing with increase revenue
          </p>
        </div>
      </div>
    </section>
  );
}
