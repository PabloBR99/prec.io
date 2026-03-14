"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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
  const triggerHaptic = useHaptic();
  const priceRef = useRef(price);
  priceRef.current = price;

  const handleChange = useCallback((value: number) => {
    setPrice(value);
  }, []);

  const handleConfirm = () => {
    if (!isSubmitting) {
      onSubmit(Math.round(price * 100) / 100);
    }
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (isSubmitting) return;
    const direction = e.deltaY < 0 ? 1 : -1;
    const currentPos = priceToPosition(price);
    const newPos = Math.max(0, Math.min(INTERNAL_MAX, currentPos + direction * SCROLL_POSITION_STEP));
    let newPrice = positionToPrice(newPos);
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
      <div className="flex items-center gap-4 sm:gap-6">
        <StepperButton
          direction="down"
          priceRef={priceRef}
          onChange={handleChange}
          disabled={isSubmitting || price <= 0}
        />
        <PriceDisplay value={price} onChange={handleChange} disabled={isSubmitting} />
        <StepperButton
          direction="up"
          priceRef={priceRef}
          onChange={handleChange}
          disabled={isSubmitting || price >= PRICE_MAX}
        />
      </div>
      <PriceSlider value={price} onChange={handleChange} disabled={isSubmitting} />
      <ConfirmButton
        onClick={handleConfirm}
        disabled={false}
        isLoading={isSubmitting}
      />
    </div>
  );
}

/* ── Kinematic stepper — RAF continuous model with acceleration ─── *
 *                                                                    *
 *  Tap         → single +0.01€ step                                  *
 *  Hold 350ms+ → continuous mode kicks in:                           *
 *    velocity(t) = V₀·eᵏᵗ         (exponential ramp)                *
 *    displacement(t) = V₀/k·(eᵏᵗ-1) (integral → smooth position)   *
 *    target = startPrice + sign·displacement(t)                      *
 *    snapped to appropriate grid based on instantaneous velocity     *
 * ────────────────────────────────────────────────────────────────── */

const V0 = 0.3;        // initial velocity after dead zone (€/s)
const K = 0.45;         // exponential acceleration rate
const DEAD_ZONE = 350;  // ms — distinguishes tap from hold

function displacement(t: number): number {
  return (V0 / K) * (Math.exp(K * t) - 1);
}

function velocityAt(t: number): number {
  return V0 * Math.exp(K * t);
}

// Snap to 1-2-5 series grid proportional to velocity
function snapToGrid(value: number, vel: number): number {
  const raw = Math.max(0.01, vel * 0.04);
  const exp = Math.pow(10, Math.floor(Math.log10(raw)));
  const frac = raw / exp;
  const nice = frac < 1.5 ? 1 : frac < 3.5 ? 2 : 5;
  const grid = nice * exp;
  return Math.round(value / grid) * grid;
}

interface StepperButtonProps {
  readonly direction: "up" | "down";
  readonly priceRef: React.RefObject<number>;
  readonly onChange: (value: number) => void;
  readonly disabled: boolean;
}

function StepperButton({ direction, priceRef, onChange, disabled }: StepperButtonProps) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const rafRef = useRef(0);
  const holdStartRef = useRef(0);
  const startPriceRef = useRef(0);
  const deadZoneRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const activeRef = useRef(false);

  const sign = direction === "up" ? 1 : -1;

  const stop = useCallback(() => {
    activeRef.current = false;
    cancelAnimationFrame(rafRef.current);
    if (deadZoneRef.current) clearTimeout(deadZoneRef.current);
  }, []);

  const loop = useCallback(() => {
    if (!activeRef.current) return;

    const elapsed = (performance.now() - holdStartRef.current) / 1000;
    const rawTarget = startPriceRef.current + sign * displacement(elapsed);
    const vel = velocityAt(elapsed);
    const snapped = snapToGrid(rawTarget, vel);
    const clamped = Math.round(Math.max(0, Math.min(PRICE_MAX, snapped)) * 100) / 100;

    onChangeRef.current(clamped);

    // Stop at boundaries
    if ((sign > 0 && clamped >= PRICE_MAX) || (sign < 0 && clamped <= 0)) {
      activeRef.current = false;
      return;
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [sign]);

  const startHold = useCallback(() => {
    startPriceRef.current = priceRef.current;
    holdStartRef.current = performance.now();
    activeRef.current = true;
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, priceRef]);

  const start = useCallback(() => {
    if (disabled) return;
    // Immediate single-cent tap
    const tap = Math.round(Math.max(0, Math.min(PRICE_MAX, priceRef.current + sign * 0.01)) * 100) / 100;
    onChangeRef.current(tap);
    // After dead zone, begin continuous kinematic acceleration
    deadZoneRef.current = setTimeout(startHold, DEAD_ZONE);
  }, [disabled, sign, startHold, priceRef]);

  useEffect(() => stop, [stop]);

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      onContextMenu={(e) => e.preventDefault()}
      disabled={disabled}
      aria-label={direction === "up" ? "Subir precio" : "Bajar precio"}
      className="flex h-11 w-11 shrink-0 touch-none select-none items-center justify-center rounded-full bg-accent/10 ring-1 ring-accent/20 text-xl font-medium text-accent/70 transition-all hover:bg-accent/15 hover:text-accent hover:ring-accent/30 active:scale-90 active:bg-accent/25 active:text-accent active:ring-accent/40 disabled:pointer-events-none disabled:opacity-30"
    >
      {direction === "up" ? "+" : "\u2212"}
    </button>
  );
}
