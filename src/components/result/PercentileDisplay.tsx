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
    if (visible) {
      spring.set(percentile);
    }
  }, [visible, percentile, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(Math.round(v));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 8, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <p className="font-[family-name:var(--font-space-grotesk)] text-4xl font-bold text-accent sm:text-5xl">
        {display}%
      </p>
      <p className="mt-1.5 text-sm font-medium text-foreground/55 sm:text-base">
        {Math.round(percentile) <= 5
          ? "Casi todos lo hicieron mejor hoy"
          : Math.round(percentile) >= 95
            ? "Mejor que casi todos los jugadores de hoy"
            : `Mejor que el ${Math.round(percentile)}% de jugadores de hoy`}
      </p>
    </motion.div>
  );
}
