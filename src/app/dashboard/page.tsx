"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MapView from "@/components/Map/MapView";
import { supabase } from "@/lib/supabase";
import type { Puesto, Categoria, FiltrosMapa } from "@/types";

// ==========================================
// FALLBACK SPECIFIED DATA (Premium Seed Data)
// ==========================================
const MOCK_PUESTOS: Puesto[] = [
  {
    id: "puesto-1",
    nombre: "Pupusería El Triángulo",
    descripcion: "Las pupusas más famosas del centro de San Salvador. De maíz y de arroz, súper rellenas con queso chicloso y chicharrón molido.",
    categoria: "pupusas",
    lat: 13.6929,
    lng: -89.2182,
    direccion: "4a Calle Oriente y 8a Avenida Sur",
    municipio: "San Salvador",
    departamento: "San Salvador",
    precio_min: 0.85,
    precio_max: 1.50,
    hora_apertura: "16:00",
    hora_cierre: "22:00",
    dias_abierto: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    nivel_higiene: 96,
    nivel_seguridad: 92,
    concurrencia_actual: 75,
    verificado: true,
    activo: true,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  },
  {
    id: "puesto-2",
    nombre: "Desayunos Doña Cleo",
    descripcion: "Desayunos típicos con frijolitos refritos, plátano maduro, huevo picado con tomate, crema y queso fresco. Tortilla recién hecha.",
    categoria: "desayunos",
    lat: 13.6895,
    lng: -89.2230,
    direccion: "Avenida España, frente a Catedral Metropolitana",
    municipio: "San Salvador",
    departamento: "San Salvador",
    precio_min: 1.75,
    precio_max: 3.00,
    hora_apertura: "06:00",
    hora_cierre: "11:00",
    dias_abierto: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    nivel_higiene: 88,
    nivel_seguridad: 85,
    concurrencia_actual: 90,
    verificado: true,
    activo: true,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  },
  {
    id: "puesto-3",
    nombre: "Comedor Familiar Vista Hermosa",
    descripcion: "Almuerzos ejecutivos caseros de pollo guisado, carne asada y pescado frito con arroz, ensalada fresca y refresco natural incluido.",
    categoria: "comedores",
    lat: 13.7012,
    lng: -89.2110,
    direccion: "1a Calle Poniente y 23a Avenida Norte",
    municipio: "San Salvador",
    departamento: "San Salvador",
    precio_min: 2.50,
    precio_max: 4.00,
    hora_apertura: "11:30",
    hora_cierre: "15:00",
    dias_abierto: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
    nivel_higiene: 92,
    nivel_seguridad: 88,
    concurrencia_actual: 35,
    verificado: true,
    activo: true,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  },
  {
    id: "puesto-4",
    nombre: "Antojitos Tía Niña",
    descripcion: "El rincón perfecto para las tardes: atol de elote calientito, elotes locos bien cargados de salsa, pastelitos de carne y empanadas.",
    categoria: "antojitos",
    lat: 13.6950,
    lng: -89.2255,
    direccion: "Calle Arce, cerca de Universidad Tecnológica",
    municipio: "San Salvador",
    departamento: "San Salvador",
    precio_min: 0.50,
    precio_max: 2.00,
    hora_apertura: "14:00",
    hora_cierre: "19:00",
    dias_abierto: ["Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    nivel_higiene: 85,
    nivel_seguridad: 90,
    concurrencia_actual: 60,
    verificado: true,
    activo: true,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  },
  {
    id: "puesto-5",
    nombre: "Mariscos El Malecón Callejero",
    descripcion: "Cocteles de conchas súper frescos, ceviche de camarón marinado al instante con limón y cebolla morada. Picante al gusto.",
    categoria: "mariscos",
    lat: 13.6820,
    lng: -89.2150,
    direccion: "Bulevar Venezuela, frente a Terminal de Occidente",
    municipio: "San Salvador",
    departamento: "San Salvador",
    precio_min: 3.50,
    precio_max: 6.00,
    hora_apertura: "09:00",
    hora_cierre: "17:00",
    dias_abierto: ["Jueves", "Viernes", "Sábado", "Domingo"],
    nivel_higiene: 90,
    nivel_seguridad: 82,
    concurrencia_actual: 45,
    verificado: false,
    activo: true,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  },
  {
    id: "puesto-6",
    nombre: "Licuados y Frutas Metro",
    descripcion: "Bolsas de fruta fresca (mango, sandía, piña y melón) con chile, limón y alguashte. Licuados de leche frescos.",
    categoria: "fruta",
    lat: 13.7050,
    lng: -89.2300,
    direccion: "Cerca de Metrocentro San Salvador",
    municipio: "San Salvador",
    departamento: "San Salvador",
    precio_min: 1.00,
    precio_max: 2.00,
    hora_apertura: "08:00",
    hora_cierre: "18:00",
    dias_abierto: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
    nivel_higiene: 94,
    nivel_seguridad: 94,
    concurrencia_actual: 20,
    verificado: true,
    activo: true,
    creado_en: new Date().toISOString(),
    actualizado_en: new Date().toISOString()
  }
];

// Helper formula to compute distance in meters using Haversine
function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export default function DashboardPage() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<"inicio" | "mapa" | "rankings" | "agregar" | "guardados" | "actividad">("inicio");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
  // Data state
  const [puestos, setPuestos] = useState<Puesto[]>(MOCK_PUESTOS);
  const [loading, setLoading] = useState(true);
  
  // Geolocated User coords
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [geoPermissionStatus, setGeoPermissionStatus] = useState<"default" | "prompt" | "granted" | "denied">("default");
  
  // Selection and filters
  const [selectedPuestoId, setSelectedPuestoId] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosMapa>({
    precioMax: undefined,
    categorias: [],
    soloAbiertos: false
  });

  // Saved items IDs (local storage backed)
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Stepper state for Adding a local
  const [stepperStep, setStepperStep] = useState(4); // Default to Step 4 "Subida de Fotos" as requested
  const [formNombre, setFormNombre] = useState("");
  const [formCategoria, setFormCategoria] = useState<Categoria>("pupusas");
  const [formPrecioMin, setFormPrecioMin] = useState(1.00);
  const [formPrecioMax, setFormPrecioMax] = useState(3.00);
  const [formHigiene, setFormHigiene] = useState(80);
  const [formSeguridad, setFormSeguridad] = useState(75);
  const [formUploadedPhotos, setFormUploadedPhotos] = useState<string[]>([]);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Initialize data and localStorage favorites
  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("puestos")
          .select("*")
          .eq("activo", true);
          
        if (data && data.length > 0) {
          setPuestos(data as Puesto[]);
        }
      } catch (err) {
        console.error("Supabase load error, using high quality local seed data.", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Check localStorage for saved favorites
    const saved = localStorage.getItem("comedores_favs");
    if (saved) {
      setSavedIds(JSON.parse(saved));
    }
  }, []);

  // Request browser Geolocation
  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está soportada por tu navegador");
      return;
    }
    
    setGeoPermissionStatus("prompt");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGeoPermissionStatus("granted");
      },
      (error) => {
        console.warn("Geolocation error: ", error);
        setGeoPermissionStatus("denied");
        // Center default at San Salvador center as backup
        setUserCoords({ lat: 13.6929, lng: -89.2182 });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Toggle favorite helper
  const toggleSavePuesto = (id: string) => {
    const nextSaved = savedIds.includes(id)
      ? savedIds.filter((item) => item !== id)
      : [...savedIds, id];
    setSavedIds(nextSaved);
    localStorage.setItem("comedores_favs", JSON.stringify(nextSaved));
  };

  // Stepper navigation helpers
  const handleNextStep = () => {
    if (stepperStep < 5) {
      setStepperStep(stepperStep + 1);
    } else {
      // Step 5 is Submit!
      const newId = `puesto-contrib-${Date.now()}`;
      const newLocal: Puesto = {
        id: newId,
        nombre: formNombre || "Pupusería El Atolito Contribuido",
        descripcion: "Local agregado por la comunidad a través de la plataforma SS. Deliciosas recetas tradicionales.",
        categoria: formCategoria,
        lat: userCoords?.lat ?? 13.6910,
        lng: userCoords?.lng ?? -89.2210,
        direccion: "Dirección ingresada por el usuario",
        municipio: "San Salvador",
        departamento: "San Salvador",
        precio_min: formPrecioMin,
        precio_max: formPrecioMax,
        hora_apertura: "15:00",
        hora_cierre: "21:00",
        dias_abierto: ["Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
        nivel_higiene: formHigiene,
        nivel_seguridad: formSeguridad,
        concurrencia_actual: 30,
        verificado: false,
        activo: true,
        creado_en: new Date().toISOString(),
        actualizado_en: new Date().toISOString()
      };
      
      setPuestos([newLocal, ...puestos]);
      setIsSuccessModalOpen(true);
    }
  };

  const handlePrevStep = () => {
    if (stepperStep > 1) {
      setStepperStep(stepperStep - 1);
    }
  };

  // Category Icon helper
  const getCategoryEmoji = (cat: Categoria) => {
    switch (cat) {
      case "pupusas": return "🥟";
      case "desayunos": return "🍳";
      case "comedores": return "🍛";
      case "antojitos": return "🌽";
      case "fruta": return "🍉";
      case "bebidas": return "🥤";
      case "mariscos": return "🐟";
      default: return "🌮";
    }
  };

  const getCategoryColorText = (cat: Categoria) => {
    switch (cat) {
      case "pupusas": return "text-blue-500 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40";
      case "desayunos": return "text-amber-500 dark:text-amber-400 bg-amber-100/50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/40";
      case "comedores": return "text-emerald-500 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40";
      case "antojitos": return "text-pink-500 dark:text-pink-400 bg-pink-100/50 dark:bg-pink-950/40 border border-pink-200/50 dark:border-pink-800/40";
      case "fruta": return "text-lime-500 dark:text-lime-400 bg-lime-100/50 dark:bg-lime-950/40 border border-lime-200/50 dark:border-lime-800/40";
      case "bebidas": return "text-cyan-500 dark:text-cyan-400 bg-cyan-100/50 dark:bg-cyan-950/40 border border-cyan-200/50 dark:border-cyan-800/40";
      case "mariscos": return "text-indigo-500 dark:text-indigo-400 bg-indigo-100/50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/40";
      default: return "text-purple-500 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40";
    }
  };

  // Sort and filter places
  const processedPuestos = puestos
    .filter((p) => {
      if (filtros.precioMax && p.precio_min && p.precio_min > filtros.precioMax) return false;
      if (filtros.categorias && filtros.categorias.length > 0 && !filtros.categorias.includes(p.categoria)) return false;
      return true;
    })
    .map((p) => {
      const distance = userCoords 
        ? getDistanceMeters(userCoords.lat, userCoords.lng, p.lat, p.lng)
        : null;
      return { ...p, distance };
    });

  // If geolocation active, sort by nearest
  const sortedPuestos = [...processedPuestos].sort((a, b) => {
    if (a.distance !== null && b.distance !== null) {
      return a.distance - b.distance;
    }
    return 0; // Keep default sorting if no user coords
  });

  return (
    <div className={`min-h-screen font-sans ${theme === "dark" ? "dark bg-[#070b13] text-slate-100" : "bg-[#f8fafc] text-slate-900"} transition-colors duration-300`}>
      
      {/* SUCCESS POPUP MODAL FOR ADDING LOCAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-md p-8 rounded-3xl border shadow-2xl ${theme === "dark" ? "bg-[#111827] border-slate-800" : "bg-white border-slate-100"} text-center`}>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-3xl animate-bounce">
              🎉
            </div>
            <h3 className="text-2xl font-bold">¡Aporte Recibido!</h3>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Muchísimas gracias por contribuir a <b>Comedores SS</b>. Tu local se ha agregado temporalmente y ha sido enviado para verificación comunitaria por otros comedores.
            </p>
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                setFormNombre("");
                setStepperStep(1);
                setActiveTab("inicio");
              }}
              className="mt-6 w-full rounded-2xl bg-blue-600 hover:bg-blue-500 py-3 text-sm font-semibold text-white transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              Ir al Inicio
            </button>
          </div>
        </div>
      )}

      {/* DISSOLVED DECORATIVE GLOW BACKGROUNDS IN PREMIUM DARK MODE */}
      {theme === "dark" && (
        <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-900/10 blur-[120px] pointer-events-none" />
      )}

      <div className="flex min-h-screen">
        
        {/* ==========================================
            LEFT SIDEBAR (Estilo Glassmorphism Premium)
            ========================================== */}
        <aside className={`w-64 fixed inset-y-0 left-0 z-30 flex flex-col border-r transition-all duration-300 ${
          theme === "dark" 
            ? "bg-[#0c1220]/90 border-slate-900/80 backdrop-blur-xl" 
            : "bg-white/90 border-slate-100 backdrop-blur-xl"
        }`}>
          {/* LOGO */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-100 dark:border-slate-900/80">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-lg font-bold text-white shadow-lg shadow-blue-500/20">
                SS
              </span>
              <div>
                <h1 className="text-md font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-400 bg-clip-text text-transparent">
                  Comedores SS
                </h1>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Guía Callejera Premium</p>
              </div>
            </Link>
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" title="Servicio Activo" />
          </div>

          {/* MAIN NAV LIST */}
          <nav className="flex-1 space-y-1.5 px-4 py-6">
            <button
              onClick={() => { setActiveTab("inicio"); setSelectedPuestoId(null); }}
              className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
                activeTab === "inicio"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-900/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              Inicio
            </button>

            <button
              onClick={() => { setActiveTab("mapa"); }}
              className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
                activeTab === "mapa"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-900/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Mapa Completo
            </button>

            <button
              onClick={() => { setActiveTab("rankings"); }}
              className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
                activeTab === "rankings"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-900/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Rankings
            </button>

            <button
              onClick={() => { setActiveTab("agregar"); }}
              className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
                activeTab === "agregar"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-900/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Agregar Local
            </button>

            <button
              onClick={() => { setActiveTab("guardados"); }}
              className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
                activeTab === "guardados"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-900/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Guardados
              {savedIds.length > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                  {savedIds.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab("actividad"); }}
              className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all ${
                activeTab === "actividad"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-900/60"
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Actividad
            </button>
          </nav>

          {/* BOTTOM PROFILE & THEME TOGGLE */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-900/80 space-y-4">
            
            {/* THEME TOGGLE (Vibrante / Premium) */}
            <div className={`flex items-center justify-between p-2.5 rounded-2xl border ${
              theme === "dark" ? "bg-slate-900/50 border-slate-800" : "bg-slate-100/80 border-slate-200"
            }`}>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tema Oscuro</span>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={`relative inline-flex h-6.5 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  theme === "dark" ? "bg-blue-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    theme === "dark" ? "translate-x-4.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* PROFILE ROW */}
            <div className="flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg">
                F
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">Foodie_Salvador</p>
                <span className="text-[10px] text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wider">Colaborador Oro</span>
              </div>
            </div>
          </div>
        </aside>

        {/* ==========================================
            RIGHT CONTAINER (Main content + Navbar)
            ========================================== */}
        <div className="flex-1 min-h-screen pl-64 flex flex-col">
          
          {/* HEADER / NAVBAR */}
          <header className={`sticky top-0 z-20 flex h-20 items-center justify-between px-8 border-b ${
            theme === "dark" 
              ? "bg-[#070b13]/80 border-slate-900/80 backdrop-blur-md" 
              : "bg-[#f8fafc]/80 border-slate-100 backdrop-blur-md"
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Plataforma</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <h2 className="text-lg font-bold capitalize">
                {activeTab === "inicio" ? "Inicio Dashboard" : activeTab === "mapa" ? "Mapa Georeferenciado" : activeTab}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              
              {/* GEOLOCATION NOTIFIER */}
              {userCoords ? (
                <div className="flex items-center gap-2 rounded-full bg-emerald-100/80 dark:bg-emerald-950/30 px-3 py-1.5 border border-emerald-200/50 dark:border-emerald-900/40 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Ubicación Activa
                </div>
              ) : (
                <button
                  onClick={requestLocation}
                  className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 px-3.5 py-1.5 border border-slate-200/50 dark:border-slate-800/50 text-xs font-medium text-slate-600 dark:text-slate-300 transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  Activar GPS
                </button>
              )}

              {/* QUICK ACTION BUTTON */}
              <button
                onClick={() => { setActiveTab("agregar"); setStepperStep(1); }}
                className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 px-4.5 py-2.5 text-xs font-semibold text-white transition-all shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 active:scale-95"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Solicitar Agregar Local
              </button>
            </div>
          </header>

          {/* MAIN TABBED VIEWS CONTROLLER */}
          <main className="flex-1 p-8">

            {/* ==========================================
                VIEW 1: INICIO (Dashboard Principal)
                ========================================== */}
            {activeTab === "inicio" && (
              <div className="space-y-8 animate-fade-in">
                {/* Personalized Welcome Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-500/10">
                  <div className="relative z-10 max-w-xl">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white/90">
                      🌮 ¡Hola de nuevo, Foodie!
                    </span>
                    <h3 className="mt-4 text-3xl font-extrabold tracking-tight">
                      Descubre la mejor comida callejera de San Salvador
                    </h3>
                    <p className="mt-2 text-sm text-slate-100/90 font-medium">
                      Explora locales verificados con indicadores de confianza reales elaborados por la misma comunidad.
                    </p>
                    <button
                      onClick={() => setActiveTab("mapa")}
                      className="mt-6 rounded-2xl bg-white hover:bg-slate-50 px-5 py-3 text-xs font-bold text-blue-600 shadow-lg transition-all active:scale-95"
                    >
                      Abrir Mapa Completo
                    </button>
                  </div>
                  {/* Decorative mesh circle */}
                  <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial-gradient from-white/10 to-transparent opacity-30 rounded-full transform translate-x-12 translate-y-6" />
                </div>

                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Locales Activos",
                      value: puestos.length,
                      change: "+4 agregados hoy",
                      color: "text-blue-500",
                      emoji: "🏪",
                    },
                    {
                      label: "Nivel de Colaborador",
                      value: "Oro",
                      change: "78% al siguiente nivel",
                      color: "text-emerald-500",
                      emoji: "⭐",
                      progress: 78
                    },
                    {
                      label: "Precio Callejero Medio",
                      value: "$1.40",
                      change: "Ahorra $4.50 vs Centro Comercial",
                      color: "text-amber-500",
                      emoji: "💸"
                    },
                    {
                      label: "Reportes Activos",
                      value: 142,
                      change: "+15 reportados esta semana",
                      color: "text-pink-500",
                      emoji: "🛡️"
                    }
                  ].map((stat, i) => (
                    <div key={i} className={`p-6 rounded-2xl border transition-all hover:scale-[1.02] cursor-pointer ${
                      theme === "dark" 
                        ? "bg-[#111827] border-slate-900 hover:border-slate-800/80 shadow-md" 
                        : "bg-white border-slate-100 shadow-sm hover:shadow-md"
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                        <span className="text-lg">{stat.emoji}</span>
                      </div>
                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                      </div>
                      
                      {stat.progress ? (
                        <div className="mt-3.5">
                          <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${stat.progress}%` }} />
                          </div>
                          <span className="mt-2 block text-[10px] font-medium text-slate-400">{stat.change}</span>
                        </div>
                      ) : (
                        <p className="mt-2.5 text-[11px] font-medium text-slate-400">{stat.change}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Recommendations + Mini Map split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Recommendations (Col-Span 2) */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-bold tracking-tight">Recomendaciones Rápidas</h4>
                      <button 
                        onClick={() => setActiveTab("rankings")}
                        className="text-xs font-bold text-blue-500 hover:text-blue-600"
                      >
                        Ver todos los rankings
                      </button>
                    </div>

                    <div className="space-y-4">
                      {puestos.slice(0, 3).map((puesto) => (
                        <div key={puesto.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4.5 rounded-2xl border transition-all hover:scale-[1.01] ${
                          theme === "dark" 
                            ? "bg-[#111827] border-slate-900 hover:border-slate-800/80" 
                            : "bg-white border-slate-100 shadow-sm"
                        }`}>
                          <div className="flex items-center gap-4.5">
                            {/* Colorful cover representation */}
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold border ${getCategoryColorText(puesto.categoria)}`}>
                              {getCategoryEmoji(puesto.categoria)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-sm tracking-tight">{puesto.nombre}</h5>
                                {puesto.verificado && (
                                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950 text-[10px] font-bold text-blue-600 dark:text-blue-400" title="Verificado por Administradores">
                                    ✓
                                  </span>
                                )}
                              </div>
                              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{puesto.descripcion || puesto.direccion}</p>
                              
                              <div className="mt-2 flex items-center gap-3 text-[11px] font-bold text-slate-400">
                                <span>Rango: ${puesto.precio_min?.toFixed(2)} - ${puesto.precio_max?.toFixed(2)}</span>
                                <span>•</span>
                                <span className="text-amber-500">⭐ {puesto.nivel_higiene ? (puesto.nivel_higiene / 20).toFixed(1) : "4.5"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 sm:mt-0 flex items-center gap-3.5 w-full sm:w-auto justify-end">
                            <span className={`rounded-xl px-3 py-1 text-[10px] font-extrabold uppercase border ${
                              puesto.activo 
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            }`}>
                              {puesto.activo ? "Abierto" : "Cerrado"}
                            </span>
                            <button
                              onClick={() => {
                                setSelectedPuestoId(puesto.id);
                                setActiveTab("mapa");
                              }}
                              className="rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10"
                            >
                              Ver en Mapa
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Compact Quick Map */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-bold tracking-tight">Mapa Rápido</h4>
                      <button
                        onClick={requestLocation}
                        className="text-xs font-bold text-blue-500 hover:text-blue-600"
                      >
                        Centrar GPS
                      </button>
                    </div>

                    <div className="h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-md">
                      <MapView
                        puestos={puestos}
                        filtros={filtros}
                        userCoords={userCoords}
                        selectedPuestoId={selectedPuestoId}
                        onSelectPuesto={(p) => {
                          setSelectedPuestoId(p.id);
                          setActiveTab("mapa");
                        }}
                      />
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ==========================================
                VIEW 2: MAPA COMPLETO (Panel de Filtros y GPS)
                ========================================== */}
            {activeTab === "mapa" && (
              <div className="flex flex-col h-[calc(100vh-14rem)] space-y-4 animate-fade-in">
                
                {/* Filter Pills at the Top */}
                <div className={`p-4 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  theme === "dark" ? "bg-[#111827]/70 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  {/* Category Filter Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setFiltros({ ...filtros, categorias: [] })}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        !filtros.categorias || filtros.categorias.length === 0
                          ? "bg-blue-600 text-white border-blue-600"
                          : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60"
                      }`}
                    >
                      Todos
                    </button>
                    {(["pupusas", "desayunos", "comedores", "antojitos", "mariscos"] as Categoria[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          const cats = filtros.categorias?.includes(cat)
                            ? filtros.categorias.filter((c) => c !== cat)
                            : [...(filtros.categorias || []), cat];
                          setFiltros({ ...filtros, categorias: cats });
                        }}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                          filtros.categorias?.includes(cat)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60"
                        }`}
                      >
                        <span>{getCategoryEmoji(cat)}</span>
                        <span className="capitalize">{cat}</span>
                      </button>
                    ))}
                  </div>

                  {/* Switch button for Abiertos */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Solo Abiertos</span>
                      <button
                        onClick={() => setFiltros({ ...filtros, soloAbiertos: !filtros.soloAbiertos })}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          filtros.soloAbiertos ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-800"
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            filtros.soloAbiertos ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Geolocation trigger */}
                    <button
                      onClick={requestLocation}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 transition-all shadow-md shadow-blue-500/10"
                    >
                      📍 Obtener Mi Ubicación
                    </button>
                  </div>
                </div>

                {/* Map + Sidebar results (Horizontal Split) */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                  
                  {/* Map Column (Col-Span 2) */}
                  <div className="lg:col-span-2 rounded-3xl overflow-hidden relative shadow-lg">
                    <MapView
                      puestos={puestos}
                      filtros={filtros}
                      userCoords={userCoords}
                      selectedPuestoId={selectedPuestoId}
                      onSelectPuesto={(puesto) => setSelectedPuestoId(puesto.id)}
                    />
                  </div>

                  {/* Sidebar Results Column (Col-Span 1) */}
                  <div className={`rounded-3xl border flex flex-col overflow-hidden ${
                    theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <div className="p-5 border-b border-slate-100 dark:border-slate-900">
                      <h4 className="font-bold text-sm tracking-tight">Locales Cercanos</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {userCoords 
                          ? "Ordenados automáticamente por cercanía GPS" 
                          : "Activa tu ubicación para medir distancias exactas"}
                      </p>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {sortedPuestos.map((puesto) => (
                        <div
                          key={puesto.id}
                          onClick={() => setSelectedPuestoId(puesto.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] ${
                            selectedPuestoId === puesto.id
                              ? "border-blue-500 bg-blue-500/5 dark:bg-blue-500/10"
                              : theme === "dark" 
                                ? "bg-[#111827] border-slate-900 hover:border-slate-800" 
                                : "bg-white border-slate-100 shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md ${getCategoryColorText(puesto.categoria)}`}>
                                {puesto.categoria}
                              </span>
                              <h5 className="font-bold text-sm mt-2 tracking-tight">{puesto.nombre}</h5>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{puesto.direccion}</p>
                            </div>
                            <span className="text-sm font-bold text-blue-500">
                              {getCategoryEmoji(puesto.categoria)}
                            </span>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-900/60 pt-3 text-[10px] font-semibold text-slate-400">
                            <span className="text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg">
                              {puesto.distance !== null && puesto.distance !== undefined
                                ? `A ${puesto.distance >= 1000 ? `${(puesto.distance / 1000).toFixed(1)} km` : `${puesto.distance} m`}`
                                : "Distancia no medida"}
                            </span>
                            <span className={puesto.activo ? "text-emerald-500" : "text-rose-500"}>
                              {puesto.activo ? "● Abierto ahora" : "● Cerrado"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ==========================================
                VIEW 3: RANKINGS (Mejores, Más Baratos, etc.)
                ========================================== */}
            {activeTab === "rankings" && (
              <div className="space-y-8 animate-fade-in">
                {/* Ranking Main Tabs */}
                <div className={`p-2 rounded-2xl border flex gap-2 ${
                  theme === "dark" ? "bg-[#111827]/70 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  {[
                    { id: "calidad", label: "Mejor Calificados", emoji: "🏆" },
                    { id: "baratos", label: "Más Baratos", emoji: "💸" },
                    { id: "visitados", label: "Más Visitados", emoji: "🔥" },
                    { id: "trending", label: "Trending", emoji: "⚡" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    >
                      <span>{tab.emoji}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* 2 Main Columns Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Category A: Top Comida Tradicional (Pupusas y Antojitos) */}
                  <div className={`p-6 rounded-3xl border ${
                    theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-extrabold text-sm tracking-tight uppercase text-blue-500">🏆 Top Comida Tradicional</h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">Filtro Activo</span>
                    </div>

                    <div className="space-y-4">
                      {puestos
                        .filter((p) => p.categoria === "pupusas" || p.categoria === "antojitos")
                        .slice(0, 3)
                        .map((puesto, i) => (
                          <div key={puesto.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800/60">
                            <div className="flex items-center gap-4">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                                i === 0 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                                i === 1 ? "bg-slate-400/20 text-slate-400 border border-slate-400/30" :
                                "bg-amber-700/20 text-amber-700 border border-amber-700/30"
                              }`}>
                                #{i + 1}
                              </span>
                              <div>
                                <h5 className="font-bold text-xs tracking-tight">{puesto.nombre}</h5>
                                <span className="text-[10px] font-semibold text-slate-400">{getCategoryEmoji(puesto.categoria)} {puesto.categoria}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="block text-xs font-black text-amber-500">⭐ {puesto.nivel_higiene ? (puesto.nivel_higiene / 20).toFixed(1) : "4.9"}</span>
                              <span className="text-[10px] text-slate-400 font-bold">Desde ${puesto.precio_min?.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Category B: Top Almuerzos y Desayunos (Comedores y Desayunos) */}
                  <div className={`p-6 rounded-3xl border ${
                    theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-extrabold text-sm tracking-tight uppercase text-emerald-500">🍛 Top Almuerzos y Caseros</h4>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg">Filtro Activo</span>
                    </div>

                    <div className="space-y-4">
                      {puestos
                        .filter((p) => p.categoria === "comedores" || p.categoria === "desayunos")
                        .slice(0, 3)
                        .map((puesto, i) => (
                          <div key={puesto.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800/60">
                            <div className="flex items-center gap-4">
                              <span className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-black ${
                                i === 0 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                                i === 1 ? "bg-slate-400/20 text-slate-400 border border-slate-400/30" :
                                "bg-amber-700/20 text-amber-700 border border-amber-700/30"
                              }`}>
                                #{i + 1}
                              </span>
                              <div>
                                <h5 className="font-bold text-xs tracking-tight">{puesto.nombre}</h5>
                                <span className="text-[10px] font-semibold text-slate-400">{getCategoryEmoji(puesto.categoria)} {puesto.categoria}</span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="block text-xs font-black text-amber-500">⭐ {puesto.nivel_higiene ? (puesto.nivel_higiene / 20).toFixed(1) : "4.8"}</span>
                              <span className="text-[10px] text-slate-400 font-bold">Desde ${puesto.precio_min?.toFixed(2)}</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                </div>

                {/* Trending of the week */}
                <div className={`p-6 rounded-3xl border ${
                  theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <h4 className="font-bold text-sm tracking-tight mb-4">Trending esta Semana</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { text: "#PupusaLoca", hits: "4.2k visitas" },
                      { text: "#DesayunoTipico", hits: "2.8k visitas" },
                      { text: "#PreciosBajos", hits: "1.9k visitas" },
                      { text: "#HigieneGarantizada", hits: "3.5k consultas" },
                      { text: "#MariscosFresc", hits: "1.2k consultas" }
                    ].map((chip, i) => (
                      <span key={i} className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/5 dark:hover:bg-blue-500/10 cursor-pointer transition-all">
                        <span>{chip.text}</span>
                        <span className="text-[9px] font-medium text-slate-400">({chip.hits})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                VIEW 4: AGREGAR (Asistente Stepper de 5 pasos)
                ========================================== */}
            {activeTab === "agregar" && (
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
                
                {/* Stepper Progress Bar (Top) */}
                <div className={`p-6 rounded-3xl border ${
                  theme === "dark" ? "bg-[#111827]/70 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  {/* Step Circles */}
                  <div className="flex items-center justify-between relative">
                    {/* Background Progress Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 dark:bg-slate-800 transform -translate-y-1/2 -z-10" />
                    {/* Active Progress Line */}
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-blue-600 transform -translate-y-1/2 -z-10 transition-all duration-300"
                      style={{ width: `${((stepperStep - 1) / 4) * 100}%` }}
                    />

                    {[1, 2, 3, 4, 5].map((step) => (
                      <div key={step} className="flex flex-col items-center">
                        <button
                          onClick={() => setStepperStep(step)}
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold border-2 transition-all ${
                            step < stepperStep
                              ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                              : step === stepperStep
                                ? "bg-white dark:bg-[#070b13] border-blue-600 text-blue-600 scale-110 font-black shadow-md shadow-blue-500/20"
                                : "bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-400"
                          }`}
                        >
                          {step < stepperStep ? "✓" : step}
                        </button>
                        <span className={`text-[10px] font-bold mt-2 hidden sm:inline ${
                          step === stepperStep ? "text-blue-500 font-extrabold" : "text-slate-400"
                        }`}>
                          {step === 1 ? "Básicos" : step === 2 ? "GPS" : step === 3 ? "Precios" : step === 4 ? "Fotos" : "Confianza"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Wrapper */}
                <div className={`p-8 rounded-3xl border space-y-6 shadow-md ${
                  theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  
                  {/* Step 1: Info Básica */}
                  {stepperStep === 1 && (
                    <div className="space-y-4 animate-fade-in">
                      <h4 className="text-md font-bold tracking-tight">Paso 1: Información Básica del Local</h4>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Nombre del Local</label>
                        <input
                          type="text"
                          value={formNombre}
                          onChange={(e) => setFormNombre(e.target.value)}
                          placeholder="Ej. Pupusería Doña Julia"
                          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 px-4.5 py-3.5 text-sm outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Categoría de Comida</label>
                        <select
                          value={formCategoria}
                          onChange={(e) => setFormCategoria(e.target.value as Categoria)}
                          className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 px-4.5 py-3.5 text-sm outline-none focus:border-blue-500 transition-all dark:text-slate-100 dark:bg-[#111827]"
                        >
                          <option value="pupusas">🥟 Pupusas</option>
                          <option value="desayunos">🍳 Desayunos</option>
                          <option value="comedores">🍛 Comedores y Almuerzos</option>
                          <option value="antojitos">🌽 Antojitos de la Tarde</option>
                          <option value="fruta">🍉 Fruta y Ensaladas</option>
                          <option value="bebidas">🥤 Bebidas y Frescos</option>
                          <option value="mariscos">🐟 Mariscos y Cócteles</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Ubicación */}
                  {stepperStep === 2 && (
                    <div className="space-y-4 animate-fade-in">
                      <h4 className="text-md font-bold tracking-tight">Paso 2: Ubicación del Puesto</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        La ubicación exacta permite a los usuarios encontrarte mediante la geolocalización.
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Departamento</label>
                          <input
                            type="text"
                            defaultValue="San Salvador"
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 px-4.5 py-3.5 text-sm outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Municipio</label>
                          <input
                            type="text"
                            defaultValue="San Salvador Centro"
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 px-4.5 py-3.5 text-sm outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center cursor-pointer hover:bg-slate-500/5" onClick={requestLocation}>
                        <span className="text-2xl block mb-2">📍</span>
                        <h5 className="font-bold text-xs">Capturar ubicación GPS actual</h5>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {userCoords 
                            ? `Ubicación lista: [Lat: ${userCoords.lat.toFixed(4)}, Lng: ${userCoords.lng.toFixed(4)}]` 
                            : "Haz clic para autorizar y capturar las coordenadas de tu teléfono"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Menú y Precios */}
                  {stepperStep === 3 && (
                    <div className="space-y-4 animate-fade-in">
                      <h4 className="text-md font-bold tracking-tight">Paso 3: Rango de Precios e Información</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Precio Mínimo ($)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={formPrecioMin}
                            onChange={(e) => setFormPrecioMin(Number.parseFloat(e.target.value))}
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 px-4.5 py-3.5 text-sm outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Precio Máximo ($)</label>
                          <input
                            type="number"
                            step="0.05"
                            value={formPrecioMax}
                            onChange={(e) => setFormPrecioMax(Number.parseFloat(e.target.value))}
                            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 px-4.5 py-3.5 text-sm outline-none focus:border-blue-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Subida de Fotos (Highlighted/Active) */}
                  {stepperStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                        <h4 className="text-md font-bold tracking-tight">Paso 4: Subida de Fotos del Local</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Una imagen vale más que mil palabras. Sube fotos de la comida o del puesto.</p>
                      </div>

                      {/* Drag and drop visual zone */}
                      <div className="border-2 border-dashed border-blue-500/40 rounded-3xl p-10 text-center hover:bg-blue-500/5 hover:border-blue-500 transition-all cursor-pointer">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950 text-2xl text-blue-600 dark:text-blue-400 mb-4 animate-pulse">
                          📸
                        </div>
                        <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200">Arrastra tus fotos de comida aquí</h5>
                        <p className="text-[10px] text-slate-400 mt-1">o haz clic para examinar archivos en tu dispositivo</p>
                        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest block mt-3">Soporta PNG, JPG de hasta 5MB</span>
                      </div>

                      {/* Micro-preview placeholders */}
                      <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="h-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-500/5 flex items-center justify-center text-xs font-bold text-slate-400 border-dashed">
                            + Vacío
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 5: Indicadores de Confianza */}
                  {stepperStep === 5 && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="border-b border-slate-100 dark:border-slate-900 pb-3">
                        <h4 className="text-md font-bold tracking-tight">Paso 5: Indicadores de Confianza</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evalúa objetivamente las condiciones del puesto según tu visita.</p>
                      </div>

                      {/* Slider 1: Higiene */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <label className="text-slate-400 uppercase">Nivel de Higiene Estimado</label>
                          <span className={`${
                            formHigiene >= 85 ? "text-emerald-500" :
                            formHigiene >= 60 ? "text-amber-500" : "text-rose-500"
                          }`}>{formHigiene}% (Excelente)</span>
                        </div>
                        
                        {/* Progress Bar styled Slider */}
                        <div className="relative pt-1 flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formHigiene}
                            onChange={(e) => setFormHigiene(Number.parseInt(e.target.value))}
                            className="w-full cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none outline-none accent-blue-600"
                          />
                        </div>

                        {/* Interactive dynamic visual progress indicator bar */}
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              formHigiene >= 80 ? "bg-emerald-500" :
                              formHigiene >= 65 ? "bg-amber-500" : "bg-rose-500"
                            }`} 
                            style={{ width: `${formHigiene}%` }} 
                          />
                        </div>
                      </div>

                      {/* Slider 2: Seguridad */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <label className="text-slate-400 uppercase">Nivel de Seguridad de la Zona</label>
                          <span className={`${
                            formSeguridad >= 85 ? "text-emerald-500" :
                            formSeguridad >= 60 ? "text-amber-500" : "text-rose-500"
                          }`}>{formSeguridad}% (Seguro)</span>
                        </div>
                        
                        <div className="relative pt-1 flex items-center">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={formSeguridad}
                            onChange={(e) => setFormSeguridad(Number.parseInt(e.target.value))}
                            className="w-full cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none outline-none accent-blue-600"
                          />
                        </div>

                        {/* Interactive dynamic visual progress indicator bar */}
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              formSeguridad >= 80 ? "bg-emerald-500" :
                              formSeguridad >= 65 ? "bg-amber-500" : "bg-rose-500"
                            }`} 
                            style={{ width: `${formSeguridad}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stepper Footer Controls */}
                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-900/60 pt-6">
                    <button
                      onClick={handlePrevStep}
                      disabled={stepperStep === 1}
                      className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                        stepperStep === 1
                          ? "text-slate-300 dark:text-slate-700 border-slate-200 dark:border-slate-800 cursor-not-allowed"
                          : "text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60"
                      }`}
                    >
                      Atrás
                    </button>

                    <button
                      onClick={handleNextStep}
                      className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                      {stepperStep === 5 ? "Publicar Local" : "Siguiente"}
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* ==========================================
                VIEW 5: GUARDADOS (Favoritos del usuario)
                ========================================== */}
            {activeTab === "guardados" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-md font-bold tracking-tight">Tus Locales Guardados</h4>
                  <span className="text-xs text-slate-400 font-bold">{savedIds.length} locales guardados</span>
                </div>

                {savedIds.length === 0 ? (
                  <div className={`p-10 rounded-3xl border text-center ${
                    theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100"
                  }`}>
                    <span className="text-3xl block mb-2">❤️</span>
                    <h5 className="font-bold text-sm">Aún no has guardado comedores</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                      Agrega tus puestos favoritos a esta sección haciendo clic en el corazón de las tarjetas en el mapa o recomendaciones.
                    </p>
                    <button
                      onClick={() => setActiveTab("mapa")}
                      className="mt-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 transition-all shadow-md shadow-blue-500/10"
                    >
                      Explorar el Mapa
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {puestos
                      .filter((p) => savedIds.includes(p.id))
                      .map((puesto) => (
                        <div key={puesto.id} className={`p-5 rounded-3xl border flex flex-col relative overflow-hidden transition-all hover:scale-[1.01] ${
                          theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                        }`}>
                          <button
                            onClick={() => toggleSavePuesto(puesto.id)}
                            className="absolute top-4 right-4 text-rose-500 text-lg hover:scale-115 transition-all"
                            title="Eliminar de Guardados"
                          >
                            ❤️
                          </button>

                          <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md self-start ${getCategoryColorText(puesto.categoria)}`}>
                            {puesto.categoria}
                          </span>

                          <h5 className="font-bold text-sm tracking-tight mt-3">{puesto.nombre}</h5>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 flex-1">{puesto.descripcion || puesto.direccion}</p>
                          
                          <div className="mt-5 flex items-center justify-between border-t border-slate-100 dark:border-slate-900/60 pt-3">
                            <span className="text-[10px] font-bold text-slate-400">Rango: ${puesto.precio_min?.toFixed(2)} - ${puesto.precio_max?.toFixed(2)}</span>
                            <button
                              onClick={() => {
                                setSelectedPuestoId(puesto.id);
                                setActiveTab("mapa");
                              }}
                              className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-2 shadow-md shadow-blue-500/10"
                            >
                              Ver en Mapa
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* ==========================================
                VIEW 6: ACTIVIDAD DE LA COMUNIDAD (Social)
                ========================================== */}
            {activeTab === "actividad" && (
              <div className="space-y-8 animate-fade-in">
                
                {/* Community Metrics Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Reportes de Hoy", value: "+18 activos", desc: "Aperturas y cierres validados", color: "border-emerald-500/20 text-emerald-500" },
                    { label: "Cierres Reportados", value: "2 locales", desc: "Locales confirmados inactivos hoy", color: "border-rose-500/20 text-rose-500" },
                    { label: "Fotos Subidas Hoy", value: "35 imágenes", desc: "Actualización visual de platillos", color: "border-blue-500/20 text-blue-500" }
                  ].map((metric, i) => (
                    <div key={i} className={`p-6 rounded-3xl border ${
                      theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                    } ${metric.color}`}>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{metric.label}</span>
                      <h4 className="text-2xl font-black tracking-tight mt-2">{metric.value}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{metric.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Main Split Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left: Live Feed (Col-Span 2) */}
                  <div className={`lg:col-span-2 p-6 rounded-3xl border flex flex-col ${
                    theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <h4 className="font-bold text-sm tracking-tight mb-6 flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-blue-500 animate-ping" />
                      Feed de Actividad en Vivo
                    </h4>

                    {/* Timeline vertical list */}
                    <div className="relative border-l border-slate-200 dark:border-slate-800 pl-6 space-y-6">
                      {[
                        { user: "Juan C.", action: "confirmó abierto", target: "Pupusería El Triángulo", time: "hace 5 min", avatar: "J", color: "from-blue-500 to-indigo-500" },
                        { user: "María L.", action: "subió 3 fotos a", target: "Desayunos Doña Cleo", time: "hace 15 min", avatar: "M", color: "from-purple-500 to-pink-500" },
                        { user: "Carlos R.", action: "actualizó los precios de", target: "Comedor Familiar Vista Hermosa", time: "hace 32 min", avatar: "C", color: "from-emerald-500 to-teal-500" },
                        { user: "Sofia G.", action: "reportó cerrado temporalmente", target: "Mariscos El Malecón Callejero", time: "hace 1 hora", avatar: "S", color: "from-rose-500 to-orange-500" }
                      ].map((item, i) => (
                        <div key={i} className="relative">
                          {/* Dot marker on line */}
                          <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white dark:bg-[#070b13] border-2 border-blue-500 text-[8px]" />
                          
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr text-xs font-black text-white ${item.color}`}>
                              {item.avatar}
                            </div>
                            <div className="flex-1 text-xs">
                              <p className="text-slate-700 dark:text-slate-200">
                                <b>{item.user}</b> {item.action} <span className="font-bold text-blue-500">{item.target}</span>
                              </p>
                              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{item.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right: Personal Impact Panel */}
                  <div className={`p-6 rounded-3xl border ${
                    theme === "dark" ? "bg-[#111827]/60 border-slate-900" : "bg-white border-slate-100 shadow-sm"
                  }`}>
                    <h4 className="font-bold text-sm tracking-tight mb-4">Tu Impacto Personal</h4>
                    
                    <div className="space-y-6">
                      <div className="text-center p-4 bg-slate-500/5 rounded-2xl">
                        <span className="text-3xl">🏅</span>
                        <h5 className="font-extrabold text-sm tracking-tight mt-2">Nivel 4: Gourmet Explorer</h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">1,250 Puntos de Contribución</p>
                      </div>

                      {/* Level Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>PROGRESO AL NIVEL 5</span>
                          <span>75%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: "75%" }} />
                        </div>
                      </div>

                      {/* Unlocked Achievements list */}
                      <div className="space-y-3">
                        <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">LOGROS RECIENTES</span>
                        
                        {[
                          { title: "Ojo de Halcón", desc: "Reportó 5 aperturas de locales", emoji: "👁️" },
                          { title: "Fotógrafo Callejero", desc: "Subió 10 fotos a puestos", emoji: "📸" },
                          { title: "Ahorrador Máximo", desc: "Visitó 5 locales con rango $", emoji: "💎" }
                        ].map((ach, i) => (
                          <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-500/5 hover:bg-slate-500/10 transition-all border border-slate-200/40 dark:border-slate-800/40 cursor-pointer">
                            <span className="text-lg">{ach.emoji}</span>
                            <div className="overflow-hidden">
                              <h6 className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{ach.title}</h6>
                              <p className="text-[9px] text-slate-400 line-clamp-1">{ach.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}
