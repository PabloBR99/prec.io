"use client";

import { useState, useEffect } from "react";

export function useAnimationSequence(
  stepCount: number,
  delays: readonly number[]
): number {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    let mounted = true;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    let accumulated = 0;
    for (let i = 0; i < stepCount; i++) {
      accumulated += delays[i] ?? 400;
      const step = i;
      timeouts.push(
        setTimeout(() => {
          if (mounted) setCurrentStep(step);
        }, accumulated)
      );
    }

    return () => {
      mounted = false;
      timeouts.forEach(clearTimeout);
    };
  }, [stepCount, delays]);

  return currentStep;
}
