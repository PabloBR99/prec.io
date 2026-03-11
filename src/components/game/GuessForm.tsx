"use client";

import { useState } from "react";
import { PriceSlider } from "./PriceSlider";
import { PriceInput } from "./PriceInput";
import { PriceDisplay } from "./PriceDisplay";
import { ConfirmButton } from "./ConfirmButton";
import { PRICE_DEFAULT } from "@/lib/constants";

interface GuessFormProps {
  readonly onSubmit: (guess: number) => void;
  readonly isSubmitting: boolean;
}

export function GuessForm({ onSubmit, isSubmitting }: GuessFormProps) {
  const [price, setPrice] = useState(PRICE_DEFAULT);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleChange = (value: number) => {
    setPrice(value);
    if (!hasInteracted) setHasInteracted(true);
  };

  const handleConfirm = () => {
    if (hasInteracted && !isSubmitting) {
      onSubmit(Math.round(price * 100) / 100);
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <PriceDisplay value={price} />
      <PriceSlider value={price} onChange={handleChange} disabled={isSubmitting} />
      <div className="flex items-center gap-2">
        <span className="text-sm text-foreground/40">o escribe:</span>
        <PriceInput value={price} onChange={handleChange} disabled={isSubmitting} />
      </div>
      <ConfirmButton
        onClick={handleConfirm}
        disabled={!hasInteracted}
        isLoading={isSubmitting}
      />
    </div>
  );
}
