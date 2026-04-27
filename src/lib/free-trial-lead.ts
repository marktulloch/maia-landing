import type { FreeTrialFormPayload } from "./free-trial";

/** Validated form data plus server-generated intake metadata. */
export type FreeTrialLeadRecord = FreeTrialFormPayload & {
  readonly createdAt: string;
};

/**
 * Flat key/value row for Google Apps Script (or similar) webhooks that append one sheet row.
 * Keep keys stable so column order in the Sheet matches deployment docs.
 */
export type FreeTrialSheetsRow = Record<string, string | number | boolean>;

export function buildFreeTrialLeadRecord(data: FreeTrialFormPayload): FreeTrialLeadRecord {
  return {
    ...data,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Serialises the lead for `POST` to `GOOGLE_SHEETS_WEBHOOK_URL` (server-only env).
 * Booleans become actual JSON booleans; optional `website` becomes empty string when absent.
 */
/** Google Sheets cells are limited (~50k chars); truncate embedded base64 for the webhook row. */
const SHEETS_PROTOCOL_BASE64_MAX = 32_000;

export function toGoogleSheetsWebhookPayload(record: FreeTrialLeadRecord): FreeTrialSheetsRow {
  const rawB64 = record.protocolFileBase64 ?? "";
  const protocolFileBase64ForSheet =
    rawB64.length > SHEETS_PROTOCOL_BASE64_MAX
      ? `${rawB64.slice(0, SHEETS_PROTOCOL_BASE64_MAX)}...[truncated]`
      : rawB64;

  return {
    createdAt: record.createdAt,
    organisationName: record.organisationName,
    website: record.website ?? "",
    location: record.location,
    ambulanceCount: record.ambulanceCount,
    epcrSystem: record.epcrSystem,
    billingSetup: record.billingSetup,
    contactName: record.name,
    role: record.role,
    email: record.email,
    phone: record.phone ?? "",
    primaryPainPoint: record.primaryPainPoint,
    willingToProvideReports: record.willingToProvideReports,
    nextStepPreference: record.nextStepPreference,
    pdfAvailable: record.pdfAvailable,
    csvAvailable: record.csvAvailable,
    xmlAvailable: record.xmlAvailable,
    protocolsAvailable: record.protocolsAvailable,
    protocolUrl: record.protocolUrl ?? "",
    protocolFileName: record.protocolFileName ?? "",
    protocolFileMimeType: record.protocolFileMimeType ?? "",
    protocolFileBase64: protocolFileBase64ForSheet,
    baaAccepted: record.baaAccepted,
    termsAccepted: record.termsAccepted,
  };
}
