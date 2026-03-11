"use client";

import { motion } from "framer-motion";
import { ERROR_COLORS } from "@/lib/constants";
import type { ErrorLevel } from "@/types/game";

interface ErrorSummaryProps {
  readonly guess: number;
  readonly realPrice: number;
  readonly errorAbs: number;
  readonly errorPct: number;
  readonly errorLevel: ErrorLevel;
  readonly visible: boolean;
}

export function ErrorSummary({
  guess,
  realPrice,
  errorAbs,
  errorPct,
  errorLevel,
  visible,
}: ErrorSummaryProps) {
  if (!visible) return null;

  const color = ERROR_COLORS[errorLevel];

  const accuracy = Math.max(0, 100 - errorPct);

  const lines = [
    { label: "Tu estimación", value: formatEuro(guess) },
    { label: "Precio real", value: formatEuro(realPrice) },
    {
      label: "Precisión",
      value: `${accuracy.toFixed(1)}%`,
      highlight: true,
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {lines.map((line, i) => (
        <motion.div
          key={line.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center justify-between gap-4 text-sm sm:text-base"
        >
          <span className="text-foreground/60">{line.label}</span>
          <span
            className="font-semibold"
            style={line.highlight ? { color } : undefined}
          >
            {line.value}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function formatEuro(n: number): string {
  return (
    n.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " \u20AC"
  );
}
