"use client";

import { useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants";

interface PriceDisplayProps {
  readonly value: number;
  readonly onChange?: (value: number) => void;
  readonly disabled?: boolean;
}

const FONT_CLASSES =
  "font-[family-name:var(--font-space-grotesk)] text-5xl font-bold tabular-nums sm:text-6xl";

export function PriceDisplay({ value, onChange, disabled }: PriceDisplayProps) {
  const spring = useSpring(value, { stiffness: 50000, damping: 2000 });
  const [display, setDisplay] = useState(formatEuro(value));
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) spring.set(value);
  }, [value, spring, isEditing]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (!isEditing) {
        setDisplay(formatEuro(Math.max(0, Math.min(100, v))));
      }
    });
    return unsubscribe;
  }, [spring, isEditing]);

  const startEditing = () => {
    if (!onChange || disabled) return;
    setEditValue(value === 0 ? "" : value.toFixed(2).replace(".", ","));
    setIsEditing(true);
  };

  const commit = () => {
    const normalized = editValue.replace(",", ".");
    const parsed = parseFloat(normalized);
    if (!isNaN(parsed) && parsed >= 0 && onChange) {
      onChange(
        Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(parsed * 100) / 100))
      );
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <div className="relative text-center">
        <div className="absolute inset-0 mx-auto h-full w-3/4 rounded-full bg-accent/[0.06] blur-2xl" />
        <div className="relative inline-flex items-baseline justify-center">
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            value={editValue}
            placeholder="0,00"
            onChange={(e) => {
              if (/^[0-9]*[,.]?[0-9]{0,2}$/.test(e.target.value)) {
                setEditValue(e.target.value);
              }
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit();
              if (e.key === "Escape") setIsEditing(false);
            }}
            className={`${FONT_CLASSES} w-40 border-b-2 border-accent/30 bg-transparent text-center text-foreground outline-none focus:outline-none focus-visible:outline-none sm:w-48`}
            style={{ caretColor: "var(--color-accent)" }}
          />
          <span className={`${FONT_CLASSES} ml-1.5 bg-gradient-to-br from-foreground via-foreground/90 to-accent bg-clip-text text-transparent`}>
            &euro;
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative text-center ${onChange && !disabled ? "cursor-text" : ""}`}
      onClick={startEditing}
    >
      {/* Subtle glow behind price */}
      <div className="absolute inset-0 mx-auto h-full w-3/4 rounded-full bg-accent/[0.06] blur-2xl" />
      <span
        className={`relative bg-gradient-to-br from-foreground via-foreground/90 to-accent bg-clip-text ${FONT_CLASSES} text-transparent`}
      >
        {display}
      </span>
      {onChange && !disabled && (
        <p className="mt-1 text-[10px] font-medium text-foreground/20">
          toca el precio para escribir
        </p>
      )}
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
