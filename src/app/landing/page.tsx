"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import MapView from "@/components/Map/MapView";
import type { Puesto } from "@/types";

// Simple haversine distance (meters)
function distanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000; // Earth radius in meters
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export default function LandingPage() {
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [vendors, setVendors] = useState<Puesto[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch vendors near the supplied coordinates (default radius 2000 m)
  const loadVendors = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lng: lng.toString(),
        radio: "2000",
      });
      if (search) params.set("categoria", search);
      const res = await fetch(`/api/puestos?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const data: Puesto[] = await res.json();
      setVendors(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  // Get user location on mount
  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });
        loadVendors(latitude, longitude);
      },
      (err) => console.warn("Geolocation error:", err)
    );
  }, []);

  // Re‑run when the search filter changes (debounce could be added)
  useEffect(() => {
    if (userPos) loadVendors(userPos.lat, userPos.lng);
  }, [search, userPos, loadVendors]);

  // Vendors sorted by distance to user (closest first)
  const sortedVendors = useMemo(() => {
    if (!userPos) return vendors;
    return [...vendors].sort((a, b) => {
      const da = distanceMeters(userPos, { lat: a.lat, lng: a.lng });
      const db = distanceMeters(userPos, { lat: b.lat, lng: b.lng });
      return da - db;
    });
  }, [vendors, userPos]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with search bar */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Comedores de San Salvador</h1>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Filtrar por categoría…"
            className="w-full pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {/* Map container */}
      <section className="flex-1 overflow-hidden">
        {userPos ? (
          <MapView
            puestos={sortedVendors}
            userCoords={userPos}
            selectedPuestoId={null}
            onSelectPuesto={(p) => {
              // Scroll into view when a marker is clicked
              const el = document.getElementById(`vendor-${p.id}`);
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">
            {loading ? "Cargando ubicación…" : "Permitir acceso a la ubicación para ver los puestos cercanos"}
          </div>
        )}
      </section>

      {/* List of nearest vendors */}
      <aside className="bg-white border-t max-h-64 overflow-y-auto">
        <h2 className="text-lg font-medium px-4 py-2 border-b">Los más cercanos</h2>
        {loading && <p className="px-4 py-2 text-gray-500">Cargando puestos…</p>}
        <ul className="divide-y">
          {sortedVendors.map((p) => {
            const dist = userPos ? distanceMeters(userPos, { lat: p.lat, lng: p.lng }) : null;
            const rating = p.nivel_higiene ?? 0; // placeholder – using higiene level as rating
            const img = p.fotos?.[0] ?? "/placeholder.png";
            return (
              <li key={p.id} id={`vendor-${p.id}`} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer">
                <img src={img} alt={p.nombre} className="w-12 h-12 object-cover rounded mr-3" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{p.nombre}</p>
                  <p className="text-sm text-gray-500">{rating ? `⭐ ${rating}/5` : "Sin calificación"}</p>
                </div>
                {dist !== null && (
                  <span className="text-sm text-gray-600">{Math.round(dist)} m</span>
                )}
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
