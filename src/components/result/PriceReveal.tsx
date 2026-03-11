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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 12 }}
      className="text-center"
    >
      <p className="text-sm font-medium text-foreground/60">Precio real</p>
      <p className="mt-1 text-4xl font-bold tabular-nums text-foreground sm:text-5xl">
        {display}
      </p>
    </motion.div>
  );
}
