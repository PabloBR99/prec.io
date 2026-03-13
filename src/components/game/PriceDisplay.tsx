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
            className={`${FONT_CLASSES} w-40 border-b-2 border-accent/30 bg-transparent text-center text-foreground outline-none ring-0 focus:border-accent/50 focus:outline-none focus:ring-0 focus-visible:outline-none sm:w-48`}
            style={{ caretColor: "var(--color-accent)" }}
            autoComplete="off"
          />
          <span className={`${FONT_CLASSES} ml-1.5 bg-gradient-to-br from-foreground via-foreground/90 to-accent bg-clip-text text-transparent`}>
            &euro;
          </span>
        </div>
      </div>
    );
  }

  const editable = onChange && !disabled;

  return (
    <div
      className={`relative text-center ${editable ? "cursor-text group" : ""}`}
      onClick={startEditing}
    >
      {/* Subtle glow behind price */}
      <div className="absolute inset-0 mx-auto h-full w-3/4 rounded-full bg-accent/[0.06] blur-2xl" />
      <span
        className={`relative bg-gradient-to-br from-foreground via-foreground/90 to-accent bg-clip-text ${FONT_CLASSES} text-transparent`}
      >
        {display}
      </span>
      {editable && (
        <div className="mt-1.5 flex justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-3.5 w-3.5 text-foreground/25 transition-colors group-hover:text-accent/60">
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L3.05 10.476a1.75 1.75 0 0 0-.46.84l-.46 2.3a.75.75 0 0 0 .882.882l2.3-.46a1.75 1.75 0 0 0 .84-.46l7.963-7.963a1.75 1.75 0 0 0 0-2.475l-.627-.627ZM11.72 3.22a.25.25 0 0 1 .354 0l.627.627a.25.25 0 0 1 0 .354L5.738 11.164a.25.25 0 0 1-.12.066l-1.34.268.268-1.34a.25.25 0 0 1 .066-.12L11.72 3.22Z" />
          </svg>
        </div>
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
