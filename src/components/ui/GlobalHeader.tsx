"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalHeader() {
  const pathname = usePathname();

  // If we are on the dashboard, we hide this global navbar to let the dashboard's dedicated premium sidebar take full control.
  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }
}
