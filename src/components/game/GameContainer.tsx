"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";
import { ProductCard } from "./ProductCard";
import { GuessForm } from "./GuessForm";
import { ResultContainer } from "@/components/result/ResultContainer";
import { DevToolbar } from "@/components/dev/DevToolbar";
import { getGameDate } from "@/lib/game/date-utils";
import type { Product } from "@/types/game";

const fadeIn = {
  hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const IS_DEV = process.env.NODE_ENV === "development";

interface GameContainerProps {
  readonly serverProduct: Product | null;
}

export function GameContainer({ serverProduct }: GameContainerProps) {
  const [devDate, setDevDate] = useState(getGameDate());

  const { phase, product, result, error, isSubmitting, handleGuess } =
    useGameState(
      IS_DEV
        ? { dateOverride: devDate, devMode: true }
        : { serverProduct: serverProduct ?? undefined }
    );

  const currentDate = IS_DEV ? devDate : getGameDate();

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
      <>
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
        {IS_DEV && <DevToolbar currentDate={devDate} onDateChange={setDevDate} />}
      </>
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <motion.div variants={fadeIn} initial="hidden" animate="show" custom={0.1} className="w-[94%] px-2">
        <ProductCard product={product} />
      </motion.div>

      {phase === "playing" && (
        <>
          <motion.div variants={fadeIn} initial="hidden" animate="show" custom={0.35} className="w-full">
            <GuessForm onSubmit={handleGuess} isSubmitting={isSubmitting} />
          </motion.div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </>
      )}

      {phase === "completed" && result && (
        <ResultContainer result={result} date={currentDate} productCreatedAt={product.created_at} />
      )}

      {IS_DEV && <DevToolbar currentDate={devDate} onDateChange={setDevDate} />}
    </div>
  );
}
