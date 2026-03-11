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
    <div className="relative text-center">
      {/* Subtle glow behind price */}
      <div className="absolute inset-0 mx-auto h-full w-3/4 rounded-full bg-accent/[0.06] blur-2xl" />
      <span className="relative bg-gradient-to-br from-foreground via-foreground/90 to-accent bg-clip-text font-[family-name:var(--font-space-grotesk)] text-5xl font-bold tabular-nums text-transparent sm:text-6xl">
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
