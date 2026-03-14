"use client";

import { useHaptic } from "@/hooks/useHaptic";
import { PRICE_MAX } from "@/lib/constants";

interface PriceSliderProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly disabled?: boolean;
}

export const EXPONENT = 3;
export const INTERNAL_MAX = 1000;

export function priceToPosition(price: number): number {
  const clamped = Math.max(0, Math.min(PRICE_MAX, price));
  return Math.round(Math.pow(clamped / PRICE_MAX, 1 / EXPONENT) * INTERNAL_MAX);
}

export function positionToPrice(position: number): number {
  const clamped = Math.max(0, Math.min(INTERNAL_MAX, position));
  const raw = Math.pow(clamped / INTERNAL_MAX, EXPONENT) * PRICE_MAX;
  return Math.round(raw * 100) / 100;
}

const TICK_EUROS = [0, 1, 5, 25, 100];

export function PriceSlider({ value, onChange, disabled }: PriceSliderProps) {
  const triggerHaptic = useHaptic();
  const position = priceToPosition(value);
  const percentage = (position / INTERNAL_MAX) * 100;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pos = parseInt(e.target.value);
    onChange(positionToPrice(pos));
    triggerHaptic(10);
  };

  return (
    <div className="w-full px-4">
      <div className="relative pb-8">
        <input
          type="range"
          min={0}
          max={INTERNAL_MAX}
          step={1}
          value={position}
          onChange={handleInput}
          disabled={disabled}
          className="slider-input w-full"
          aria-label="Selector de precio"
        />
        {/* Tick marks — offset by half thumb width (12px) to match native range behavior */}
        <div className="pointer-events-none absolute top-[18px]" style={{ left: 12, right: 12 }}>
          {TICK_EUROS.map((euro) => {
            const tickPct = (priceToPosition(euro) / INTERNAL_MAX) * 100;
            const near = Math.abs(tickPct - percentage) < 3;
            return (
              <div
                key={euro}
                className="absolute flex flex-col items-center"
                style={{ left: `${tickPct}%`, transform: "translateX(-50%)" }}
              >
                <div className="h-2.5 w-px bg-foreground/25 transition-opacity duration-150" style={{ opacity: near ? 0 : 1 }} />
                <span className="mt-1 text-[10px] font-medium text-foreground/50">
                  {euro}€
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .slider-input {
          -webkit-appearance: none;
          appearance: none;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(
            to right,
            var(--color-accent) 0%,
            var(--color-accent) ${percentage}%,
            rgba(0, 0, 0, 0.08) ${percentage}%,
            rgba(0, 0, 0, 0.08) 100%
          );
          outline: none;
          cursor: pointer;
        }
        .slider-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .slider-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 3px solid var(--color-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.12);
        }
        .slider-input::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        .slider-input::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--color-accent);
          border: 3px solid var(--color-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
