"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { motion } from "framer-motion";

interface CountdownProps {
  readonly visible: boolean;
}

export function Countdown({ visible }: CountdownProps) {
  const { hours, minutes, seconds } = useCountdown();

  if (!visible) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <p className="text-xs font-medium uppercase tracking-wider text-foreground/40">
        Siguiente producto en
      </p>
      <div className="mt-2 flex items-center justify-center gap-1">
        {[pad(hours), pad(minutes), pad(seconds)].map((segment, i) => (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-xl font-light text-foreground/30">:</span>
            )}
            {segment.split("").map((digit, j) => (
              <span
                key={j}
                className="inline-flex h-10 w-7 items-center justify-center rounded-md bg-foreground/5 text-lg font-bold tabular-nums text-foreground"
              >
                {digit}
              </span>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
