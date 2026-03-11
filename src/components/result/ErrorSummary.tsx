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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, x: 20, filter: "blur(4px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function ErrorSummary({
  guess,
  realPrice,
  errorPct,
  errorLevel,
  visible,
}: ErrorSummaryProps) {
  if (!visible) return null;

  const color = ERROR_COLORS[errorLevel];
  const isPerfect = errorLevel === "perfect";

  const lines = [
    { label: "Tu estimación", value: formatEuro(guess) },
    { label: "Precio real", value: formatEuro(realPrice) },
    {
      label: "Error",
      value: isPerfect ? "EXACTO!" : `${errorPct.toFixed(1)}%`,
      highlight: true,
    },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-2"
    >
      {isPerfect && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
          className="text-center text-2xl font-bold sm:text-3xl"
          style={{ color: ERROR_COLORS.perfect }}
        >
          Precio exacto!
        </motion.p>
      )}
      {lines.map((line) => (
        <motion.div
          key={line.label}
          variants={item}
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
