import { getErrorLevel } from "./calculations";
import { getGameNumber } from "./date-utils";

const ERROR_EMOJI: Record<string, string> = {
  perfect: "\uD83C\uDFAF",
  excellent: "\uD83D\uDFE2",
  good: "\uD83D\uDFE1",
  poor: "\uD83D\uDD34",
};

export function generateShareText(
  date: string,
  errorPct: number,
  percentile: number
): string {
  const gameNumber = getGameNumber(date);
  const level = getErrorLevel(errorPct);
  const emoji = ERROR_EMOJI[level];

  if (level === "perfect") {
    return [
      `prec.io #${gameNumber} ${emoji} PRECIO EXACTO!`,
      `He acertado el precio exacto!`,
      `Mejor que el ${Math.round(percentile)}% de jugadores`,
      "",
      "https://prec-io.vercel.app",
    ].join("\n");
  }

  const accuracy = Math.max(0, 100 - errorPct);

  return [
    `prec.io #${gameNumber} ${emoji}`,
    `Precisión: ${accuracy.toFixed(1)}%`,
    `Mejor que el ${Math.round(percentile)}% de jugadores`,
    "",
    "https://prec-io.vercel.app",
  ].join("\n");
}

export function getTwitterShareUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
