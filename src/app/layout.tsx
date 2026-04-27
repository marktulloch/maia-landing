import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans-maia",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MAIA - AI Scribe + Compliance for Ambulance Reports",
  description: "Medics dictate a run. MAIA compiles and QA's the report — accurate, compliant, and billable >75% faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased`}
      >
        {/* Client analytics: mount @vercel/analytics <Analytics />, next/script for gtag, or a small client provider
            that listens for clicks on [data-event] — event names live in @/lib/analytics-events.ts */}
        {children}
      </body>
    </html>
  );
}
