# Google Sheets sync for MAIA free trial requests

This guide connects the MAIA landing site (`POST /api/free-trial`) to a Google Sheet via **Google Apps Script**. The Next.js app forwards a **sanitized JSON payload** to `GOOGLE_SHEETS_WEBHOOK_URL` when that environment variable is set.

> **Do not submit PHI into the form.** The free trial form is for operational and contact details only. Never enter patient names, MRNs, incident narrative, or other protected health information.

---

## Setup steps

### 1. Create a Google Sheet

Create a new spreadsheet named **MAIA Free Trial Requests** (or any name you prefer—the script below uses whichever sheet is active in the bound file).

### 2. Add column headers (row 1)

Add a header row that matches the JSON keys your webhook receives (same order as the sample script below for easiest maintenance):

| createdAt | organisationName | website | location | ambulanceCount | epcrSystem | billingSetup | contactName | role | email | phone | primaryPainPoint | willingToProvideReports | nextStepPreference | pdfAvailable | csvAvailable | xmlAvailable | protocolsAvailable | baaAccepted | termsAccepted |

- **`contactName`** is the submitter’s full name (the API maps the form field `name` to `contactName` in the webhook payload).
- **`website`** and **`phone`** may be empty strings.

Optionally freeze row 1 and turn on filters.

### 3. Open Apps Script

With the spreadsheet open: **Extensions → Apps Script**.

### 4. Paste the `doPost` script

Replace the default `Code.gs` contents with the sample below (or merge `doPost` into your project).

### 5. Deploy as web app

1. Click **Deploy → New deployment**.
2. Select type **Web app**.
3. **Execute as:** your account (or a dedicated service user if you use one).
4. **Who has access:** *Anyone* (anonymous callers from the MAIA server need to POST without Google sign-in). For stricter setups, use “Anyone within your organisation” only if your hosting network is compatible.
5. Deploy and authorise when prompted.

### 6. Copy the Web App URL

After deployment, copy the **Web app URL** (ends with `/exec`). This is the endpoint Next.js will call.

### 7. Add the URL to `.env.local`

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

Use the exact URL Apps Script shows. Do **not** commit this URL to public repos if the deployment is open.

### 8. Restart the Next.js dev server

Stop and start `npm run dev` (or your process manager) so `process.env.GOOGLE_SHEETS_WEBHOOK_URL` is loaded.

---

## Sample Apps Script

The payload from MAIA uses **`contactName`** (not `name`) for the contact person. Boolean fields arrive as JSON booleans.

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.createdAt || new Date().toISOString(),
    data.organisationName || "",
    data.website || "",
    data.location || "",
    data.ambulanceCount || "",
    data.epcrSystem || "",
    data.billingSetup || "",
    data.contactName || data.name || "",
    data.role || "",
    data.email || "",
    data.phone || "",
    data.primaryPainPoint || "",
    data.willingToProvideReports || "",
    data.nextStepPreference || "",
    data.pdfAvailable ? "Yes" : "No",
    data.csvAvailable ? "Yes" : "No",
    data.xmlAvailable ? "Yes" : "No",
    data.protocolsAvailable ? "Yes" : "No",
    data.baaAccepted ? "Yes" : "No",
    data.termsAccepted ? "Yes" : "No"
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

The MAIA API treats HTTP **2xx** and JSON `{ "success": true }` / `{ "ok": true }` as success when the response is JSON. Keep `success: true` (or `ok: true`) so failed script logic can return `{ success: false }` with HTTP 200 if you add validation later.

---

## Troubleshooting

- **403 / permission errors:** Re-run deployment, confirm “Who has access”, and re-authorise the script.
- **Empty rows:** Check **Executions** in Apps Script; log `e.postData.contents` temporarily to verify JSON shape.
- **CORS:** Server-side `fetch` from Next.js does not use browser CORS; issues are usually URL, auth, or quota related.

---

## Operational note

Google Sheets here is **temporary operational storage**. For production, plan to persist leads in the **MAIA backend database** and optionally keep Sheets as a mirror or retire it. See comments in `src/app/api/free-trial/route.ts` for integration hooks (BAA workflow, admin email, etc.).
