"use client";

import { useEffect } from "react";
import { routes } from "@/lib/routes";

/** `/free-trial` forwards to the unified booking + form page (hash preserved for scroll). */
export function RedirectToBookTrialForm() {
  useEffect(() => {
    window.location.replace(`${routes.bookTrial}#trial-form`);
  }, []);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm text-muted">Taking you to the trial form…</p>
    </div>
  );
}
