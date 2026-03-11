import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getGameDate } from "@/lib/game/date-utils";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();

    const dateParam = request.nextUrl.searchParams.get("date");
    const isDev = process.env.NODE_ENV === "development";
    const today = isDev && dateParam ? dateParam : getGameDate();

    const { data, error } = await supabase
      .from("products")
      .select("id, nombre, imagen_url, categoria, marca, cantidad, fecha_asignada, created_at")
      .eq("fecha_asignada", today)
      .eq("activo", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "No hay producto disponible hoy" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        id: data.id,
        nombre: data.nombre,
        imagen_url: data.imagen_url,
        categoria: data.categoria,
        marca: data.marca,
        cantidad: data.cantidad,
        fecha: data.fecha_asignada,
        created_at: data.created_at,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
