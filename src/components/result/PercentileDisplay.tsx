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

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12 }}
      className="text-center"
    >
      <p className="text-4xl font-bold text-accent sm:text-5xl">
        {display}%
      </p>
      <p className="mt-1 text-sm text-foreground/60 sm:text-base">
        Mejor que el {Math.round(percentile)}% de jugadores de hoy
      </p>
    </motion.div>
  );
}
