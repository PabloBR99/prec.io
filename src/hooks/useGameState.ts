"use client";

import { useState, useEffect, useCallback } from "react";
import { getGameDate } from "@/lib/game/date-utils";
import { getErrorLevel } from "@/lib/game/calculations";
import { fetchTodayProduct, submitGuess } from "@/lib/api/client";
import { STORAGE_KEY_PREFIX, SESSION_ID_KEY } from "@/lib/constants";
import type { GamePhase, Product, GameResult, StoredGameState } from "@/types/game";

function getStorageKey(date: string): string {
  return `${STORAGE_KEY_PREFIX}-${date}`;
}

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    const raw = `${navigator.userAgent}-${screen.width}x${screen.height}-${Intl.DateTimeFormat().resolvedOptions().timeZone}-${crypto.randomUUID()}`;
    id = raw;
    localStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
}

function loadStoredState(date: string): StoredGameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(getStorageKey(date));
    return raw ? (JSON.parse(raw) as StoredGameState) : null;
  } catch {
    return null;
  }
}

function saveState(state: StoredGameState): void {
  try {
    localStorage.setItem(getStorageKey(state.date), JSON.stringify(state));
  } catch {
    // localStorage unavailable
  }
}

interface UseGameStateOptions {
  readonly serverProduct?: Product;
  readonly dateOverride?: string;
  readonly devMode?: boolean;
}

export function useGameState(options: UseGameStateOptions = {}) {
  const { serverProduct, dateOverride, devMode = false } = options;

  const currentDate = dateOverride ?? getGameDate();

  const [phase, setPhase] = useState<GamePhase>(() => {
    if (serverProduct && !devMode) return "playing";
    return "loading";
  });
  const [product, setProduct] = useState<Product | null>(serverProduct ?? null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check localStorage for stored result (production) or fetch product (dev)
  useEffect(() => {
    if (devMode) {
      // Dev mode: always fetch by date
      setPhase("loading");
      setProduct(null);
      setResult(null);
      setError(null);

      fetchTodayProduct(currentDate)
        .then((p) => {
          setProduct(p);
          setPhase("playing");
        })
        .catch(() => {
          setError("No se pudo cargar el producto");
        });
      return;
    }

    // Production: check stored state
    const stored = loadStoredState(currentDate);
    if (stored) {
      setResult(stored.result);
      setPhase("completed");
    }

    // If no server product, fetch client-side as fallback
    if (!serverProduct) {
      fetchTodayProduct()
        .then((p) => {
          setProduct(p);
          if (!stored) setPhase("playing");
        })
        .catch(() => {
          setError("No se pudo cargar el producto de hoy");
        });
    }
  }, [currentDate, devMode, serverProduct]);

  const handleGuess = useCallback(
    async (guess: number) => {
      if (!product || isSubmitting) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const sessionId = getSessionId();
        const response = await submitGuess({
          date: currentDate,
          guess,
          sessionId,
        });

        const gameResult: GameResult = {
          realPrice: response.realPrice,
          guess,
          errorAbs: response.errorAbs,
          errorPct: response.errorPct,
          percentile: response.percentile,
          errorLevel: getErrorLevel(response.errorPct),
        };

        setResult(gameResult);
        setPhase("completed");

        if (!devMode) {
          saveState({ date: currentDate, guess, result: gameResult });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al enviar tu estimación"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [product, isSubmitting, currentDate, devMode]
  );

  return { phase, product, result, error, isSubmitting, handleGuess } as const;
}
