"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface PercentileDisplayProps {
  readonly percentile: number;
  readonly visible: boolean;
}

export function PercentileDisplay({ percentile, visible }: PercentileDisplayProps) {
  const spring = useSpring(0, { stiffness: 40, damping: 15 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (visible) spring.set(percentile);
  }, [visible, percentile, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);

  const markerPct = Math.max(2, Math.min(98, display));

  const description =
    Math.round(percentile) <= 5
      ? "Casi todos lo hicieron mejor hoy"
      : Math.round(percentile) >= 95
        ? "Mejor que casi todos hoy"
        : `Mejor que el ${Math.round(percentile)}% de jugadores hoy`;

  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full px-2"
    >
      {/* Ranking bar */}
      <div className="relative mx-auto max-w-xs pb-1">
        {/* Track */}
        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent/40"
            style={{ width: `${markerPct}%` }}
          />
        </div>
        {/* Marker */}
        <div
          className="absolute -top-[3px] h-4 w-1.5 rounded-full bg-accent shadow-sm shadow-accent/30"
          style={{ left: `${markerPct}%`, transform: "translateX(-50%)" }}
        />
        {/* End labels */}
        <div className="mt-2 flex justify-between text-[10px] font-semibold uppercase tracking-widest text-foreground/30">
          <span>Peor</span>
          <span>Mejor</span>
        </div>
      </div>
      {/* Description */}
      <p className="mt-2 text-center text-sm font-medium text-foreground/55">
        {description}
      </p>
    </motion.div>
  );
}
