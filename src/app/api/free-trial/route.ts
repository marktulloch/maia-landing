import { NextResponse } from "next/server";
import { parseFreeTrialBody } from "@/lib/free-trial";
import { buildFreeTrialLeadRecord, toGoogleSheetsWebhookPayload } from "@/lib/free-trial-lead";

const WEBHOOK_TIMEOUT_MS = 15_000;

/**
 * Google Apps Script “Deploy as web app” URL (secret). Never exposed to the browser — read only here.
 * @see https://developers.google.com/apps-script/guides/web
 */
function getSheetsWebhookUrl(): string | undefined {
  const raw = process.env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
  return raw && raw.length > 0 ? raw : undefined;
}

function jsonError(message: string, status: number, extras?: Record<string, unknown>) {
  return NextResponse.json({ ok: false, error: message, ...extras }, { status });
}

/**
 * POST /api/free-trial
 *
 * Intake today:
 * - **Google Sheets (via Apps Script webhook)** is **temporary operational storage** — fine for early leads,
 *   but not a long-term system of record. Expect rate limits, no strong transactional guarantees, and manual
 *   column maintenance on the Sheet side.
 *
 * Lead engineer — replace or supplement this path with:
 * - **MAIA backend API / database** — e.g. `POST /internal/leads` (auth service-to-service), Prisma/Postgres row,
 *   idempotency keys, and audit logs. Once that exists, either stop calling Sheets or mirror from the backend job.
 *
 * After a **successful** persist (Sheets and/or DB), you can:
 * - **Trigger BAA / DocuSign workflow** — e.g. when `nextStepPreference === "BAA review"` or when PHI is expected;
 *   enqueue from here or from an outbox worker so this HTTP handler stays fast.
 * - **Send admin notification email** — non-PHI summary only (org name, contact email, `createdAt`).
 */
export async function POST(req: Request) {
  let rawText: string;
  try {
    rawText = await req.text();
  } catch {
    return jsonError("Could not read request body.", 400);
  }

  if (!rawText || rawText.trim().length === 0) {
    return jsonError("Request body cannot be empty.", 400);
  }

  let body: unknown;
  try {
    body = JSON.parse(rawText) as unknown;
  } catch {
    return jsonError("Invalid JSON. Send a JSON object with the free-trial fields.", 400);
  }

  const parsed = parseFreeTrialBody(body);
  if (!parsed.ok) {
    return jsonError(parsed.error, 400);
  }

  const lead = buildFreeTrialLeadRecord(parsed.data);
  /** Validated fields only + `createdAt` — safe to POST to Apps Script (no raw request body). */
  const sheetsPayload = toGoogleSheetsWebhookPayload(lead);

  const webhookUrl = getSheetsWebhookUrl();

  if (webhookUrl) {
    // --- Google Sheets: POST sanitized JSON to Apps Script web app; Script appends a row (or equivalent). ---
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sheetsPayload),
        signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
      });

      if (!res.ok) {
        const snippet = (await res.text().catch(() => "")).slice(0, 400);
        console.error("[api/free-trial] Google Apps Script / Sheets webhook HTTP error", {
          status: res.status,
          bodySnippet: snippet,
        });
        return jsonError(
          "We could not save your request to our intake system. Please try again in a few minutes or contact support.",
          502,
        );
      }

      // Optional: Apps Script may return JSON like `{ "ok": false }` with HTTP 200 — parse when content-type is JSON.
      const ct = res.headers.get("content-type") ?? "";
      if (ct.includes("application/json")) {
        try {
          const out = (await res.json()) as { ok?: boolean; success?: boolean; error?: string };
          const scriptOk = out.ok !== false && out.success !== false;
          if (!scriptOk) {
            console.error("[api/free-trial] Apps Script returned failure in JSON body", out);
            return jsonError(
              "We could not complete your signup right now. Please try again or contact support.",
              502,
            );
          }
        } catch {
          // Empty or non-JSON body with JSON content-type — treat HTTP 2xx as success.
        }
      }
    } catch (err) {
      console.error("[api/free-trial] Google Apps Script / Sheets webhook request failed", err);
      return jsonError(
        "We could not reach our intake service. Please try again later or contact support.",
        502,
      );
    }

    // TODO(MAIA backend): persist `lead` (or webhook response id) to primary database — replace Sheets as source of truth.

    // TODO(BAA / DocuSign): after successful submission, enqueue BAA workflow when business rules require it.

    // TODO(admin email): notify internal team (non-PHI summary only).

    // Analytics (server-side, optional): e.g. GA4 Measurement Protocol, PostHog server capture, or Segment —
    // emit a “trial_lead_received” style event here; align event names with client `data-event` values in
    // @/lib/analytics-events.ts. Never include PHI in payloads.

    return NextResponse.json({
      ok: true,
      devMode: false,
      message: "Your free trial request was received.",
    });
  }

  // No webhook: local/staging — Sheets is disabled; this is not production intake.
  console.info("[api/free-trial] GOOGLE_SHEETS_WEBHOOK_URL not set; sanitized payload (dev log):", JSON.stringify(sheetsPayload));

  // TODO(MAIA backend): persist `lead` here when DB exists, even without Sheets.

  // TODO(BAA / DocuSign): same hook as above after backend persist.

  // Analytics (server-side, optional): same pattern as webhook success — devMode intakes still belong in funnel metrics.

  return NextResponse.json({
    ok: true,
    devMode: true,
    message: "Your request was received.",
  });
}

export function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed. Submit a JSON body with POST /api/free-trial." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
