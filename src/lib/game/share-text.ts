import { getErrorLevel } from "./calculations";
import { getGameNumber } from "./date-utils";

const ERROR_EMOJI: Record<string, string> = {
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

  return [
    `PreciGame #${gameNumber} ${emoji}`,
    `Error: ${errorPct.toFixed(1)}%`,
    `Mejor que el ${Math.round(percentile)}% de jugadores`,
    "",
    "precigame.com",
  ].join("\n");
}

export function getTwitterShareUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
