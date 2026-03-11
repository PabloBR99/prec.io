"use client";

import { useState, useEffect } from "react";
import { getNextMidnight } from "@/lib/game/date-utils";

interface CountdownTime {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

export function useCountdown(): CountdownTime {
  const [time, setTime] = useState<CountdownTime>(() => calculate());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(calculate());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
}

function calculate(): CountdownTime {
  const now = new Date();
  const target = getNextMidnight();
  const diffMs = Math.max(0, target.getTime() - now.getTime());

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}
