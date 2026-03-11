"use client";

import { useCountdown } from "@/hooks/useCountdown";
import { motion } from "framer-motion";

interface CountdownProps {
  readonly visible: boolean;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function Countdown({ visible }: CountdownProps) {
  const { hours, minutes, seconds } = useCountdown();

  if (!visible) return null;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const segments = [
    { value: pad(hours), label: "horas" },
    { value: pad(minutes), label: "min" },
    { value: pad(seconds), label: "seg" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col items-center gap-3"
    >
      <motion.div
        variants={item}
        className="flex items-center gap-1.5 text-foreground/50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-xs font-medium tracking-wide uppercase">
          Siguiente producto en
        </span>
      </motion.div>

      <div className="flex items-start gap-2">
        {segments.map((seg, i) => (
          <div key={seg.label} className="flex items-start gap-2">
            {i > 0 && (
              <motion.span
                variants={item}
                className="mt-2 text-lg font-light text-foreground/15"
              >
                :
              </motion.span>
            )}
            <motion.div
              variants={item}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex min-w-[3.25rem] items-center justify-center rounded-xl bg-surface px-3 py-2 shadow-sm ring-1 ring-foreground/[0.06]">
                <span className="text-xl font-bold tabular-nums text-foreground">
                  {seg.value}
                </span>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/50">
                {seg.label}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
