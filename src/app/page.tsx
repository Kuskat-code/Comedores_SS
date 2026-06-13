"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-[#fcfaf2] font-sans selection:bg-[#ff5d22] selection:text-white relative overflow-hidden">
      
      {/* ==========================================
          1. BACKGROUND TEXTURES & STREET MAP OVERLAY
          ========================================== */}
      {/* Visually intervened grid/map lines */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-color-dodge">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#fcfaf2" strokeWidth="1.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Abstract Map Lines representing San Salvador street grid */}
      <div className="absolute top-10 right-0 w-2/3 h-full opacity-10 pointer-events-none -z-10">
        <svg viewBox="0 0 800 800" className="w-full h-full stroke-[#fcfaf2] stroke-[2] fill-none">
          <path d="M100,50 L400,120 L650,80 L750,280 L500,450 L350,680 L50,600 Z" />
          <path d="M400,120 L350,680" strokeDasharray="5,5" />
          <path d="M100,50 L500,450" />
          <path d="M650,80 L350,680" />
          <path d="M250,90 A80,80 0 1,1 420,150" stroke="#ff5d22" strokeWidth="3" />
          <circle cx="420" cy="150" r="12" fill="#39ff14" className="animate-pulse" />
          <circle cx="500" cy="450" r="8" fill="#ff5d22" />
          <circle cx="200" cy="300" r="8" fill="#3b82f6" />
        </svg>
      </div>

      {/* Street sticker badges floating around for texture */}
      <div className="hidden xl:block absolute top-32 right-[45%] rotate-[-6deg] bg-[#ff5d22] text-black text-xs font-black uppercase px-3 py-1.5 rounded shadow-lg pointer-events-none select-none tracking-widest border border-black/10">
        🔥 Pupusas después de las 10
      </div>
      <div className="hidden xl:block absolute bottom-36 left-[35%] rotate-[8deg] bg-[#39ff14] text-black text-xs font-black uppercase px-3.5 py-1.5 rounded shadow-lg pointer-events-none select-none tracking-widest border border-black/10">
        🧼 Higiene Verificada
      </div>
      <div className="hidden xl:block absolute bottom-12 right-[32%] rotate-[-4deg] bg-[#3b82f6] text-white text-[10px] font-black uppercase px-3 py-1 rounded shadow-lg pointer-events-none select-none tracking-wider border border-white/10">
        📍 142 JOYAS LOCALES
      </div>

      {/* ==========================================
          2. HEADER / NAVBAR (Streetwear Brand Vibe)
          ========================================== */}
      <header className="border-b border-[#fcfaf2]/10 bg-[#0a0a0c]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-5">
          {/* Logo with hand-drawn wood sign texture feel */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex h-11 w-11 items-center justify-center rounded bg-[#ff5d22] text-black text-xl font-black rotate-[-3deg] group-hover:rotate-[2deg] transition-transform shadow-md shadow-[#ff5d22]/20">
              SS
            </span>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tighter text-[#fcfaf2]">
                Comedores <span className="text-[#ff5d22]">SS</span>
              </h1>
              <p className="text-[9px] text-[#faf6ee]/50 font-bold uppercase tracking-widest">Cultura de Calle</p>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowLoginModal(true)}
              className="text-xs font-extrabold uppercase text-[#fcfaf2]/80 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </button>
            <Link
              href="/dashboard"
              className="relative inline-flex items-center justify-center rounded px-5 py-3 text-xs font-black uppercase tracking-wider text-black bg-[#fcfaf2] hover:bg-[#ff5d22] hover:text-black transition-all hover:scale-[1.02] border-2 border-black active:scale-95 shadow-[4px_4px_0px_0px_rgba(255,93,34,1)] hover:shadow-[4px_4px_0px_0px_rgba(252,250,242,1)]"
            >
              Ir al Mapa
            </Link>
          </div>
        </div>
      </header>

      {/* ==========================================
          3. HERO SECTION (Asymmetric Editorial Style)
          ========================================== */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: Typographic Impact Column */}
          <div className="lg:col-span-7 space-y-8">
            <span className="inline-block text-[10px] font-black uppercase tracking-widest border-2 border-[#ff5d22] text-[#ff5d22] px-3.5 py-1.5 rounded-sm bg-[#ff5d22]/5">
              🍺 Guía Documental No-Oficial
            </span>

            {/* The Aggressive Editorial Headline */}
            <h2 className="text-4xl sm:text-[5.5rem] font-black leading-[0.9] tracking-tighter text-[#fcfaf2] uppercase">
              EL SABOR REAL <br className="hidden sm:inline" />
              NO TIENE ESTRELLAS <br />
              <span className="bg-gradient-to-r from-[#ff5d22] to-[#ffaa44] bg-clip-text text-transparent">
                MICHELIN.
              </span>
            </h2>

            {/* Redesigned copy: cultural, close, and raw */}
            <div className="space-y-4 max-w-xl text-[#fcfaf2]/80 font-medium text-sm sm:text-base leading-relaxed">
              <p>
                Las mejores pupusas de San Salvador no salen en TripAdvisor, ni los comedores más ricos tienen campañas de marketing digital. Están escondidos a la par de talleres mecánicos, en esquinas sin rótulo o bajo lonas azules en el mercado.
              </p>
              <p className="text-xs text-[#faf6ee]/50 font-bold border-l-2 border-[#ff5d22] pl-3">
                “San Salvador se come en la calle. Mapeamos la comida real verificada por la misma comunidad, sin filtros de app de crypto.”
              </p>
            </div>

            {/* Dynamic visual tags for texture */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded border border-[#fcfaf2]/20 bg-[#0f0f12]">
                🛵 Desayunos desde $1.50
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded border border-[#fcfaf2]/20 bg-[#0f0f12]">
                🔥 Pupusas de Maíz y Arroz
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded border border-[#fcfaf2]/20 bg-[#0f0f12]">
                🍺 Almuerzos Ejecutivos
              </span>
            </div>

            {/* Streetwear CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4.5">
              <Link
                href="/dashboard"
                className="relative inline-flex items-center justify-center rounded px-7 py-5 text-sm font-black uppercase tracking-wider text-black bg-[#ff5d22] border-2 border-black transition-all hover:scale-[1.03] active:scale-95 shadow-[5px_5px_0px_0px_rgba(252,250,242,1)]"
              >
                Ingresar al Dashboard
              </Link>
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center justify-center rounded px-7 py-5 text-sm font-black uppercase tracking-wider border-2 border-[#fcfaf2]/20 hover:border-[#ff5d22]/50 hover:bg-[#ff5d22]/5 text-[#fcfaf2] transition-all hover:scale-[1.03] active:scale-95"
              >
                Iniciar Sesión
              </button>
            </div>
          </div>

          {/* RIGHT: Polaroid Documentary Cards & Map Grid */}
          <div className="lg:col-span-5 relative flex flex-col items-center">
            
            {/* Background Hand-painted style sign mock */}
            <div className="absolute -top-12 -left-6 rotate-[-12deg] z-10 bg-[#fcfaf2] text-black px-4 py-2 border-2 border-black font-black uppercase text-xs tracking-widest shadow-md">
              📍 Pupusería El Triángulo
            </div>

            {/* Main Polaroid Style Card 1 */}
            <div className="w-full max-w-sm rounded-sm bg-[#121215] border-2 border-[#fcfaf2]/25 p-5 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300">
              {/* Image Frame representation */}
              <div className="relative aspect-[4/3] bg-gradient-to-tr from-amber-950 via-[#26170d] to-[#121215] rounded border border-[#fcfaf2]/10 overflow-hidden flex items-center justify-center">
                <span className="text-5xl filter saturate-75">🥟</span>
                {/* Visual coordinate badge */}
                <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-black/80 px-2 py-0.5 text-[#39ff14]">
                  LAT 13.6929 / LNG -89.2182
                </span>
                <span className="absolute top-2 right-2 text-[9px] font-mono bg-[#ff5d22] text-black px-2 py-0.5 font-bold">
                  🔥 POPULAR
                </span>
              </div>
              
              {/* Polaroid Footer */}
              <div className="pt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-black uppercase tracking-tight">Pupusería El Triángulo</h4>
                  <span className="text-[#39ff14] text-xs font-mono">96% Confianza</span>
                </div>
                <p className="text-[11px] text-[#fcfaf2]/70 leading-relaxed">
                  &quot;El queso se sale por los bordes y las sirven en hojas de huerta calientes. El curtido es casero con chile de cabro.&quot;
                </p>
                <div className="pt-2 flex items-center justify-between border-t border-[#fcfaf2]/10 text-[9px] font-bold text-[#fcfaf2]/40 uppercase tracking-widest">
                  <span>Desde $0.85 c/u</span>
                  <span className="text-[#ff5d22]">★ 4.9 (450 Votos)</span>
                </div>
              </div>
            </div>

            {/* Back Polaroid Card 2 (Stacked behind) */}
            <div className="w-full max-w-sm rounded-sm bg-[#18181c] border-2 border-[#fcfaf2]/10 p-5 shadow-xl rotate-[3deg] absolute -bottom-10 -right-4 -z-10 opacity-60">
              <div className="aspect-[4/3] bg-[#222]" />
              <div className="pt-4 h-16 bg-slate-800/10" />
            </div>

          </div>
        </div>
      </section>

      {/* ==========================================
          4. CATEGORÍAS SALVADOREÑAS (Hand-painted Signs Style)
          ========================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 border-t border-[#fcfaf2]/10 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <span className="text-[10px] font-bold text-[#ff5d22] uppercase tracking-widest">El Menú Nacional</span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter mt-1">Categorías de la Calle</h3>
          </div>
          <p className="text-xs text-[#faf6ee]/50 max-w-xs leading-relaxed">
            Cada plato cuenta una historia de madrugadas, mercados populares y recetas heredadas.
          </p>
        </div>

        {/* Categories Grid - Styled like hand-painted wooden blocks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { title: "Pupuserías", emoji: "🥟", bg: "bg-[#161311] border-[#ff5d22]/30", text: "Maíz o arroz, revueltas, de ayote o locas.", highlight: "Fuego lento" },
            { title: "Desayunos", emoji: "🍳", bg: "bg-[#111612] border-[#39ff14]/30", text: "Tipicos con frijolitos, plátano asado y crema.", highlight: "Desde las 5 AM" },
            { title: "Comedores", emoji: "🍛", bg: "bg-[#111417] border-[#3b82f6]/30", text: "El almuerzo ejecutivo de pollo guisado y fresco.", highlight: "Precio Fijo" },
            { title: "Antojitos", emoji: "🌽", bg: "bg-[#171317] border-pink-500/30", text: "Atol de elote, elotes locos y empanadas.", highlight: "Tardes de café" }
          ].map((cat, i) => (
            <div key={i} className={`p-6 rounded-sm border-2 transition-all hover:scale-[1.02] cursor-pointer relative overflow-hidden group ${cat.bg}`}>
              <span className="text-4xl filter saturate-75 block mb-4 group-hover:scale-110 transition-transform duration-200">{cat.emoji}</span>
              <h4 className="text-base font-black uppercase tracking-tight text-[#fcfaf2]">{cat.title}</h4>
              <p className="text-[11px] text-[#fcfaf2]/60 mt-2 leading-relaxed">{cat.text}</p>
              
              <div className="mt-4 flex items-center justify-between border-t border-[#fcfaf2]/10 pt-3 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                <span className="text-[#ff5d22]">{cat.highlight}</span>
                <span>Explorar →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ==========================================
          5. JOYAS OCULTAS & DOCUMENTARY FEED
          ========================================== */}
      <section className="mx-auto max-w-7xl px-6 py-20 border-t border-[#fcfaf2]/10 bg-[#0a0a0c]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Joyas Ocultas */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#39ff14]">🕵️ Joyas Ocultas</span>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">Locales Sin Nombre</h3>
            <p className="text-xs text-[#faf6ee]/60 leading-relaxed max-w-sm">
              Estos puestos no tienen marca, pero tienen colas de 20 personas todos los días. Lugares que solo abren en horarios específicos y se llenan al instante.
            </p>

            <div className="space-y-4 pt-4">
              {[
                { title: "El Callejón de las Empanadas", locate: "Cerca de Catedral Metropolitana", desc: "Abren solo de 3 PM a 5:30 PM. Las empanadas de leche son gigantes.", star: "4.8" },
                { title: "Licuados Gigantes Metro", locate: "Frente a salida de Metrocentro", desc: "Refrescos en bolsa gigantescos. El de horchata es legendario.", star: "4.7" }
              ].map((joya, idx) => (
                <div key={idx} className="p-5 rounded-sm border border-[#fcfaf2]/10 bg-[#121215]/80 hover:border-[#ff5d22]/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-center">
                    <h5 className="font-extrabold text-xs uppercase text-[#ff5d22] tracking-wider">{joya.title}</h5>
                    <span className="text-[10px] text-amber-500 font-bold">⭐ {joya.star}</span>
                  </div>
                  <p className="text-[9px] text-[#fcfaf2]/40 font-mono mt-1">{joya.locate}</p>
                  <p className="text-[11px] text-[#fcfaf2]/70 mt-2">{joya.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Documentary User Feed (Street Comments) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-sm border-2 border-[#fcfaf2]/10 bg-[#0c1220]/40 space-y-6">
            <h4 className="font-black text-sm uppercase tracking-wider flex items-center gap-2 border-b border-[#fcfaf2]/10 pb-4">
              <span className="h-2 w-2 rounded-full bg-[#ff5d22]" />
              Reseñas Reales y Sin Filtros
            </h4>

            <div className="space-y-6">
              {[
                { user: "@curtido_lover", text: "Doña Julia le echa chicharrón molido de verdad a las pupusas, nada de pastas raras de supermercado. Salís lleno con $2.00.", place: "Pupusería Doña Julia", time: "hace 4 min" },
                { user: "@almuerzos_ss", text: "El pescado frito del Comedor Familiar viene bien sazonado y con aguacate fresco. Se llena a las 12 en punto, mejor llegar a las 11:30.", place: "Comedor Familiar Vista Hermosa", time: "hace 18 min" },
                { user: "@gourmet_callejero", text: "El atol de elote de la Tía Niña tiene el espesor exacto y te lo sirven con granos enteros. Es el verdadero sabor de las tardes.", place: "Antojitos Tía Niña", time: "hace 32 min" }
              ].map((rev, i) => (
                <div key={i} className="space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-[#39ff14]">{rev.user}</span>
                    <span className="text-[10px] text-[#faf6ee]/30">{rev.time}</span>
                  </div>
                  <p className="text-[#fcfaf2]/80 italic">
                    &quot;{rev.text}&quot;
                  </p>
                  <div className="text-[9px] font-black uppercase text-[#ff5d22]">
                    📍 Reseña de: {rev.place}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==========================================
          6. THE HIGH-FIDELITY PREMIUM LOGIN MODAL
          ========================================== */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md p-8 rounded-sm border-2 border-[#ff5d22] bg-[#0c0c0e] shadow-2xl text-[#fcfaf2] tracking-tight">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-[#fcfaf2]/60 hover:text-white text-lg transition-all"
            >
              ✕
            </button>

            {/* Modal Brand */}
            <div className="text-center mb-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded bg-[#ff5d22] text-black text-xl font-black rotate-[-4deg] mb-3">
                SS
              </span>
              <h3 className="text-lg font-black uppercase tracking-tight">Ingreso de Colaborador</h3>
              <p className="text-[11px] text-[#fcfaf2]/60 mt-1">Conéctate para reportar joyas de comida oculta</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@foodie.com"
                  className="w-full rounded-sm border border-[#fcfaf2]/20 bg-[#121215] px-4.5 py-3.5 text-xs text-[#fcfaf2] outline-none focus:border-[#ff5d22] transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-[#fcfaf2]/20 bg-[#121215] px-4.5 py-3.5 text-xs text-[#fcfaf2] outline-none focus:border-[#ff5d22] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 rounded-sm bg-[#ff5d22] hover:bg-[#e85d04] text-black font-black uppercase text-xs py-4 border-2 border-black transition-all shadow-md shadow-[#ff5d22]/20 active:scale-95"
              >
                Iniciar Sesión e Ingresar
              </button>
            </form>

            <div className="text-center mt-6 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              ¿Eres nuevo? <span className="text-[#ff5d22] cursor-pointer hover:underline" onClick={() => window.location.href = "/dashboard"}>Registrarse en la comunidad</span>
            </div>

          </div>
        </div>
      )}

      {/* ==========================================
          7. FOOTER
          ========================================== */}
      <footer className="border-t border-[#fcfaf2]/10 bg-[#060608] py-12 text-[#faf6ee]/40 text-xs">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-[#fcfaf2]/20 text-[#fcfaf2] text-sm font-bold rotate-[-3deg]">
              SS
            </span>
            <p className="font-extrabold uppercase text-[11px] tracking-wider">COMEDORES SS © 2026. SAN SALVADOR.</p>
          </div>
          <div className="flex gap-4.5 font-bold uppercase tracking-wider text-[10px]">
            <span className="hover:text-white cursor-pointer">Términos</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Privacidad</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer text-[#ff5d22]" onClick={handleLoginSubmit}>Mapa Completo</span>
          </div>
        </div>
      </footer>

    </main>
  );
}
