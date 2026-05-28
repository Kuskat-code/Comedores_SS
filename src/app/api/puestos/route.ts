import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const precioMax = searchParams.get("precioMax");
  const categoria = searchParams.get("categoria");
  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const radioMetros = searchParams.get("radio") ?? "300";

  let query = supabaseAdmin.from("puestos").select("*").eq("activo", true);

  if (precioMax) query = query.lte("precio_min", Number.parseFloat(precioMax));
  if (categoria) query = query.eq("categoria", categoria);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let resultado = data ?? [];
  if (lat && lng) {
    const latN = Number.parseFloat(lat);
    const lngN = Number.parseFloat(lng);
    const radio = Number.parseFloat(radioMetros);
    resultado = resultado.filter((p) => {
      const dist = calcularDistanciaMetros(latN, lngN, p.lat, p.lng);
      return dist <= radio;
    });
  }

  return NextResponse.json(resultado);
}

function calcularDistanciaMetros(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
