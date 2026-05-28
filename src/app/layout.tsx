import type { Metadata } from "next";
import type { ReactNode } from "react";
import GlobalHeader from "@/components/ui/GlobalHeader";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Comedores SS - Guía de Comida Callejera de San Salvador",
  description: "Descubre puestos de comida reales, precios honestos, ubicación en mapa GPS e indicadores de higiene y seguridad de la comunidad en San Salvador.",
  keywords: ["comedores ss", "comida callejera san salvador", "pupusas", "comida tipica el salvador", "mapa comedores", "san salvador comida"],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-500 selection:text-white">
        <GlobalHeader />
        {children}
      </body>
    </html>
  );
}

