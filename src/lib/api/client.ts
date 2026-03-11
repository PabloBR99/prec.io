import type { ProductResponse, GuessResponse, GuessRequest } from "@/types/api";

export async function fetchTodayProduct(date?: string): Promise<ProductResponse> {
  const url = date ? `/api/product/today?date=${date}` : "/api/product/today";
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("No se pudo cargar el producto");
  }
  return res.json();
}

export async function fetchDevDates(): Promise<string[]> {
  const res = await fetch("/api/dev/dates");
  if (!res.ok) return [];
  const data = await res.json();
  return data.dates ?? [];
}

export async function fetchPercentile(errorPct: number): Promise<number> {
  const res = await fetch(`/api/percentile?errorPct=${errorPct}`);
  if (!res.ok) return 0;
  const data = await res.json();
  return data.percentile ?? 0;
}

export async function submitGuess(
  request: GuessRequest
): Promise<GuessResponse> {
  const res = await fetch("/api/guess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Error al enviar tu estimación");
  }
  return res.json();
}
