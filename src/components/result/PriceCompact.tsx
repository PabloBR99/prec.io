"use client";

import { motion } from "framer-motion";
import { ERROR_COLORS } from "@/lib/constants";
import type { ErrorLevel } from "@/types/game";

interface PriceCompactProps {
  readonly realPrice: number;
  readonly guess: number;
  readonly errorLevel: ErrorLevel;
  readonly visible: boolean;
}

function formatEuro(n: number): string {
  return (
    n.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " \u20AC"
  );
}

export function PriceCompact({ realPrice, guess, errorLevel, visible }: PriceCompactProps) {
  const diff = guess - realPrice;
  const absDiff = Math.abs(diff);
  const isPerfect = errorLevel === "perfect";
  const errorPct = realPrice > 0 ? Math.round((absDiff / realPrice) * 100) : 0;

  const diffSign = diff > 0 ? "+" : "\u2212";
  const diffColor = ERROR_COLORS[errorLevel];

  return (
    <motion.div
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 8, filter: "blur(4px)" }
      }
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1.5"
    >
      <div className="flex items-start gap-8">
        {/* Real price — the truth, in accent */}
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-foreground/50">
            Precio real
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-space-grotesk)] text-2xl font-extrabold tabular-nums text-accent sm:text-3xl">
            {formatEuro(realPrice)}
          </p>
        </div>

        {/* Guess — secondary, with diff anchored below */}
        <div className="flex flex-col items-center">
          <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/35">
            Tu respuesta
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-space-grotesk)] text-xl font-semibold tabular-nums text-foreground/45 sm:text-2xl">
            {formatEuro(guess)}
          </p>
          {/* Diff anchored under guess */}
          {!isPerfect && (
            <span
              className="mt-0.5 text-xs font-semibold tabular-nums"
              style={{ color: diffColor }}
            >
              {diffSign}
              {absDiff.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              € · {errorPct}%
            </span>
          )}
        </div>
      </div>

      {/* Perfect badge centered */}
      {isPerfect && (
        <span
          className="rounded-full px-3.5 py-1 text-sm font-bold"
          style={{
            color: ERROR_COLORS.perfect,
            backgroundColor: `${ERROR_COLORS.perfect}18`,
          }}
        >
          ¡EXACTO!
        </span>
      )}
    </motion.div>
  );
}
