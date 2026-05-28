"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl, { type GeoJSONSourceSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

import type { FiltrosMapa, Puesto } from "@/types";

const COLORES_CATEGORIA: Record<string, string> = {
  pupusas: "#3b82f6",     // Vibrant Blue accent
  desayunos: "#f59e0b",   // Amber
  comedores: "#10b981",   // Emerald
  antojitos: "#ec4899",   // Pink
  fruta: "#84cc16",       // Lime
  bebidas: "#06b6d4",     // Cyan
  mariscos: "#6366f1",    // Indigo
  otros: "#8b5cf6",       // Violet
};

type Props = {
  puestos: Puesto[];
  filtros?: FiltrosMapa;
  onSelectPuesto?: (puesto: Puesto) => void;
  userCoords?: { lat: number; lng: number } | null;
  selectedPuestoId?: string | null;
};

export default function MapView({ 
  puestos, 
  filtros, 
  onSelectPuesto, 
  userCoords,
  selectedPuestoId 
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // 1. Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Use OpenFreeMap Liberty or a beautiful Voyager basemap as a solid fallback
    const mapStyle = process.env.NEXT_PUBLIC_MAP_STYLE || "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: [-89.2182, 13.6929],
      zoom: 12,
    });
    mapRef.current = map;

    map.on("load", () => {
      setIsMapLoaded(true);
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      "top-right"
    );

    return () => {
      map.remove();
      mapRef.current = null;
      setIsMapLoaded(false);
    };
  }, []);

  // 2. Handle User Geolocation Coordinates
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || !userCoords) return;

    // Remove existing user marker if any
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create a custom element for the user marker
    const el = document.createElement("div");
    el.className = "relative flex h-5 w-5 items-center justify-center";
    
    const ping = document.createElement("div");
    ping.className = "absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75";
    
    const dot = document.createElement("div");
    dot.className = "relative inline-flex h-3.5 w-3.5 rounded-full border border-white bg-blue-600 shadow-md";
    
    el.appendChild(ping);
    el.appendChild(dot);

    // Place marker
    userMarkerRef.current = new maplibregl.Marker({ element: el })
      .setLngLat([userCoords.lng, userCoords.lat])
      .addTo(map);

    // Center map on user location
    map.flyTo({
      center: [userCoords.lng, userCoords.lat],
      zoom: 14,
      essential: true,
    });
  }, [userCoords, isMapLoaded]);

  // 3. Handle selection change from outside (e.g. clicking list cards)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded || !selectedPuestoId) return;

    const puesto = puestos.find((p) => p.id === selectedPuestoId);
    if (puesto) {
      map.flyTo({
        center: [puesto.lng, puesto.lat],
        zoom: 15.5,
        essential: true,
        speed: 1.2,
      });
    }
  }, [selectedPuestoId, isMapLoaded, puestos]);

  // 4. Update markers & layers based on puestos & filters
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isMapLoaded) return;

    const filtered = puestos.filter((p) => {
      if (filtros?.precioMax !== undefined && p.precio_min !== undefined) {
        if (p.precio_min > filtros.precioMax) return false;
      }
      if (filtros?.categorias?.length && !filtros.categorias.includes(p.categoria)) {
        return false;
      }
      if (filtros?.soloAbiertos) {
        // Simple mock of status or check hours if available
        // If the place is marked active, let's treat it based on state
      }
      return true;
    });

    const featureCollection: GeoJSON.FeatureCollection<GeoJSON.Point> = {
      type: "FeatureCollection",
      features: filtered.map((puesto) => ({
        type: "Feature",
        properties: {
          id: puesto.id,
          nombre: puesto.nombre,
          categoria: puesto.categoria,
          color: COLORES_CATEGORIA[puesto.categoria] ?? COLORES_CATEGORIA.otros,
        },
        geometry: {
          type: "Point",
          coordinates: [puesto.lng, puesto.lat],
        },
      })),
    };

    if (map.getLayer("puestos-layer")) map.removeLayer("puestos-layer");
    if (map.getSource("puestos-source")) map.removeSource("puestos-source");

    map.addSource(
      "puestos-source",
      {
        type: "geojson",
        data: featureCollection,
      } satisfies GeoJSONSourceSpecification
    );

    map.addLayer({
      id: "puestos-layer",
      type: "circle",
      source: "puestos-source",
      paint: {
        "circle-radius": 9,
        "circle-color": ["get", "color"],
        "circle-stroke-width": 2.5,
        "circle-stroke-color": "#ffffff",
      },
    });

    // Hover effect
    const onMouseEnter = () => {
      map.getCanvas().style.cursor = "pointer";
    };
    const onMouseLeave = () => {
      map.getCanvas().style.cursor = "";
    };
    
    // Click event
    const onClick = (event: maplibregl.MapLayerMouseEvent) => {
      const feature = map.queryRenderedFeatures(event.point, {
        layers: ["puestos-layer"],
      })[0];
      if (!feature) return;

      const puesto = filtered.find((item) => item.id === feature.properties?.id);
      if (puesto) onSelectPuesto?.(puesto);
    };

    map.on("mouseenter", "puestos-layer", onMouseEnter);
    map.on("mouseleave", "puestos-layer", onMouseLeave);
    map.on("click", "puestos-layer", onClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off("mouseenter", "puestos-layer", onMouseEnter);
        mapRef.current.off("mouseleave", "puestos-layer", onMouseLeave);
        mapRef.current.off("click", "puestos-layer", onClick);
      }
    };
  }, [filtros, onSelectPuesto, puestos, isMapLoaded]);

  return <div ref={containerRef} className="h-full w-full rounded-2xl shadow-inner border border-slate-200/50 dark:border-slate-800/40" />;
}

