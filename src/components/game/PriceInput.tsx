"use client";

import { useState } from "react";
import { PRICE_MIN, PRICE_MAX } from "@/lib/constants";

interface PriceInputProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly disabled?: boolean;
}

export function PriceInput({ value, onChange, disabled }: PriceInputProps) {
  const [inputValue, setInputValue] = useState(formatPrice(value));
  const [isFocused, setIsFocused] = useState(false);

  function formatPrice(n: number): string {
    return n.toFixed(2).replace(".", ",");
  }

  function parsePrice(s: string): number {
    const normalized = s.replace(",", ".");
    const parsed = parseFloat(normalized);
    if (isNaN(parsed)) return value;
    return Math.min(PRICE_MAX, Math.max(PRICE_MIN, Math.round(parsed * 100) / 100));
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (/^[0-9]*[,.]?[0-9]{0,2}$/.test(raw)) {
      setInputValue(raw);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parsePrice(inputValue);
    onChange(parsed);
    setInputValue(formatPrice(parsed));
  };

  const handleFocus = () => {
    setIsFocused(true);
    setInputValue(formatPrice(value));
  };

  if (!isFocused) {
    // Keep in sync with slider
    const display = formatPrice(value);
    if (inputValue !== display) {
      setInputValue(display);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        placeholder="0,00"
        className="w-20 rounded-lg border border-foreground/[0.06] bg-foreground/[0.03] px-2.5 py-1.5 text-center text-sm tabular-nums text-foreground/70 outline-none transition-all focus:border-accent focus:bg-surface focus:text-foreground focus:shadow-sm focus:shadow-accent/10"
        aria-label="Introduce el precio manualmente"
      />
      <span className="text-sm text-foreground/40">&euro;</span>
    </div>
  );
}
