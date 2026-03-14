"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface RankingHeroProps {
  readonly percentile: number;
  readonly visible: boolean;
}

export function RankingHero({ percentile, visible }: RankingHeroProps) {
  const spring = useSpring(0, { stiffness: 40, damping: 15 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (visible) spring.set(percentile);
  }, [visible, percentile, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => setDisplay(Math.round(v)));
    return unsubscribe;
  }, [spring]);

  return (
    <motion.div
      initial={false}
      animate={
        visible
          ? { opacity: 1, y: 0, filter: "blur(0px)" }
          : { opacity: 0, y: 12, filter: "blur(6px)" }
      }
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
        Mejor que el
      </p>
      {/* Number and % as inline flex so % scales proportionally */}
      <div className="flex items-baseline leading-none">
        <span className="font-[family-name:var(--font-playfair)] text-4xl font-bold italic tabular-nums text-foreground sm:text-5xl">
          {display}
        </span>
        <span className="font-[family-name:var(--font-playfair)] text-lg font-bold italic text-foreground/60 sm:text-xl">
          %
        </span>
      </div>
      <p className="mt-0.5 text-sm font-medium text-foreground/55">
        de jugadores hoy
      </p>
    </motion.div>
  );
}
