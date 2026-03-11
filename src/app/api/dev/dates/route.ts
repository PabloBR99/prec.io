import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("products")
    .select("fecha_asignada")
    .eq("activo", true)
    .order("fecha_asignada", { ascending: true });

  if (error || !data) {
    return NextResponse.json({ error: "Error al obtener fechas" }, { status: 500 });
  }

  const dates = data.map((d) => d.fecha_asignada);

  return NextResponse.json({ dates });
}
