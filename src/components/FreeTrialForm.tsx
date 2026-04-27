"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { dataEvent } from "@/lib/analytics-events";
import { routes } from "@/lib/routes";
import type { FreeTrialFormPayload } from "@/lib/free-trial";
import {
  BILLING_OPTIONS,
  EPCR_OPTIONS,
  MAX_PROTOCOL_FILE_BYTES,
  NEXT_STEP_OPTIONS,
  PAIN_POINT_OPTIONS,
  PROTOCOL_FILE_MIME_TYPES,
  ROLE_OPTIONS,
} from "@/lib/free-trial";

export type { FreeTrialFormPayload } from "@/lib/free-trial";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-base sm:text-sm";

const selectClass =
  "w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-base sm:text-sm";

const cardShell =
  "rounded-2xl border border-border bg-background shadow-sm overflow-hidden ring-1 ring-border/40";

const REPORT_RADIO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
  { value: "need_to_discuss", label: "Need to discuss" },
] as const;

const PROGRESS_STEPS = [
  { step: 1, shortLabel: "Organisation" },
  { step: 2, shortLabel: "Contact" },
  { step: 3, shortLabel: "Trial needs" },
  { step: 4, shortLabel: "Data & legal" },
] as const;

const TOTAL_STEPS = PROGRESS_STEPS.length;

type FreeTrialApiJson = {
  ok?: boolean;
  error?: string;
  message?: string;
};

type TrialFormState = {
  organisationName: string;
  website: string;
  location: string;
  ambulanceCount: number;
  epcrSystem: string;
  billingSetup: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  primaryPainPoint: string;
  willingToProvideReports: string;
  nextStepPreference: string;
  pdfAvailable: boolean;
  csvAvailable: boolean;
  xmlAvailable: boolean;
  protocolsAvailable: boolean;
  protocolMode: "" | "url" | "upload";
  protocolUrl: string;
  protocolFileName: string;
  protocolFileMimeType: string;
  protocolFileBase64: string;
  baaAccepted: boolean;
  termsAccepted: boolean;
};

const initialForm: TrialFormState = {
  organisationName: "",
  website: "",
  location: "",
  ambulanceCount: 0,
  epcrSystem: "",
  billingSetup: "",
  name: "",
  role: "",
  email: "",
  phone: "",
  primaryPainPoint: "",
  willingToProvideReports: "",
  nextStepPreference: "",
  pdfAvailable: false,
  csvAvailable: false,
  xmlAvailable: false,
  protocolsAvailable: false,
  protocolMode: "",
  protocolUrl: "",
  protocolFileName: "",
  protocolFileMimeType: "",
  protocolFileBase64: "",
  baaAccepted: false,
  termsAccepted: false,
};

type FreeTrialFormProps = {
  className?: string;
};

function StageCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const headingId = `ft-stage-${step}-title`;
  return (
    <section aria-labelledby={headingId} className={cardShell}>
      <div className="bg-surface/70 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm"
            aria-hidden
          >
            {step}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary/90">
              Step {step} of {TOTAL_STEPS}
            </p>
            <h2 id={headingId} className="text-lg sm:text-xl font-semibold text-foreground tracking-tight mt-1">
              {title}
            </h2>
            <p className="text-sm text-muted leading-relaxed mt-1.5 max-w-2xl">{description}</p>
          </div>
        </div>
      </div>
      <div className="px-5 py-6 sm:px-6 sm:py-7 space-y-5">{children}</div>
    </section>
  );
}

function Subheading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 pb-1 border-b border-border/80">
      <span className="h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden />
      {children}
    </h3>
  );
}

export default function FreeTrialForm({ className = "" }: FreeTrialFormProps) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!success || !successRef.current) return;
    successRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [success]);

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!form.organisationName.trim()) next.organisationName = "Organisation name is required.";
    if (!form.location.trim()) next.location = "Location is required.";

    const count = Number(form.ambulanceCount);
    if (!Number.isFinite(count) || !Number.isInteger(count) || count < 1) {
      next.ambulanceCount = "Enter a whole number of ambulances (at least 1).";
    }

    if (!form.epcrSystem) next.epcrSystem = "Select your ePCR system.";
    if (!form.billingSetup) next.billingSetup = "Select your billing setup.";

    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.role) next.role = "Select your role.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Please enter a valid email address.";
    }

    if (!form.primaryPainPoint) next.primaryPainPoint = "Select a primary pain point.";
    if (!form.willingToProvideReports) {
      next.willingToProvideReports = "Please indicate whether you can provide sample reports.";
    }
    if (!form.nextStepPreference) next.nextStepPreference = "Select your preferred next step.";

    if (!form.baaAccepted) {
      next.baaAccepted = "Please confirm you understand the BAA requirement.";
    }
    if (!form.termsAccepted) {
      next.termsAccepted = "Please confirm you agree to the terms and policies.";
    }

    if (form.website.trim()) {
      const w = form.website.trim();
      if (!/^https?:\/\//i.test(w) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(w)) {
        next.website = "Enter a valid URL (e.g. https://example.org or example.org).";
      }
    }

    if (form.protocolMode === "url" && form.protocolUrl.trim()) {
      const w = form.protocolUrl.trim();
      if (!/^https?:\/\//i.test(w) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(w)) {
        next.protocolUrl = "Enter a valid protocol URL (e.g. https://… or your-domain.org/…).";
      }
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function buildPayload(): FreeTrialFormPayload {
    const websiteTrim = form.website.trim();
    return {
      organisationName: form.organisationName.trim(),
      ...(websiteTrim ? { website: websiteTrim } : {}),
      location: form.location.trim(),
      ambulanceCount: Number(form.ambulanceCount),
      epcrSystem: form.epcrSystem as FreeTrialFormPayload["epcrSystem"],
      billingSetup: form.billingSetup as FreeTrialFormPayload["billingSetup"],
      name: form.name.trim(),
      role: form.role as FreeTrialFormPayload["role"],
      email: form.email.trim(),
      ...(form.phone.trim() ? { phone: form.phone.trim().slice(0, 64) } : {}),
      primaryPainPoint: form.primaryPainPoint as FreeTrialFormPayload["primaryPainPoint"],
      willingToProvideReports:
        form.willingToProvideReports as FreeTrialFormPayload["willingToProvideReports"],
      nextStepPreference: form.nextStepPreference as FreeTrialFormPayload["nextStepPreference"],
      pdfAvailable: form.pdfAvailable,
      csvAvailable: form.csvAvailable,
      xmlAvailable: form.xmlAvailable,
      protocolsAvailable: form.protocolsAvailable,
      ...(form.protocolMode === "url" && form.protocolUrl.trim()
        ? { protocolUrl: form.protocolUrl.trim().slice(0, 2048) }
        : {}),
      ...(form.protocolMode === "upload" && form.protocolFileBase64 && form.protocolFileName && form.protocolFileMimeType
        ? {
            protocolFileName: form.protocolFileName.slice(0, 255),
            protocolFileMimeType: form.protocolFileMimeType,
            protocolFileBase64: form.protocolFileBase64,
          }
        : {}),
      baaAccepted: form.baaAccepted,
      termsAccepted: form.termsAccepted,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/free-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });

      let data: FreeTrialApiJson = {};
      try {
        data = (await res.json()) as FreeTrialApiJson;
      } catch {
        data = {};
      }

      if (!res.ok) {
        const fromServer = typeof data.error === "string" && data.error.trim() ? data.error.trim() : null;
        if (fromServer) {
          setSubmitError(fromServer);
        } else if (res.status === 502) {
          setSubmitError(
            "We could not reach our intake service right now. Please try again in a few minutes or contact us if this continues.",
          );
        } else if (res.status === 400) {
          setSubmitError("Please check your answers and try again.");
        } else {
          setSubmitError("Something went wrong. Please try again.");
        }
        return;
      }

      if (data.ok === false) {
        setSubmitError(
          typeof data.error === "string" && data.error.trim()
            ? data.error.trim()
            : "Something went wrong. Please try again.",
        );
        return;
      }

      setSuccess(true);
      setForm(initialForm);
      setErrors({});
    } catch {
      setSubmitError(
        "We could not send your request. Check your internet connection and try again, or contact us if the problem persists.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "ambulanceCount") {
      setForm((prev) => ({ ...prev, [name]: value === "" ? 0 : Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function handleRadioChange(value: string) {
    setForm((prev) => ({ ...prev, willingToProvideReports: value }));
    if (errors.willingToProvideReports) setErrors((prev) => ({ ...prev, willingToProvideReports: "" }));
  }

  function handleProtocolModeChange(mode: "" | "url" | "upload") {
    setForm((prev) => ({
      ...prev,
      protocolMode: mode,
      ...(mode !== "url" ? { protocolUrl: "" } : {}),
      ...(mode !== "upload"
        ? { protocolFileName: "", protocolFileMimeType: "", protocolFileBase64: "" }
        : {}),
    }));
    setErrors((prev) => ({
      ...prev,
      protocolUrl: "",
      protocolFile: "",
    }));
  }

  function handleProtocolFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setErrors((prev) => ({ ...prev, protocolFile: "" }));
    if (!file) {
      setForm((prev) => ({ ...prev, protocolFileName: "", protocolFileMimeType: "", protocolFileBase64: "" }));
      return;
    }
    if (!(PROTOCOL_FILE_MIME_TYPES as readonly string[]).includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        protocolFile: "Please upload a PDF or Word document (.doc or .docx).",
      }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PROTOCOL_FILE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        protocolFile: `File must be ${MAX_PROTOCOL_FILE_BYTES / (1024 * 1024)}MB or smaller.`,
      }));
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const comma = res.indexOf(",");
      const base64 = comma >= 0 ? res.slice(comma + 1) : res;
      setForm((prev) => ({
        ...prev,
        protocolMode: "upload",
        protocolUrl: "",
        protocolFileName: file.name.slice(0, 255),
        protocolFileMimeType: file.type,
        protocolFileBase64: base64.replace(/\s/g, ""),
      }));
    };
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, protocolFile: "Could not read file. Try again." }));
    };
    reader.readAsDataURL(file);
  }

  if (success) {
    return (
      <div
        ref={successRef}
        className={`rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/[0.07] via-background to-background shadow-md ring-1 ring-border/60 overflow-hidden ${className}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="px-6 py-10 sm:px-10 sm:py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-4 ring-primary/15" aria-hidden>
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.25}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary">Request received</p>
          <p className="mt-4 text-base sm:text-lg text-foreground leading-relaxed max-w-xl mx-auto text-pretty">
            Thanks — we&apos;ve received your MAIA free trial request. Our team will review your details and follow up
            with next steps. If your trial involves patient-related data, a BAA must be completed before onboarding.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center max-w-md mx-auto">
            <Link
              href={routes.onboarding}
              className="inline-flex justify-center items-center min-h-[48px] py-3 px-6 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background shadow-sm"
            >
              Continue to onboarding
            </Link>
            <button
              type="button"
              data-event={dataEvent.freeTrialCtaClick}
              onClick={() => setSuccess(false)}
              className="inline-flex justify-center items-center min-h-[48px] py-3 px-6 text-sm font-medium rounded-md border border-border text-foreground bg-background/80 hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
            >
              Submit another request
            </button>
          </div>
          <p className="mt-8 text-sm text-muted">
            <Link
              href={routes.legalBaa}
              className="text-primary font-medium underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              About BAA requirements
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 md:space-y-8 ${className}`}>
      {/* Progress overview */}
      <nav aria-label="Trial request steps" className={cardShell}>
        <div className="px-4 py-3 sm:px-5 sm:py-4 bg-surface/50 border-b border-border/80">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted text-center sm:text-left">
            Your request in four steps
          </p>
        </div>
        <ol className="grid grid-cols-4 gap-0 divide-x divide-border/80 list-none p-0 m-0">
          {PROGRESS_STEPS.map((s) => (
            <li key={s.step} className="flex flex-col items-center px-1.5 py-3 sm:py-4 sm:px-2 min-w-0">
              <span
                className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-primary/12 text-xs sm:text-sm font-bold text-primary border border-primary/25"
                aria-hidden
              >
                {s.step}
              </span>
              <span className="mt-2 text-[10px] sm:text-xs font-medium text-muted text-center leading-tight line-clamp-2 max-w-[5.5rem] sm:max-w-none">
                {s.shortLabel}
              </span>
            </li>
          ))}
        </ol>
      </nav>

      {/* Section 1: Organisation */}
      <StageCard
        step={1}
        title="Organisation"
        description="Agency profile, footprint, and systems you run today."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="ft-organisationName" className="block text-sm font-medium text-foreground mb-1.5">
              Organisation name <span className="text-muted font-normal">(required)</span>
            </label>
            <input
              id="ft-organisationName"
              name="organisationName"
              type="text"
              autoComplete="organization"
              value={form.organisationName}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Agency or service name"
              aria-invalid={!!errors.organisationName}
              aria-describedby={errors.organisationName ? "ft-organisationName-err" : undefined}
            />
            {errors.organisationName && (
              <p id="ft-organisationName-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.organisationName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ft-website" className="block text-sm font-medium text-foreground mb-1.5">
              Website <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              id="ft-website"
              name="website"
              type="text"
              inputMode="url"
              autoComplete="url"
              value={form.website}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="https:// or your-domain.org"
              aria-invalid={!!errors.website}
              aria-describedby={errors.website ? "ft-website-err" : undefined}
            />
            {errors.website && (
              <p id="ft-website-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.website}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ft-location" className="block text-sm font-medium text-foreground mb-1.5">
              Location <span className="text-muted font-normal">(required)</span>
            </label>
            <input
              id="ft-location"
              name="location"
              type="text"
              autoComplete="address-level1"
              value={form.location}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="City, region, or service area"
              aria-invalid={!!errors.location}
              aria-describedby={errors.location ? "ft-location-err" : undefined}
            />
            {errors.location && (
              <p id="ft-location-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.location}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ft-ambulanceCount" className="block text-sm font-medium text-foreground mb-1.5">
              Number of ambulances <span className="text-muted font-normal">(required)</span>
            </label>
            <input
              id="ft-ambulanceCount"
              name="ambulanceCount"
              type="number"
              min={1}
              step={1}
              value={form.ambulanceCount === 0 ? "" : form.ambulanceCount}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="e.g. 12"
              aria-invalid={!!errors.ambulanceCount}
              aria-describedby={errors.ambulanceCount ? "ft-ambulanceCount-err" : undefined}
            />
            {errors.ambulanceCount && (
              <p id="ft-ambulanceCount-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.ambulanceCount}
              </p>
            )}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="ft-epcrSystem" className="block text-sm font-medium text-foreground mb-1.5">
                ePCR system <span className="text-muted font-normal">(required)</span>
              </label>
              <select
                id="ft-epcrSystem"
                name="epcrSystem"
                value={form.epcrSystem}
                onChange={handleInputChange}
                className={selectClass}
                aria-invalid={!!errors.epcrSystem}
                aria-describedby={errors.epcrSystem ? "ft-epcrSystem-err" : undefined}
              >
                <option value="">Select ePCR system</option>
                {EPCR_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.epcrSystem && (
                <p id="ft-epcrSystem-err" className="mt-1 text-sm text-primary" role="alert">
                  {errors.epcrSystem}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="ft-billingSetup" className="block text-sm font-medium text-foreground mb-1.5">
                Billing setup <span className="text-muted font-normal">(required)</span>
              </label>
              <select
                id="ft-billingSetup"
                name="billingSetup"
                value={form.billingSetup}
                onChange={handleInputChange}
                className={selectClass}
                aria-invalid={!!errors.billingSetup}
                aria-describedby={errors.billingSetup ? "ft-billingSetup-err" : undefined}
              >
                <option value="">Select billing setup</option>
                {BILLING_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.billingSetup && (
                <p id="ft-billingSetup-err" className="mt-1 text-sm text-primary" role="alert">
                  {errors.billingSetup}
                </p>
              )}
            </div>
          </div>
        </div>
      </StageCard>

      {/* Section 2: Contact */}
      <StageCard step={2} title="Contact" description="Who we should reach and how.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="ft-name" className="block text-sm font-medium text-foreground mb-1.5">
              Name <span className="text-muted font-normal">(required)</span>
            </label>
            <input
              id="ft-name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Your full name"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "ft-name-err" : undefined}
            />
            {errors.name && (
              <p id="ft-name-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ft-role" className="block text-sm font-medium text-foreground mb-1.5">
              Role <span className="text-muted font-normal">(required)</span>
            </label>
            <select
              id="ft-role"
              name="role"
              value={form.role}
              onChange={handleInputChange}
              className={selectClass}
              aria-invalid={!!errors.role}
              aria-describedby={errors.role ? "ft-role-err" : undefined}
            >
              <option value="">Select role</option>
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.role && (
              <p id="ft-role-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.role}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ft-email" className="block text-sm font-medium text-foreground mb-1.5">
              Email <span className="text-muted font-normal">(required)</span>
            </label>
            <input
              id="ft-email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="you@agency.org"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "ft-email-err" : undefined}
            />
            {errors.email && (
              <p id="ft-email-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="ft-phone" className="block text-sm font-medium text-foreground mb-1.5">
              Phone <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              id="ft-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={handleInputChange}
              className={inputClass}
              placeholder="Best number to reach you"
            />
          </div>
        </div>
      </StageCard>

      {/* Section 3: Trial needs */}
      <StageCard
        step={3}
        title="Trial needs"
        description="What you want to solve first and how you'd like to proceed."
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="ft-primaryPainPoint" className="block text-sm font-medium text-foreground mb-1.5">
              Primary pain point <span className="text-muted font-normal">(required)</span>
            </label>
            <select
              id="ft-primaryPainPoint"
              name="primaryPainPoint"
              value={form.primaryPainPoint}
              onChange={handleInputChange}
              className={selectClass}
              aria-invalid={!!errors.primaryPainPoint}
              aria-describedby={errors.primaryPainPoint ? "ft-primaryPainPoint-err" : undefined}
            >
              <option value="">Select primary pain point</option>
              {PAIN_POINT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.primaryPainPoint && (
              <p id="ft-primaryPainPoint-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.primaryPainPoint}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border/90 bg-surface/30 p-4 sm:p-5 space-y-4">
            <span id="ft-protocol-legend" className="block text-sm font-medium text-foreground">
              Protocol <span className="text-muted font-normal">(optional)</span>
            </span>
            <p className="text-xs text-muted leading-relaxed -mt-2">
              Share a link to your protocol or upload a document. PDF or Word only; do not include PHI.
            </p>
            <div className="flex flex-col gap-3" role="radiogroup" aria-labelledby="ft-protocol-legend">
              <label className="inline-flex items-center gap-3 cursor-pointer rounded-lg border border-border bg-background/80 px-4 py-3.5 min-h-[48px] has-[:checked]:border-primary/45 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="protocolMode"
                  value=""
                  checked={form.protocolMode === ""}
                  onChange={() => handleProtocolModeChange("")}
                  className="h-4 w-4 shrink-0 border-border text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">No protocol attached</span>
              </label>
              <label className="inline-flex items-center gap-3 cursor-pointer rounded-lg border border-border bg-background/80 px-4 py-3.5 min-h-[48px] has-[:checked]:border-primary/45 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="protocolMode"
                  value="url"
                  checked={form.protocolMode === "url"}
                  onChange={() => handleProtocolModeChange("url")}
                  className="h-4 w-4 shrink-0 border-border text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Protocol URL</span>
              </label>
              <label className="inline-flex items-center gap-3 cursor-pointer rounded-lg border border-border bg-background/80 px-4 py-3.5 min-h-[48px] has-[:checked]:border-primary/45 has-[:checked]:bg-primary/5">
                <input
                  type="radio"
                  name="protocolMode"
                  value="upload"
                  checked={form.protocolMode === "upload"}
                  onChange={() => handleProtocolModeChange("upload")}
                  className="h-4 w-4 shrink-0 border-border text-primary focus:ring-ring"
                />
                <span className="text-sm text-foreground">Document upload</span>
              </label>
            </div>

            {form.protocolMode === "url" && (
              <div className="pt-1">
                <label htmlFor="ft-protocolUrl" className="block text-sm font-medium text-foreground mb-1.5">
                  Protocol link <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  id="ft-protocolUrl"
                  name="protocolUrl"
                  type="text"
                  inputMode="url"
                  autoComplete="off"
                  value={form.protocolUrl}
                  onChange={handleInputChange}
                  className={inputClass}
                  placeholder="https://… or intranet path you can share"
                  aria-invalid={!!errors.protocolUrl}
                  aria-describedby={errors.protocolUrl ? "ft-protocolUrl-err" : undefined}
                />
                {errors.protocolUrl && (
                  <p id="ft-protocolUrl-err" className="mt-1 text-sm text-primary" role="alert">
                    {errors.protocolUrl}
                  </p>
                )}
              </div>
            )}

            {form.protocolMode === "upload" && (
              <div className="pt-1 space-y-2">
                <label htmlFor="ft-protocolFile" className="block text-sm font-medium text-foreground mb-1.5">
                  Upload file <span className="text-muted font-normal">(optional)</span>
                </label>
                <input
                  id="ft-protocolFile"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleProtocolFileChange}
                  className="block w-full text-sm text-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:opacity-90"
                />
                {form.protocolFileName ? (
                  <p className="text-xs text-muted">
                    Selected: <span className="text-foreground font-medium">{form.protocolFileName}</span>
                  </p>
                ) : null}
                {errors.protocolFile && (
                  <p className="text-sm text-primary" role="alert">
                    {errors.protocolFile}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <span id="ft-reports-legend" className="block text-sm font-medium text-foreground mb-2">
              Willing to provide sample reports (de-identified)?{" "}
              <span className="text-muted font-normal">(required)</span>
            </span>
            <div className="flex flex-col gap-3" role="radiogroup" aria-labelledby="ft-reports-legend">
              {REPORT_RADIO_OPTIONS.map(({ value, label }) => (
                <label
                  key={value}
                  className="inline-flex items-center gap-3 cursor-pointer rounded-lg border border-border bg-surface/40 px-4 py-3.5 min-h-[48px] has-[:checked]:border-primary/45 has-[:checked]:bg-primary/5"
                >
                  <input
                    type="radio"
                    name="willingToProvideReports"
                    value={value}
                    checked={form.willingToProvideReports === value}
                    onChange={() => handleRadioChange(value)}
                    className="h-4 w-4 shrink-0 border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-foreground">{label}</span>
                </label>
              ))}
            </div>
            {errors.willingToProvideReports && (
              <p id="ft-reports-err" className="mt-2 text-sm text-primary" role="alert">
                {errors.willingToProvideReports}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="ft-nextStepPreference" className="block text-sm font-medium text-foreground mb-1.5">
              Preferred next step <span className="text-muted font-normal">(required)</span>
            </label>
            <select
              id="ft-nextStepPreference"
              name="nextStepPreference"
              value={form.nextStepPreference}
              onChange={handleInputChange}
              className={selectClass}
              aria-invalid={!!errors.nextStepPreference}
              aria-describedby={errors.nextStepPreference ? "ft-nextStepPreference-err" : undefined}
            >
              <option value="">Select preference</option>
              {NEXT_STEP_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.nextStepPreference && (
              <p id="ft-nextStepPreference-err" className="mt-1 text-sm text-primary" role="alert">
                {errors.nextStepPreference}
              </p>
            )}
          </div>
        </div>
      </StageCard>

      {/* Section 4: Data readiness + Legal + submit */}
      <StageCard
        step={4}
        title="Data readiness & legal"
        description="Onboarding inputs and required acknowledgements before you submit."
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <Subheading>Data readiness</Subheading>
            <p className="text-sm text-muted leading-relaxed -mt-2">
              Indicate what you can share during onboarding. Do not enter any PHI in this form.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  ["pdfAvailable", "PDF exports available"],
                  ["csvAvailable", "CSV / tabular exports available"],
                  ["xmlAvailable", "XML / NEMSIS-style exports available"],
                  ["protocolsAvailable", "Protocols or clinical guidelines available"],
                ] as const
              ).map(([name, label]) => (
                <label
                  key={name}
                  className="flex items-start gap-3 cursor-pointer rounded-lg border border-border bg-surface/40 px-4 py-3.5 min-h-[48px] has-[:checked]:border-primary/45 has-[:checked]:bg-primary/5"
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={form[name]}
                    onChange={handleInputChange}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-ring"
                  />
                  <span className="text-sm text-foreground leading-snug">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Subheading>Legal acknowledgements</Subheading>
            <div className="rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="baaAccepted"
                  checked={form.baaAccepted}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-ring"
                  aria-invalid={!!errors.baaAccepted}
                  aria-describedby={errors.baaAccepted ? "ft-baa-err" : undefined}
                />
                <span className="text-sm text-muted leading-relaxed">
                  I understand that MAIA may require a signed Business Associate Agreement before any patient-related or
                  protected health information is shared or processed.
                </span>
              </label>
              {errors.baaAccepted && (
                <p id="ft-baa-err" className="mt-3 text-sm text-primary pl-7" role="alert">
                  {errors.baaAccepted}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={form.termsAccepted}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-ring"
                  aria-invalid={!!errors.termsAccepted}
                  aria-describedby={errors.termsAccepted ? "ft-terms-err" : undefined}
                />
                <span className="text-sm text-muted leading-relaxed">
                  I agree to the{" "}
                  <Link
                    href={routes.legalTerms}
                    className="text-primary underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Terms
                  </Link>
                  ,{" "}
                  <Link
                    href="#"
                    className="text-primary underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Privacy Policy
                  </Link>
                  , and{" "}
                  <Link
                    href={routes.legalBaa}
                    className="text-primary underline underline-offset-2 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                  >
                    Business Associate Agreement
                  </Link>{" "}
                  review process.
                </span>
              </label>
              {errors.termsAccepted && (
                <p id="ft-terms-err" className="mt-3 text-sm text-primary pl-7" role="alert">
                  {errors.termsAccepted}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-5 pt-2 border-t border-border/80">
            <div
              className="rounded-xl border border-primary/25 bg-primary/5 px-4 py-3 sm:px-5 sm:py-4"
              role="note"
            >
              <p className="text-sm font-semibold text-foreground">Compliance notice</p>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">
                Do not include patient names, medical record numbers, incident details, or other protected health
                information in this form.
              </p>
            </div>

            {submitError && (
              <p className="text-sm text-primary" role="alert">
                {submitError}
              </p>
            )}

            {/* Analytics: fire on successful submit in handler (see @/lib/analytics-events) — e.g. posthog.capture(dataEvent.freeTrialSubmit) */}
            <button
              type="submit"
              data-event={dataEvent.freeTrialSubmit}
              disabled={isSubmitting}
              className="w-full min-h-[48px] px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none sm:w-auto sm:min-w-[14rem]"
            >
              {isSubmitting ? "Submitting…" : "Submit Free Trial Request"}
            </button>
          </div>
        </div>
      </StageCard>
    </form>
  );
}
