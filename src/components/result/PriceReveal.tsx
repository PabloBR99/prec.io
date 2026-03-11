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

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-foreground/50">Precio real</p>
      <p className="mt-1 font-[family-name:var(--font-space-grotesk)] text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
        {display}
      </p>
    </motion.div>
  );
}
