import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden mx-auto max-w-6xl px-6 py-20 sm:py-28 text-center">
      {/* Decorative Blur Dot */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-[80px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40 px-4 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 animate-pulse">
        🇸🇻 San Salvador, El Salvador
      </span>
      
      <h1 className="mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        Lo que Google Maps <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">no dice</span> de la comida callejera
      </h1>
      
      <p className="mx-auto mt-6 max-w-xl text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
        Descubre pupuserías escondidas, desayunos caseros y comedores económicos con ubicaciones exactas en mapa, rango de precios reales e indicadores de higiene verificados por la comunidad.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4.5">
        <Link 
          href="/dashboard" 
          className="rounded-2xl bg-blue-600 hover:bg-blue-500 px-6.5 py-4 text-sm font-extrabold text-white shadow-xl shadow-blue-500/25 transition-all hover:scale-[1.03] active:scale-95"
        >
          Ingresar al Dashboard Premium
        </Link>
        <Link 
          href="/dashboard?tab=mapa" 
          className="rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 px-6.5 py-4 text-sm font-extrabold text-slate-700 dark:text-slate-200 transition-all hover:scale-[1.03] active:scale-95 shadow-sm"
        >
          Explorar el Mapa GPS
        </Link>
      </div>
    </section>
  );
}

