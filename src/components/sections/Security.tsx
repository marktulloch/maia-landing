import Link from "next/link";

const items = [
  "HIPAA-aligned architecture",
  "Encrypted cloud infrastructure",
  "Role-based access controls",
  "Audit trail logging",
];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

export default function Security() {
  return (
    <section className="section-spacing">
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
        <header className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-5">
            Secure. Compliant. Field-Ready.
          </h2>
          <p className="text-muted">
            Built for trust and auditability so your data and workflows stay protected.
          </p>
        </header>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-x-8 sm:gap-y-4" aria-label="Security and compliance features">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckIcon />
              <span className="text-muted">{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-center mt-8">
          <Link
            href="#"
            className="text-sm text-primary hover:underline focus:outline-none focus:underline"
          >
            Learn more
          </Link>
        </p>
        </div>
      </div>
    </section>
  );
}
