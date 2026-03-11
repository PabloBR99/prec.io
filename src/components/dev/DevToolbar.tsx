"use client";

import { useState, useEffect } from "react";
import { fetchDevDates } from "@/lib/api/client";

interface DevToolbarProps {
  readonly currentDate: string;
  readonly onDateChange: (date: string) => void;
}

export function DevToolbar({ currentDate, onDateChange }: DevToolbarProps) {
  const [dates, setDates] = useState<readonly string[]>([]);

  useEffect(() => {
    fetchDevDates().then(setDates);
  }, []);

  if (dates.length === 0) return null;

  const currentIndex = dates.indexOf(currentDate);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < dates.length - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-yellow-500/30 bg-yellow-950/90 px-4 py-2 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <span className="text-xs font-medium text-yellow-400">DEV</span>
        <button
          onClick={() => hasPrev && onDateChange(dates[currentIndex - 1])}
          disabled={!hasPrev}
          className="rounded px-3 py-1 text-sm font-medium text-yellow-200 transition-colors hover:bg-yellow-800/50 disabled:opacity-30"
        >
          &larr; Anterior
        </button>
        <span className="min-w-[140px] text-center text-sm tabular-nums text-yellow-100">
          {currentDate} ({currentIndex + 1}/{dates.length})
        </span>
        <button
          onClick={() => hasNext && onDateChange(dates[currentIndex + 1])}
          disabled={!hasNext}
          className="rounded px-3 py-1 text-sm font-medium text-yellow-200 transition-colors hover:bg-yellow-800/50 disabled:opacity-30"
        >
          Siguiente &rarr;
        </button>
      </div>
    </div>
  );
}
