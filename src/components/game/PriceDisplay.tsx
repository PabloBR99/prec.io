"use client";

import { useSpring } from "framer-motion";
import { useEffect, useState } from "react";

interface PriceDisplayProps {
  readonly value: number;
}

export function PriceDisplay({ value }: PriceDisplayProps) {
  const spring = useSpring(value, { stiffness: 50000, damping: 2000 });
  const [display, setDisplay] = useState(formatEuro(value));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(formatEuro(Math.max(0, Math.min(100, v))));
    });
    return unsubscribe;
  }, [spring]);

  return (
    <div className="text-center">
      <span className="text-5xl font-bold tabular-nums text-foreground sm:text-6xl">
        {display}
      </span>
    </div>
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
