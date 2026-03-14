"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { fetchPercentile } from "@/lib/api/client";
import { Confetti } from "./Confetti";
import { PriceCompact } from "./PriceCompact";
import { BellCurve } from "./BellCurve";
import { ShareButton } from "./ShareButton";
import { Countdown } from "./Countdown";
import type { GameResult } from "@/types/game";

interface ResultContainerProps {
  readonly result: GameResult;
  readonly date: string;
}

// Flow: curve+ranking → prices → share+countdown
const STEP_DELAYS = [300, 400, 400] as const;
const POLL_INTERVAL = 30_000;

export function ResultContainer({ result, date }: ResultContainerProps) {
  const step = useAnimationSequence(3, STEP_DELAYS);
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

  useEffect(() => {
    const id = setTimeout(() => {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
    return () => clearTimeout(id);
  }, []);

  const isPerfect = result.errorPct === 0;

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-4">
      {isPerfect && <Confetti visible={step >= 0} />}

      {/* ── Bell curve with ranking text ── */}
      <BellCurve percentile={percentile} visible={step >= 0} />

      {/* ── Prices ── */}
      <PriceCompact
        realPrice={result.realPrice}
        guess={result.guess}
        errorLevel={result.errorLevel}
        visible={step >= 1}
      />

      {/* ── Subtle divider ── */}
      <div className="h-px w-3/4 max-w-xs bg-foreground/[0.06]" />

      {/* ── Share + Countdown ── */}
      <motion.div
        initial={false}
        animate={step >= 2 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-col items-center gap-2"
      >
        <ShareButton
          date={date}
          errorPct={result.errorPct}
          percentile={percentile}
          visible={step >= 2}
        />
        <Countdown visible={step >= 2} />
      </motion.div>
    </div>
  );
}
