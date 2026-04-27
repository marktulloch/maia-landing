/**
 * `data-event` attribute values for marketing / funnel elements.
 *
 * Use these on `<a>`, `<Link>`, and `<button>` elements so tag managers or a thin client script can attach
 * listeners without changing markup again.
 *
 * ---------------------------------------------------------------------------
 * Later: connect to analytics (no packages required in markup)
 * ---------------------------------------------------------------------------
 *
 * **Google Analytics 4 (via GTM or gtag)**
 * - GTM: Trigger “Click – All Elements” where `Click Element` matches `[data-event="…"]`, or use a Custom Event
 *   trigger reading `dataLayer.push({ event: "cta_click", cta_type: … })` from a small delegated click handler.
 * - gtag: In `layout.tsx` or a client provider, `document.addEventListener("click", …)` and call
 *   `gtag("event", "select_content", { content_type: el.dataset.event })` (map names to your GA4 event taxonomy).
 *
 * **PostHog**
 * - After `posthog.init`, register `document.addEventListener("click", …)` and `posthog.capture(el.dataset.event, {
 *   href, text })` when `data-event` is present. Or use Autocapture with data attributes as filters.
 *
 * **Vercel Analytics**
 * - `@vercel/analytics` tracks Web Vitals by default; custom button events still need `track()` (or the delegated
 *   pattern above) from your own client bundle once installed.
 *
 * **Privacy:** Never mirror form field values or PHI into analytics payloads—only `data-event` and safe context
 * (e.g. pathname) if needed.
 */
export const dataEvent = {
  freeTrialCtaClick: "free_trial_cta_click",
  freeTrialSubmit: "free_trial_submit",
  demoCtaClick: "demo_cta_click",
} as const;
