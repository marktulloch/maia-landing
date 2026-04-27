/** Shared free-trial field options and server-side validation (no React). */

export const EPCR_OPTIONS = [
  "ESO",
  "ImageTrend",
  "Healthy EMS",
  "Zoll",
  "Other",
  "Not sure",
] as const;

export const BILLING_OPTIONS = ["In-house", "Outsourced", "Mixed", "Not sure"] as const;

export const ROLE_OPTIONS = [
  "Owner / Director",
  "Operations",
  "QA / QI",
  "Billing",
  "Medic / EMT",
  "Other",
] as const;

export const PAIN_POINT_OPTIONS = [
  "Documentation time",
  "QA / QI",
  "Billing leakage",
  "Protocol adherence",
  "Compliance",
  "Other",
] as const;

export const NEXT_STEP_OPTIONS = [
  "Demo",
  "Free trial",
  "BAA review",
  "Technical integration call",
] as const;

export const WILLING_REPORTS_VALUES = ["yes", "no", "need_to_discuss"] as const;

/** Optional protocol document upload (server validates size + MIME). */
export const PROTOCOL_FILE_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_PROTOCOL_FILE_BYTES = 2 * 1024 * 1024;

export type FreeTrialFormPayload = {
  organisationName: string;
  website?: string;
  location: string;
  ambulanceCount: number;
  epcrSystem: (typeof EPCR_OPTIONS)[number];
  billingSetup: (typeof BILLING_OPTIONS)[number];
  name: string;
  role: (typeof ROLE_OPTIONS)[number];
  email: string;
  phone?: string;
  primaryPainPoint: (typeof PAIN_POINT_OPTIONS)[number];
  willingToProvideReports: (typeof WILLING_REPORTS_VALUES)[number];
  nextStepPreference: (typeof NEXT_STEP_OPTIONS)[number];
  pdfAvailable: boolean;
  csvAvailable: boolean;
  xmlAvailable: boolean;
  protocolsAvailable: boolean;
  /** Optional link to agency protocol / clinical guidelines. */
  protocolUrl?: string;
  /** Optional small document (PDF/DOC/DOCX); base64 without data: prefix. */
  protocolFileName?: string;
  protocolFileMimeType?: string;
  protocolFileBase64?: string;
  baaAccepted: boolean;
  termsAccepted: boolean;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function includes<T extends readonly string[]>(arr: T, v: string): v is T[number] {
  return (arr as readonly string[]).includes(v);
}

function approxBytesFromBase64(s: string): number {
  const len = s.length;
  const padding = s.endsWith("==") ? 2 : s.endsWith("=") ? 1 : 0;
  return Math.floor((len * 3) / 4) - padding;
}

const BASE64_RE = /^[A-Za-z0-9+/]+=*$/;

function isValidProtocolBase64(s: string): boolean {
  if (s.length === 0 || s.length % 4 !== 0) return false;
  return BASE64_RE.test(s);
}

export function parseFreeTrialBody(body: unknown): { ok: true; data: FreeTrialFormPayload } | { ok: false; error: string } {
  if (body === null || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const o = body as Record<string, unknown>;

  if (Object.keys(o).length === 0) {
    return { ok: false, error: "Request body cannot be empty." };
  }

  const organisationName = typeof o.organisationName === "string" ? o.organisationName.trim() : "";
  const websiteRaw = typeof o.website === "string" ? o.website.trim() : "";
  const location = typeof o.location === "string" ? o.location.trim() : "";
  const ambulanceCount = o.ambulanceCount;
  const epcrSystem = typeof o.epcrSystem === "string" ? o.epcrSystem : "";
  const billingSetup = typeof o.billingSetup === "string" ? o.billingSetup : "";
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const role = typeof o.role === "string" ? o.role : "";
  const email = typeof o.email === "string" ? o.email.trim() : "";
  const phoneRaw = typeof o.phone === "string" ? o.phone.trim() : "";
  const primaryPainPoint = typeof o.primaryPainPoint === "string" ? o.primaryPainPoint : "";
  const willingToProvideReports = typeof o.willingToProvideReports === "string" ? o.willingToProvideReports : "";
  const nextStepPreference = typeof o.nextStepPreference === "string" ? o.nextStepPreference : "";

  if (!organisationName) return { ok: false, error: "Organisation name is required." };
  if (!location) return { ok: false, error: "Location is required." };

  const count =
    typeof ambulanceCount === "number"
      ? ambulanceCount
      : typeof ambulanceCount === "string"
        ? parseInt(ambulanceCount, 10)
        : NaN;
  if (!Number.isFinite(count) || !Number.isInteger(count) || count < 1) {
    return { ok: false, error: "A valid ambulance count (at least 1) is required." };
  }

  if (!includes(EPCR_OPTIONS, epcrSystem)) return { ok: false, error: "Invalid ePCR system." };
  if (!includes(BILLING_OPTIONS, billingSetup)) return { ok: false, error: "Invalid billing setup." };

  if (!name) return { ok: false, error: "Name is required." };
  if (!includes(ROLE_OPTIONS, role)) return { ok: false, error: "Invalid role." };
  if (!email || !EMAIL_REGEX.test(email)) return { ok: false, error: "A valid email is required." };

  if (!includes(PAIN_POINT_OPTIONS, primaryPainPoint)) return { ok: false, error: "Invalid primary pain point." };
  if (!includes(WILLING_REPORTS_VALUES, willingToProvideReports)) {
    return { ok: false, error: "Invalid response for sample reports question." };
  }
  if (!includes(NEXT_STEP_OPTIONS, nextStepPreference)) return { ok: false, error: "Invalid next step preference." };

  const pdfAvailable = o.pdfAvailable === true;
  const csvAvailable = o.csvAvailable === true;
  const xmlAvailable = o.xmlAvailable === true;
  const protocolsAvailable = o.protocolsAvailable === true;

  const protocolUrlRaw = typeof o.protocolUrl === "string" ? o.protocolUrl.trim() : "";
  const protocolFileNameRaw = typeof o.protocolFileName === "string" ? o.protocolFileName.trim() : "";
  const protocolFileMimeTypeRaw = typeof o.protocolFileMimeType === "string" ? o.protocolFileMimeType.trim() : "";
  const protocolFileBase64Raw = typeof o.protocolFileBase64 === "string" ? o.protocolFileBase64.replace(/\s/g, "") : "";

  let protocolUrl: string | undefined;
  if (protocolUrlRaw) {
    if (!/^https?:\/\//i.test(protocolUrlRaw) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(protocolUrlRaw)) {
      return { ok: false, error: "Invalid protocol URL." };
    }
    protocolUrl = protocolUrlRaw.slice(0, 2048);
  }

  let protocolFileName: string | undefined;
  let protocolFileMimeType: string | undefined;
  let protocolFileBase64: string | undefined;

  const hasAnyFileField =
    protocolFileNameRaw.length > 0 || protocolFileMimeTypeRaw.length > 0 || protocolFileBase64Raw.length > 0;
  if (hasAnyFileField) {
    if (!protocolFileNameRaw || !protocolFileMimeTypeRaw || !protocolFileBase64Raw) {
      return { ok: false, error: "Protocol document requires file name, type, and file data." };
    }
    const maxB64Chars = Math.ceil((MAX_PROTOCOL_FILE_BYTES * 4) / 3) + 4;
    if (protocolFileBase64Raw.length > maxB64Chars) {
      return { ok: false, error: "Protocol document is too large." };
    }
    if (!includes(PROTOCOL_FILE_MIME_TYPES, protocolFileMimeTypeRaw)) {
      return { ok: false, error: "Protocol document must be PDF, DOC, or DOCX." };
    }
    if (!isValidProtocolBase64(protocolFileBase64Raw)) {
      return { ok: false, error: "Protocol document data is invalid." };
    }
    const approx = approxBytesFromBase64(protocolFileBase64Raw);
    if (approx > MAX_PROTOCOL_FILE_BYTES) {
      return { ok: false, error: `Protocol document must be ${MAX_PROTOCOL_FILE_BYTES / (1024 * 1024)}MB or smaller.` };
    }
    protocolFileName = protocolFileNameRaw.slice(0, 255);
    protocolFileMimeType = protocolFileMimeTypeRaw;
    protocolFileBase64 = protocolFileBase64Raw;
  }

  if (o.baaAccepted !== true) return { ok: false, error: "BAA acknowledgment is required." };
  if (o.termsAccepted !== true) return { ok: false, error: "Terms acceptance is required." };

  let website: string | undefined;
  if (websiteRaw) {
    if (!/^https?:\/\//i.test(websiteRaw) && !/^[a-z0-9.-]+\.[a-z]{2,}/i.test(websiteRaw)) {
      return { ok: false, error: "Invalid website URL." };
    }
    website = websiteRaw.slice(0, 512);
  }

  const phone = phoneRaw ? phoneRaw.slice(0, 64) : undefined;

  return {
    ok: true,
    data: {
      organisationName,
      ...(website ? { website } : {}),
      location,
      ambulanceCount: count,
      epcrSystem,
      billingSetup,
      name,
      role,
      email,
      ...(phone ? { phone } : {}),
      primaryPainPoint,
      willingToProvideReports,
      nextStepPreference,
      pdfAvailable,
      csvAvailable,
      xmlAvailable,
      protocolsAvailable,
      ...(protocolUrl ? { protocolUrl } : {}),
      ...(protocolFileName && protocolFileMimeType && protocolFileBase64
        ? { protocolFileName, protocolFileMimeType, protocolFileBase64 }
        : {}),
      baaAccepted: true,
      termsAccepted: true,
    },
  };
}
