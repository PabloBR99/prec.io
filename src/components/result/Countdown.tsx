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
  const segments = [
    { value: pad(hours), label: "h" },
    { value: pad(minutes), label: "m" },
    { value: pad(seconds), label: "s" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-2 rounded-full bg-foreground/5 px-5 py-2.5"
    >
      <span className="text-xs font-medium text-foreground/40">
        Siguiente producto en
      </span>
      <div className="flex items-baseline gap-1">
        {segments.map((seg, i) => (
          <span key={i} className="flex items-baseline">
            {i > 0 && (
              <span className="mx-0.5 text-foreground/20">:</span>
            )}
            <span className="text-sm font-bold tabular-nums text-foreground">
              {seg.value}
            </span>
            <span className="text-[10px] font-medium text-foreground/30">
              {seg.label}
            </span>
          </span>
        ))}
      </div>
    </motion.div>
  );
}
