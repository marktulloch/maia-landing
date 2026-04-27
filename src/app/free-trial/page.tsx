import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { routes, getBaseUrl } from "@/lib/routes";
import { RedirectToBookTrialForm } from "./redirect-client";

export const metadata: Metadata = {
  title: "MAIA trial form | MAIA",
  description: "Complete your MAIA trial onboarding — you are being redirected to the booking and form page.",
  robots: { index: false, follow: true },
  ...(getBaseUrl() && {
    alternates: { canonical: `${getBaseUrl()}${routes.bookTrial}` },
  }),
};

export default function FreeTrialPage() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <main className="flex-1">
        <RedirectToBookTrialForm />
      </main>
      <Footer />
    </div>
  );
}
