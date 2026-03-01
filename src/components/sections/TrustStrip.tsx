export default function TrustStrip() {
  const proofPoints = [
    "Backed by Callaghan Innovation",
    "Pilots in California EMS",
    "Built for compliance + QA",
  ];

  return (
    <section
      className="border-b border-border bg-background py-4 sm:py-5"
      aria-label="Trust and proof points"
    >
      <div className="container-page">
        {/* Single row on desktop: trust line | proof points | logos */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-8">
          <p className="text-sm text-muted font-medium shrink-0">
            Trusted by teams piloting MAIA
          </p>
          <ul
            className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1 text-sm text-muted"
            aria-label="Proof points"
          >
            {proofPoints.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5" aria-hidden>
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-7 w-16 rounded-md border border-border bg-surface/80 flex items-center justify-center"
              >
                <span className="text-[10px] text-muted font-medium">Logo</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
