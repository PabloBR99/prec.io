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
    <div className="flex items-center gap-1">
      <input
        type="text"
        inputMode="decimal"
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        disabled={disabled}
        className="w-24 rounded-lg border border-foreground/[0.08] bg-surface px-3 py-2 text-center text-lg font-semibold text-foreground shadow-sm outline-none transition-all focus:border-accent focus:shadow-md focus:shadow-accent/10"
        aria-label="Introduce el precio manualmente"
      />
      <span className="text-lg font-semibold text-foreground/60">&euro;</span>
    </div>
  );
}
