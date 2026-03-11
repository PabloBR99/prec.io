import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getGameDate } from "@/lib/game/date-utils";

export async function GET(request: NextRequest) {
  const errorPctParam = request.nextUrl.searchParams.get("errorPct");

  if (!errorPctParam) {
    return NextResponse.json(
      { error: "Parámetro errorPct requerido" },
      { status: 400 }
    );
  }

  const errorPct = parseFloat(errorPctParam);
  if (isNaN(errorPct) || errorPct < 0) {
    return NextResponse.json(
      { error: "errorPct inválido" },
      { status: 400 }
    );
  }

  const today = getGameDate();
  const supabase = createServiceClient();

  const { count: totalCount } = await supabase
    .from("guesses")
    .select("*", { count: "exact", head: true })
    .eq("fecha", today);

  const { count: worseCount } = await supabase
    .from("guesses")
    .select("*", { count: "exact", head: true })
    .eq("fecha", today)
    .gt("error_pct", errorPct);

  const total = totalCount ?? 1;
  const worse = worseCount ?? 0;
  const percentile = Math.round((worse / Math.max(total, 1)) * 1000) / 10;

  return NextResponse.json(
    { percentile },
    {
      headers: {
        "Cache-Control": "public, s-maxage=15, stale-while-revalidate=10",
      },
    }
  );
}
