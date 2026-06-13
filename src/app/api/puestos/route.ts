import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { requireAuth } from "@/lib/requireAuth";
import { puestosQuerySchema } from "./validation";

export async function GET(req: NextRequest) {
  // Authenticate request
  try {
    await requireAuth(req);
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }

  // Validate query parameters
  const queryParams = Object.fromEntries(req.nextUrl.searchParams.entries());
  const validation = puestosQuerySchema.safeParse(queryParams);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error.errors.map(err=>err.message).join(', ') }, { status: 400 });
  }
  const { precioMax, categoria, lat, lng, radio } = validation.data;
  // Build query using validated parameters
  let query = supabaseAdmin.from('puestos').select('*').eq('activo', true);

  if (categoria) query = query.eq('categoria', categoria);
  if (precioMax !== undefined) query = query.lte('precio_min', precioMax);
  if (lat !== undefined && lng !== undefined) {
    // Filter by radius if provided (default 300 meters)
    const radius = radio ?? 300;
    const filtered = [];
    const dataResult = await query; // fetch once, then filter in memory
    if (dataResult.error) return NextResponse.json({ error: dataResult.error.message }, { status: 500 });
    const all = dataResult.data ?? [];
    for (const p of all) {
      const dist = calcularDistanciaMetros(lat, lng, p.lat, p.lng);
      if (dist <= radius) filtered.push(p);
    }
    return NextResponse.json(filtered);
  }

  // No geo‑filter – just return the query result
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
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
