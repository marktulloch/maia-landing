import Link from "next/link";
import { routes } from "@/lib/routes";

/**
 * Shown when the temporary admin guard blocks access (e.g. ADMIN_ACCESS_ENABLED
 * is not set). This is not real auth — replace the guard in src/lib/admin/guard.ts
 * with MAIA backend login and role checks, then optionally redirect to login
 * instead of showing this page.
 */
export default function Unauthorized() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-surface/30 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-xl font-semibold text-foreground">Unauthorized</h1>
        <p className="mt-2 text-sm text-muted">
          You don’t have access to this area. Right now access is gated by a
          temporary config flag. To secure admin for production, connect
          MAIA backend login and role checks in{" "}
          <code className="text-xs bg-surface px-1 rounded">src/lib/admin/guard.ts</code>{" "}
          and enforce auth in admin server actions.
        </p>
        <Link
          href={routes.home}
          className="mt-6 inline-block px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Go to home
        </Link>
      </div>
    </div>
  );
}
