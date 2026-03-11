"use client";

import { useHaptic } from "@/hooks/useHaptic";
import { PRICE_MAX } from "@/lib/constants";

interface PriceSliderProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly disabled?: boolean;
}

export const EXPONENT = 2.5;
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

const TICK_EUROS = [0, 5, 20, 50, 100];

// Interpolate the gradient color at a given percentage
function getColorAtPercent(pct: number): string {
  const stops = [
    { p: 0, r: 14, g: 173, b: 105 },
    { p: 25, r: 163, g: 213, b: 80 },
    { p: 50, r: 244, g: 162, b: 97 },
    { p: 100, r: 230, g: 57, b: 70 },
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (pct >= stops[i].p && pct <= stops[i + 1].p) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const t = hi.p === lo.p ? 0 : (pct - lo.p) / (hi.p - lo.p);
  const r = Math.round(lo.r + (hi.r - lo.r) * t);
  const g = Math.round(lo.g + (hi.g - lo.g) * t);
  const b = Math.round(lo.b + (hi.b - lo.b) * t);
  return `rgb(${r},${g},${b})`;
}

export function PriceSlider({ value, onChange, disabled }: PriceSliderProps) {
  const triggerHaptic = useHaptic();
  const position = priceToPosition(value);
  const percentage = (position / INTERNAL_MAX) * 100;
  const thumbColor = getColorAtPercent(percentage);

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
        {/* Tick marks — offset by half thumb width (15px) to match native range behavior */}
        <div className="pointer-events-none absolute top-[20px]" style={{ left: 15, right: 15 }}>
          {TICK_EUROS.map((euro) => {
            const pct = (priceToPosition(euro) / INTERNAL_MAX) * 100;
            return (
              <div
                key={euro}
                className="absolute flex flex-col items-center"
                style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
              >
                <div className="h-2.5 w-px bg-foreground/25" />
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
          height: 10px;
          border-radius: 5px;
          background: linear-gradient(
            to right,
            #0ead69 0%,
            #a3d550 25%,
            #f4a261 50%,
            #e63946 100%
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
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: ${thumbColor};
          border: 3px solid var(--color-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05);
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .slider-input::-webkit-slider-thumb:hover {
          transform: scale(1.12);
        }
        .slider-input::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        .slider-input::-moz-range-thumb {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: ${thumbColor};
          border: 3px solid var(--color-surface);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
