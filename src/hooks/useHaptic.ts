"use client";

import { useCallback, useRef } from "react";

export function useHaptic() {
  const lastTrigger = useRef(0);

  const triggerHaptic = useCallback((duration: number = 10) => {
    const now = Date.now();
    if (now - lastTrigger.current < 50) return;
    lastTrigger.current = now;

    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  }, []);

  return triggerHaptic;
}
