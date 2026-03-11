import { ERROR_THRESHOLD_GOOD, ERROR_THRESHOLD_OK } from "@/lib/constants";
import type { ErrorLevel } from "@/types/game";

export function calculateError(
  guess: number,
  realPrice: number
): { errorAbs: number; errorPct: number } {
  const errorAbs = Math.round(Math.abs(guess - realPrice) * 100) / 100;
  const errorPct =
    realPrice > 0
      ? Math.round((errorAbs / realPrice) * 10000) / 100
      : guess === 0
        ? 0
        : 100;
  return { errorAbs, errorPct };
}

export function getErrorLevel(errorPct: number): ErrorLevel {
  if (errorPct < ERROR_THRESHOLD_GOOD) return "excellent";
  if (errorPct < ERROR_THRESHOLD_OK) return "good";
  return "poor";
}
