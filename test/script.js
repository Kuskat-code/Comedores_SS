// Static copy of LandingPage functionality (React → plain JS)
// Includes MapView logic integrated directly

// ----- Configuration -----
const COLORES_CATEGORIA = {
  pupusas: "#3b82f6",
  desayunos: "#f59e0b",
  comedores: "#10b981",
  antojitos: "#ec4899",
  fruta: "#84cc16",
  bebidas: "#06b6d4",
  mariscos: "#6366f1",
  otros: "#8b5cf6",
};

// ----- Haversine distance (meters) -----
function distanceMeters(a, b) {
  const R = 6371000;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

// ----- State -----
let userPos = null;
let vendors = [];
let search = "";
let loading = false;
let map = null;
let userMarker = null;

// ----- DOM Elements -----
const searchInput = document.getElementById("searchInput");
const vendorsLoadingEl = document.getElementById("vendorsLoading");
const vendorsListEl = document.getElementById("vendorsList");
const locationStatusEl = document.getElementById("locationStatus");
const locationTextEl = document.getElementById("locationText");
const darkModeToggle = document.getElementById("darkModeToggle");
const darkModeIcon = document.getElementById("darkModeIcon");
const bodyEl = document.body;

// ----- Dark Mode Initialization -----
function initDarkMode() {
  const saved = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = saved !== null ? saved === "true" : prefersDark;

  if (isDark) {
    bodyEl.classList.add("dark");
    darkModeIcon.textContent = "☀️";
  }

  darkModeToggle.addEventListener("click", () => {
    const isNowDark = bodyEl.classList.toggle("dark");
    localStorage.setItem("darkMode", isNowDark);
    darkModeIcon.textContent = isNowDark ? "☀️" : "🌙";
  });
}

// ----- Map Initialization -----
function initMap() {
  const mapStyle = window.NEXT_PUBLIC_MAP_STYLE || "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

  map = new maplibregl.Map({
    container: "map",
    style: mapStyle,
    center: [-89.2182, 13.6929],
    zoom: 12,
  });

  map.addControl(new maplibregl.NavigationControl(), "top-right");
  map.addControl(
    new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    }),
    "top-right"
  );

  map.on("load", () => {
    if (vendors.length) updatePuestosLayers();
  });
}

// ----- Vendor Data Loading -----
async function loadVendors(lat, lng) {
  if (loading) return;
  loading = true;
  setLoadingUI(true);

  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radio: "2000",
    });
    if (search) params.set("categoria", search);

    const baseUrl = window.location.origin;
    const res = await fetch(`${baseUrl}/api/puestos?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch vendors");
    vendors = await res.json();
    renderVendorList();
    if (map && map.isStyleLoaded()) updatePuestosLayers();
  } catch (e) {
    console.error(e);
  } finally {
    loading = false;
    setLoadingUI(false);
  }
}

// ----- UI Helpers -----
function setLoadingUI(isLoading) {
  vendorsLoadingEl.classList.toggle("hidden", !isLoading);
}

// ----- Vendor List Rendering -----
function renderVendorList() {
  vendorsListEl.innerHTML = "";
  if (!userPos) return;

  const sortedVendors = [...vendors].sort((a, b) => {
    const da = distanceMeters(userPos, { lat: a.lat, lng: a.lng });
    const db = distanceMeters(userPos, { lat: b.lat, lng: b.lng });
    return da - db;
  });

  sortedVendors.forEach((puesto) => {
    const dist = distanceMeters(userPos, { lat: puesto.lat, lng: puesto.lng });
    const rating = puesto.nivel_higiene ?? 0;
    const img = puesto.fotos?.[0] ?? "/placeholder.png";

    const li = document.createElement("li");
    li.id = `vendor-${puesto.id}`;
    li.className = "flex items-center p-2 hover:bg-gray-100 cursor-pointer vendor-item";

    li.innerHTML = `
      <img src="${img}" alt="${puesto.nombre}" class="w-12 h-12 object-cover rounded mr-3 vendor-img" />
      <div class="flex-1">
        <p class="font-semibold text-gray-800">${puesto.nombre}</p>
        <p class="text-sm text-gray-500">
          ${rating ? `⭐ ${rating}/5` : "Sin calificación"}
        </p>
      </div>
      ${dist !== null ? `<span class="text-sm text-gray-600 vendor-distance">${Math.round(dist)}&nbsp;m</span>` : ""}
    `;

    li.addEventListener("click", () => {
      if (map && puesto.lng !== undefined && puesto.lat !== undefined) {
        map.flyTo({
          center: [puesto.lng, puesto.lat],
          zoom: 15.5,
          essential: true,
          speed: 1.2,
        });
      }
    });

    vendorsListEl.appendChild(li);
  });
}

// ----- Map Layers for Puestos -----
function updatePuestosLayers() {
  if (!map) return;

  const filtered = vendors.filter(() => true);

  const featureCollection = {
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

  map.addSource("puestos-source", {
    type: "geojson",
    data: featureCollection,
  });

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

  const onMouseEnter = () => {
    map.getCanvas().style.cursor = "pointer";
  };
  const onMouseLeave = () => {
    map.getCanvas().style.cursor = "";
  };
  const onClick = (event) => {
    const feature = map.queryRenderedFeatures(event.point, {
      layers: ["puestos-layer"],
    })[0];
    if (!feature) return;
    const puesto = filtered.find((item) => item.id === feature.properties?.id);
    if (puesto) {
      map.flyTo({
        center: [puesto.lng, puesto.lat],
        zoom: 15.5,
        essential: true,
        speed: 1.2,
      });
      const el = document.getElementById(`vendor-${puesto.id}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  map.on("mouseenter", "puestos-layer", onMouseEnter);
  map.on("mouseleave", "puestos-layer", onMouseLeave);
  map.on("click", "puestos-layer", onClick);
}

// ----- User Location Handling -----
function updateUserLocation(lat, lng) {
  userPos = { lat, lng };

  if (userMarker) {
    userMarker.remove();
  }

  const el = document.createElement("div");
  el.className = "relative flex h-5 w-5 items-center justify-center";

  const ping = document.createElement("div");
  ping.className = "absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75";

  const dot = document.createElement("div");
  dot.className = "relative inline-flex h-3.5 w-3.5 rounded-full border border-white bg-blue-600 shadow-md";

  el.appendChild(ping);
  el.appendChild(dot);

  userMarker = new maplibregl.Marker({ element: el })
    .setLngLat([lng, lat])
    .addTo(map);

  map.flyTo({
    center: [lng, lat],
    zoom: 14,
    essential: true,
  });
}

// ----- Geolocation on Init -----
function initGeolocation() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    locationTextEl.textContent = "Geolocalización no disponible";
    locationStatusEl.classList.remove("hidden");
    return;
  }

  locationStatusEl.classList.remove("hidden");
  locationTextEl.textContent = "Obteniendo ubicación…";

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      updateUserLocation(latitude, longitude);
      loadVendors(latitude, longitude);
      locationStatusEl.classList.add("hidden");
    },
    (err) => {
      console.warn("Geolocation error:", err);
      locationTextEl.textContent = "Error al obtener ubicación. Verifique permisos.";
      locationStatusEl.classList.remove("hidden");
    }
  );
}

// ----- Search Input Handling -----
function initSearch() {
  let timeoutId;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(timeoutId);
    search = e.target.value.trim();
    timeoutId = setTimeout(() => {
      if (userPos) loadVendors(userPos.lat, userPos.lng);
    }, 300);
  });
}

// ----- Bootstrap -----
document.addEventListener("DOMContentLoaded", () => {
  initDarkMode();
  initMap();
  initGeolocation();
  initSearch();
});

// ----- Cleanup -----
window.addEventListener("beforeunload", () => {
  if (map) map.remove();
});