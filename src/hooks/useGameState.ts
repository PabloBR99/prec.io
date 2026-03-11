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

export function useGameState() {
  const [phase, setPhase] = useState<GamePhase>("loading");
  const [product, setProduct] = useState<Product | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const date = getGameDate();
    const stored = loadStoredState(date);

    if (stored) {
      setResult(stored.result);
      setPhase("completed");
    }

    fetchTodayProduct()
      .then((p) => {
        const img = new window.Image();
        img.src = p.imagen_url;
        img.onload = () => {
          setProduct(p);
          if (!stored) setPhase("playing");
        };
        img.onerror = () => {
          setProduct(p);
          if (!stored) setPhase("playing");
        };
      })
      .catch(() => {
        setError("No se pudo cargar el producto de hoy");
      });
  }, []);

  const handleGuess = useCallback(
    async (guess: number) => {
      if (!product || isSubmitting) return;

      setIsSubmitting(true);
      setError(null);

      try {
        const date = getGameDate();
        const sessionId = getSessionId();
        const response = await submitGuess({ date, guess, sessionId });

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

        saveState({ date, guess, result: gameResult });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al enviar tu estimación"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [product, isSubmitting]
  );

  return { phase, product, result, error, isSubmitting, handleGuess } as const;
}
