"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface PriceRevealProps {
  readonly realPrice: number;
  readonly visible: boolean;
}

export function PriceReveal({ realPrice, visible }: PriceRevealProps) {
  const spring = useSpring(0, { stiffness: 50, damping: 15 });
  const [display, setDisplay] = useState("0,00 \u20AC");

  useEffect(() => {
    if (visible) {
      spring.set(realPrice);
    }
  }, [visible, realPrice, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(
        v.toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " \u20AC"
      );
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
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Precio real</p>
      <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
        {display}
      </p>
    </motion.div>
  );
}
