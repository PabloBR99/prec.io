"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { fetchPercentile } from "@/lib/api/client";
import { PriceReveal } from "./PriceReveal";
import { Confetti } from "./Confetti";
import { BellCurve } from "./BellCurve";
import { ErrorSummary } from "./ErrorSummary";
import { PercentileDisplay } from "./PercentileDisplay";
import { ShareButton } from "./ShareButton";
import { Countdown } from "./Countdown";
import type { GameResult } from "@/types/game";

interface ResultContainerProps {
  readonly result: GameResult;
  readonly date: string;
  readonly productCreatedAt: string;
}

// Flow: price → error → bell curve → percentile → share → countdown
const STEP_DELAYS = [300, 500, 500, 500, 400, 300] as const;
const POLL_INTERVAL = 30_000;

export function ResultContainer({ result, date, productCreatedAt }: ResultContainerProps) {
  const step = useAnimationSequence(6, STEP_DELAYS);
  const [percentile, setPercentile] = useState(result.percentile);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const poll = () => {
      fetchPercentile(result.errorPct, date).then(setPercentile).catch(() => {});
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [result.errorPct, date]);

  // Scroll to results on mount
  useEffect(() => {
    const id = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(id);
  }, []);

  const isPerfect = result.errorPct === 0;

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-5">
      {isPerfect && <Confetti visible={step >= 1} />}

      {/* Unified results card */}
      <div className="w-full overflow-hidden rounded-2xl bg-surface/80 shadow-sm ring-1 ring-foreground/[0.06] backdrop-blur-sm">
        {/* Top row: Price + Error — split with vertical divider */}
        <div className="grid grid-cols-2 divide-x divide-foreground/[0.08]">
          <div className="flex items-start justify-center px-4 py-5">
            <PriceReveal realPrice={result.realPrice} createdAt={productCreatedAt} visible={step >= 0} />
          </div>
          <div className="flex items-start justify-center px-4 py-5">
            <ErrorSummary
              guess={result.guess}
              realPrice={result.realPrice}
              errorLevel={result.errorLevel}
              visible={step >= 1}
            />
          </div>
        </div>
        {/* Horizontal divider */}
        <div className="h-px bg-foreground/[0.08]" />
        {/* Bell curve + Percentile — unified block with subtle tint */}
        <div className="flex flex-col items-center gap-1 bg-foreground/[0.015] px-4 pb-5 pt-2">
          <BellCurve percentile={percentile} visible={step >= 2} />
          <PercentileDisplay percentile={percentile} visible={step >= 3} />
        </div>
      </div>

      {/* Separator before share section */}
      <motion.div
        initial={false}
        animate={step >= 4 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full items-center gap-3"
      >
        <div className="h-px flex-1 bg-foreground/[0.08]" />
        <span className="text-[10px] font-semibold uppercase tracking-widest text-foreground/30">Comparte</span>
        <div className="h-px flex-1 bg-foreground/[0.08]" />
      </motion.div>
      <ShareButton
        date={date}
        errorPct={result.errorPct}
        percentile={percentile}
        visible={step >= 4}
      />
      <Countdown visible={step >= 5} />
    </div>
  );
}
