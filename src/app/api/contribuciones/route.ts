import { NextRequest, NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabase-server";
import type { TipoContribucion } from "@/types";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    puesto_id,
    tipo,
    datos,
  }: {
    puesto_id: string;
    tipo: TipoContribucion;
    datos?: Record<string, unknown>;
  } = body;

  if (!puesto_id || !tipo) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("contribuciones")
    .insert({ puesto_id, tipo, datos });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (tipo === "reportar_cerrado") {
    await supabaseAdmin.from("puestos").update({ activo: false }).eq("id", puesto_id);
  }

  return NextResponse.json({ ok: true });
}
