"use client";

import { useState } from "react";

const ROLE_OPTIONS = [
  { value: "", label: "Select role (optional)" },
  { value: "medic", label: "Medic/EMT" },
  { value: "qa", label: "QA/QI" },
  { value: "billing", label: "Billing" },
  { value: "ops", label: "Ops" },
  { value: "other", label: "Other" },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "team@maia.care";
  const contactPhone = "+64 22 466 8422";

  function buildMailtoBody(): string {
    const lines = [
      `Name: ${form.name.trim()}`,
      `Organization: ${form.organization.trim()}`,
      `Email: ${form.email.trim()}`,
      ...(form.role ? [`Role: ${ROLE_OPTIONS.find((o) => o.value === form.role)?.label ?? form.role}`] : []),
      "",
      "Message:",
      form.message.trim(),
    ];
    return lines.join("\n");
  }

  const [form, setForm] = useState({
    name: "",
    organization: "",
    email: "",
    role: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.organization.trim()) next.organization = "Organization is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent("Contact from MAIA website");
    const body = encodeURIComponent(buildMailtoBody());
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setSuccess(true);
    setForm({ name: "", organization: "", email: "", role: "", message: "" });
    setErrors({});
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  if (success) {
    return (
      <section id="contact" className="section-spacing">
        <div className="container-page">
          <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 shadow-sm text-center">
            <p className="text-lg text-foreground font-medium">
              Thanks — we&apos;ll be in touch shortly.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-4 text-sm text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:underline rounded"
            >
              Send another message
            </button>
          </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-spacing">
      <div className="container-page">
        <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground text-center mb-8">
          Contact Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                Name <span className="text-muted">(required)</span>
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "contact-name-err" : undefined}
              />
              {errors.name && (
                <p id="contact-name-err" className="mt-1 text-sm text-primary" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-organization" className="block text-sm font-medium text-foreground mb-1.5">
                Organization <span className="text-muted">(required)</span>
              </label>
              <input
                id="contact-organization"
                name="organization"
                type="text"
                required
                value={form.organization}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="Your organization"
                aria-invalid={!!errors.organization}
                aria-describedby={errors.organization ? "contact-organization-err" : undefined}
              />
              {errors.organization && (
                <p id="contact-organization-err" className="mt-1 text-sm text-primary" role="alert">
                  {errors.organization}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                Email <span className="text-muted">(required)</span>
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "contact-email-err" : undefined}
              />
              {errors.email && (
                <p id="contact-email-err" className="mt-1 text-sm text-primary" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="contact-role" className="block text-sm font-medium text-foreground mb-1.5">
                Role <span className="text-muted">(optional)</span>
              </label>
              <select
                id="contact-role"
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value || "empty"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                Message <span className="text-muted">(required)</span>
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-y min-h-[100px]"
                placeholder="How can we help?"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "contact-message-err" : undefined}
              />
              {errors.message && (
                <p id="contact-message-err" className="mt-1 text-sm text-primary" role="alert">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              Send message
            </button>
          </form>

          <div className="rounded-2xl border border-border bg-surface p-6 lg:p-8 shadow-sm self-start">
            <h3 className="text-lg font-semibold text-foreground mb-4">Get in touch</h3>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="text-muted font-medium mb-1">Email</dt>
                <dd>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {contactEmail}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted font-medium mb-1">Phone</dt>
                <dd>
                  <a
                    href={`tel:${contactPhone.replace(/\s/g, "")}`}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {contactPhone}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
