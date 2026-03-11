import type { ProductResponse, GuessResponse, GuessRequest } from "@/types/api";

export async function fetchTodayProduct(): Promise<ProductResponse> {
  const res = await fetch("/api/product/today");
  if (!res.ok) {
    throw new Error("No se pudo cargar el producto de hoy");
  }
  return res.json();
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
