"use client";

import { motion } from "framer-motion";
import { ERROR_COLORS } from "@/lib/constants";
import type { ErrorLevel } from "@/types/game";

interface ErrorSummaryProps {
  readonly guess: number;
  readonly realPrice: number;
  readonly errorLevel: ErrorLevel;
  readonly visible: boolean;
}

export function ErrorSummary({
  guess,
  realPrice,
  errorLevel,
  visible,
}: ErrorSummaryProps) {
  const diff = guess - realPrice;
  const absDiff = Math.abs(diff);
  const isPerfect = errorLevel === "perfect";
  const errorPct = realPrice > 0 ? Math.round((absDiff / realPrice) * 100) : 0;

  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Tu respuesta</p>
      <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
        {formatEuro(guess)}
      </p>
      {isPerfect ? (
        <p className="mt-1 text-sm font-bold" style={{ color: ERROR_COLORS.perfect }}>
          EXACTO!
        </p>
      ) : diff !== 0 ? (
        <div className="mt-1">
          <p className={`text-sm font-medium tabular-nums ${diff > 0 ? "text-red-400" : "text-emerald-500"}`}>
            {absDiff.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € {diff > 0 ? "de más" : "de menos"}
          </p>
          <p className="mt-0.5 text-[11px] text-foreground/40">
            {errorPct}% de error
          </p>
        </div>
      ) : null}
    </motion.div>
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
