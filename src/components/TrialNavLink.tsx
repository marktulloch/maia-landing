"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { dataEvent } from "@/lib/analytics-events";
import { routes } from "@/lib/routes";

type Props = Omit<ComponentProps<typeof Link>, "href">;

/**
 * “Start FREE TRIAL” from the marketing home → `/book-trial`. From `/book-trial` (or nested) → home so users can
 * return to the main site.
 */
export default function TrialNavLink(props: Props) {
  const pathname = usePathname();
  const onBookTrial =
    pathname === routes.bookTrial || pathname.startsWith(`${routes.bookTrial}/`);
  const href = onBookTrial ? routes.home : routes.bookTrial;

  return <Link {...props} href={href} data-event={dataEvent.freeTrialCtaClick} />;
}
