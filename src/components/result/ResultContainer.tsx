"use client";

import { useState, useEffect } from "react";
import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { fetchPercentile } from "@/lib/api/client";
import { PriceReveal } from "./PriceReveal";
import { Confetti } from "./Confetti";
import { ErrorGauge } from "./ErrorGauge";
import { ErrorSummary } from "./ErrorSummary";
import { PercentileDisplay } from "./PercentileDisplay";
import { ShareButton } from "./ShareButton";
import { Countdown } from "./Countdown";
import type { GameResult } from "@/types/game";

interface ResultContainerProps {
  readonly result: GameResult;
  readonly date: string;
}

const STEP_DELAYS = [300, 800, 600, 500, 500, 400] as const;
const POLL_INTERVAL = 30_000;

export function ResultContainer({ result, date }: ResultContainerProps) {
  const step = useAnimationSequence(6, STEP_DELAYS);
  const [percentile, setPercentile] = useState(result.percentile);

  useEffect(() => {
    const poll = () => {
      fetchPercentile(result.errorPct, date).then(setPercentile).catch(() => {});
    };

    poll();
    const id = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [result.errorPct, date]);

  const isPerfect = result.errorPct === 0;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {isPerfect && <Confetti visible={step >= 1} />}
      <div className="flex w-full flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-12">
        <div className="flex flex-col items-center gap-4 md:flex-1">
          <PriceReveal realPrice={result.realPrice} visible={step >= 0} />
          <ErrorGauge
            errorPct={result.errorPct}
            visible={step >= 1}
          />
        </div>
        <div className="flex flex-col items-center gap-6 md:flex-1">
          <ErrorSummary
            guess={result.guess}
            realPrice={result.realPrice}
            errorAbs={result.errorAbs}
            errorPct={result.errorPct}
            errorLevel={result.errorLevel}
            visible={step >= 2}
          />
          <PercentileDisplay percentile={percentile} visible={step >= 3} />
        </div>
      </div>
      <div className="mt-4" />
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
