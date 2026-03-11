"use client";

import { useGameState } from "@/hooks/useGameState";
import { ProductCard } from "./ProductCard";
import { GuessForm } from "./GuessForm";
import { ResultContainer } from "@/components/result/ResultContainer";
import { getGameDate } from "@/lib/game/date-utils";

export function GameContainer() {
  const { phase, product, result, error, isSubmitting, handleGuess } =
    useGameState();

  if (error && !product) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-lg text-foreground/60">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (phase === "loading" || !product) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <ProductCard product={product} />

      {phase === "playing" && (
        <>
          <div className="w-full max-w-md">
            <p className="mb-4 text-center text-sm text-foreground/50">
              ¿Cuanto crees que cuesta?
            </p>
            <GuessForm onSubmit={handleGuess} isSubmitting={isSubmitting} />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </>
      )}

      {phase === "completed" && result && (
        <ResultContainer result={result} date={getGameDate()} />
      )}
    </div>
  );
}
