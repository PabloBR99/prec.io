import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { createServiceClient } from "@/lib/supabase/server";
import { getGameDate } from "@/lib/game/date-utils";
import { calculateError } from "@/lib/game/calculations";

const guessSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guess: z.number().min(0).max(100),
  sessionId: z.string().min(1),
});

const rateLimitMap = new Map<string, { count: number; date: string }>();

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type debe ser application/json" },
        { status: 415 }
      );
    }

    const body = await request.json();
    const parsed = guessSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de entrada invalidos" },
        { status: 400 }
      );
    }

    const { date, guess, sessionId } = parsed.data;
    const isDev = process.env.NODE_ENV === "development";
    const today = isDev ? date : getGameDate();

    if (!isDev && date !== today) {
      return NextResponse.json(
        { error: "Solo puedes jugar el producto de hoy" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    if (isDev) {
      // Dev mode: no rate limit, no duplicate check, no DB write
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("id, precio")
        .eq("fecha_asignada", today)
        .eq("activo", true)
        .single();

      if (productError || !product) {
        return NextResponse.json(
          { error: "No hay producto disponible para esta fecha" },
          { status: 404 }
        );
      }

      const { errorAbs, errorPct } = calculateError(guess, product.precio);

      return NextResponse.json({
        realPrice: product.precio,
        errorAbs,
        errorPct,
        percentile: 0,
      });
    }

    // Rate limiting
    const rateKey = sessionId;
    const rateEntry = rateLimitMap.get(rateKey);
    if (rateEntry && rateEntry.date === today && rateEntry.count >= 3) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Intenta mas tarde." },
        { status: 429 }
      );
    }

    // Check for existing guess from this session
    const { data: existingGuess } = await supabase
      .from("guesses")
      .select("guess, error_abs, error_pct")
      .eq("session_id", sessionId)
      .eq("fecha", today)
      .single();

    if (existingGuess) {
      // Return cached result (idempotent)
      const { data: product } = await supabase
        .from("products")
        .select("precio")
        .eq("fecha_asignada", today)
        .single();

      const percentile = await calculatePercentile(supabase, today, existingGuess.error_pct);

      return NextResponse.json({
        realPrice: product?.precio ?? 0,
        errorAbs: existingGuess.error_abs,
        errorPct: existingGuess.error_pct,
        percentile,
      });
    }

    // Get product with price
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, precio")
      .eq("fecha_asignada", today)
      .eq("activo", true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "No hay producto disponible hoy" },
        { status: 404 }
      );
    }

    const { errorAbs, errorPct } = calculateError(guess, product.precio);

    // Insert guess
    const { error: insertError } = await supabase.from("guesses").insert({
      product_id: product.id,
      fecha: today,
      guess,
      error_abs: errorAbs,
      error_pct: errorPct,
      session_id: sessionId,
    });

    if (insertError) {
      return NextResponse.json(
        { error: "Error al guardar tu estimación" },
        { status: 500 }
      );
    }

    // Update rate limit
    if (rateEntry && rateEntry.date === today) {
      rateEntry.count++;
    } else {
      rateLimitMap.set(rateKey, { count: 1, date: today });
    }

    const percentile = await calculatePercentile(supabase, today, errorPct);

    return NextResponse.json({
      realPrice: product.precio,
      errorAbs,
      errorPct,
      percentile,
    });
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function calculatePercentile(
  supabase: ReturnType<typeof createServiceClient>,
  fecha: string,
  errorPct: number
): Promise<number> {
  const { count: totalCount } = await supabase
    .from("guesses")
    .select("*", { count: "exact", head: true })
    .eq("fecha", fecha);

  const { count: worseCount } = await supabase
    .from("guesses")
    .select("*", { count: "exact", head: true })
    .eq("fecha", fecha)
    .gt("error_pct", errorPct);

  const total = totalCount ?? 1;
  const worse = worseCount ?? 0;

  return Math.round((worse / Math.max(total, 1)) * 1000) / 10;
}
