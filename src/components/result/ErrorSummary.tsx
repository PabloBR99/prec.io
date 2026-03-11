"use client";

import { motion } from "framer-motion";
import { ERROR_COLORS } from "@/lib/constants";
import type { ErrorLevel } from "@/types/game";

interface ErrorSummaryProps {
  readonly guess: number;
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
  errorPct,
  errorLevel,
  visible,
}: ErrorSummaryProps) {
  if (!visible) return null;

  const color = ERROR_COLORS[errorLevel];
  const isPerfect = errorLevel === "perfect";

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-1 text-center"
    >
      {isPerfect ? (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 10 }}
          className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold sm:text-3xl"
          style={{ color: ERROR_COLORS.perfect }}
        >
          EXACTO!
        </motion.p>
      ) : (
        <>
          <motion.p
            variants={item}
            className="font-[family-name:var(--font-space-grotesk)] text-2xl font-bold sm:text-3xl"
            style={{ color }}
          >
            {errorPct.toFixed(1)}%
          </motion.p>
          <motion.p variants={item} className="text-xs font-medium uppercase tracking-wider text-foreground/50">
            Error
          </motion.p>
        </>
      )}
      <motion.p variants={item} className="mt-1 text-sm text-foreground/50">
        Estimaste {formatEuro(guess)}
      </motion.p>
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
