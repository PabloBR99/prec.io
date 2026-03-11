"use client";

import { useAnimationSequence } from "@/hooks/useAnimationSequence";
import { PriceReveal } from "./PriceReveal";
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

const STEP_DELAYS = [400, 1600, 800, 600, 800, 400] as const;

export function ResultContainer({ result, date }: ResultContainerProps) {
  const step = useAnimationSequence(6, STEP_DELAYS);

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <PriceReveal realPrice={result.realPrice} visible={step >= 0} />
      <ErrorGauge
        errorPct={result.errorPct}
        errorLevel={result.errorLevel}
        visible={step >= 1}
      />
      <ErrorSummary
        guess={result.guess}
        realPrice={result.realPrice}
        errorAbs={result.errorAbs}
        errorPct={result.errorPct}
        errorLevel={result.errorLevel}
        visible={step >= 2}
      />
      <PercentileDisplay percentile={result.percentile} visible={step >= 3} />
      <ShareButton
        date={date}
        errorPct={result.errorPct}
        percentile={result.percentile}
        visible={step >= 4}
      />
      <Countdown visible={step >= 5} />
    </div>
  );
}
