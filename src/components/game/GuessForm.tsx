"use client";

import { useState, useCallback } from "react";
import { PriceSlider, priceToPosition, positionToPrice, INTERNAL_MAX } from "./PriceSlider";
import { PriceDisplay } from "./PriceDisplay";
import { ConfirmButton } from "./ConfirmButton";
import { useHaptic } from "@/hooks/useHaptic";
import { PRICE_DEFAULT, PRICE_MAX } from "@/lib/constants";

interface GuessFormProps {
  readonly onSubmit: (guess: number) => void;
  readonly isSubmitting: boolean;
}

const SCROLL_POSITION_STEP = 10;
const MIN_PRICE_STEP = 0.01;

export function GuessForm({ onSubmit, isSubmitting }: GuessFormProps) {
  const [price, setPrice] = useState(PRICE_DEFAULT);
  const [hasInteracted, setHasInteracted] = useState(false);
  const triggerHaptic = useHaptic();

  const handleChange = useCallback((value: number) => {
    setPrice(value);
    setHasInteracted(true);
  }, []);

  const handleConfirm = () => {
    if (hasInteracted && !isSubmitting) {
      onSubmit(Math.round(price * 100) / 100);
    }
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isSubmitting) return;
    const direction = e.deltaY < 0 ? 1 : -1;
    const currentPos = priceToPosition(price);
    const newPos = Math.max(0, Math.min(INTERNAL_MAX, currentPos + direction * SCROLL_POSITION_STEP));
    let newPrice = positionToPrice(newPos);
    // At low prices, position steps round to the same value — use minimum step
    if (newPrice === price) {
      newPrice = Math.round(Math.max(0, Math.min(PRICE_MAX, price + direction * MIN_PRICE_STEP)) * 100) / 100;
    }
    if (newPrice !== price) {
      handleChange(newPrice);
      triggerHaptic(10);
    }
  }, [price, isSubmitting, handleChange, triggerHaptic]);

  return (
    <div onWheel={handleWheel} className="flex w-full flex-col items-center gap-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
        ¿Cuánto cuesta?
      </p>
      <PriceDisplay value={price} onChange={handleChange} disabled={isSubmitting} />
      <PriceSlider value={price} onChange={handleChange} disabled={isSubmitting} />
      <ConfirmButton
        onClick={handleConfirm}
        disabled={!hasInteracted}
        isLoading={isSubmitting}
      />
    </div>
  );
}
