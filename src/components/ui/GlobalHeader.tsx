"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GlobalHeader() {
  const pathname = usePathname();

  // If we are on the dashboard, we hide this global navbar to let the dashboard's dedicated premium sidebar take full control.
  if (pathname && pathname.startsWith("/dashboard")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-100 dark:border-slate-800">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-md shadow-blue-500/20">
            SS
          </span>
          <span className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-200">
            Comedores SS
          </span>
        </Link>
        
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link href="/" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
            Inicio
          </Link>
          <Link href="/dashboard" className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white shadow-md shadow-blue-500/10 transition-all hover:scale-[1.02] active:scale-95">
            Ingresar al Dashboard
          </Link>
        </div>
      </nav>
    </header>
  );
}
