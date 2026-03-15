/**
 * TEMPORARY ADMIN GUARD — NOT PRODUCTION-SAFE
 * --------------------------------------------
 * This is a placeholder so /admin/* routes are gated during development.
 * It does NOT provide real security. Anyone who can set env vars or deploy
 * can enable admin. Replace with MAIA backend auth before production.
 *
 * Current behavior: single env flag ADMIN_ACCESS_ENABLED=true allows access.
 * No session, no roles, no server-side verification of identity.
 */

import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

/** Default: no one is allowed. Set ADMIN_ACCESS_ENABLED=true in .env.local to open the gate. */
const ADMIN_ACCESS_ENABLED = process.env.ADMIN_ACCESS_ENABLED === "true";

/**
 * Temporary check: is admin access allowed?
 * Used by the admin layout to show UI vs Unauthorized. Does NOT protect
 * server actions or API routes — those must enforce auth when you connect
 * the backend.
 *
 * --- REPLACE THIS IMPLEMENTATION ---
 *
 * 1) CONNECT MAIA BACKEND LOGIN SESSION
 *    Replace the body of this function with:
 *    - Read session from your auth provider (e.g. getSession() from NextAuth,
 *      or verify JWT from cookie/Authorization header against MAIA identity).
 *    - Return false if there is no valid session.
 *
 * 2) CONNECT ROLE / PERMISSION CHECKS
 *    After you have a session, check the user's role or permissions:
 *    - e.g. session.user.role === 'admin' || session.user.permissions.includes('cms:articles')
 *    - Return false if the user is not allowed to access admin.
 *
 * 3) SERVER-SIDE ENFORCEMENT
 *    This function only runs in the admin layout (page render). To fully
 *    secure admin, you must ALSO:
 *    - In app/admin/articles/actions.ts: at the top of createArticleAction,
 *      updateArticleAction, deleteArticleAction, call your auth check and
 *      redirect(routes.home) or throw if unauthorized.
 *    - Optionally use middleware to protect /admin/* and redirect
 *      unauthenticated users to your login page (with returnUrl=/admin/...).
 *
 * Keep the same signature so call sites stay unchanged:
 *   isAdminAllowed(): boolean
 */
export function isAdminAllowed(): boolean {
  return ADMIN_ACCESS_ENABLED;
}

/**
 * Use this in the admin layout if you prefer redirect to home over showing
 * the Unauthorized page. When integrating MAIA login, redirect to your
 * login route with returnUrl so users come back to /admin after sign-in.
 *
 * Example after backend is connected:
 *   if (!isAdminAllowed()) redirect('/login?returnUrl=' + encodeURIComponent(pathname))
 */
export function requireAdminOrRedirect(): void {
  if (!isAdminAllowed()) {
    redirect(routes.home);
  }
}
