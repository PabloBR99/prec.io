"use client";

import { motion } from "framer-motion";
import { ERROR_COLORS } from "@/lib/constants";
import type { ErrorLevel } from "@/types/game";

interface ErrorGaugeProps {
  readonly errorPct: number;
  readonly errorLevel: ErrorLevel;
  readonly visible: boolean;
}

const GAUGE_RADIUS = 80;
const GAUGE_STROKE = 12;
const CENTER_X = 100;
const CENTER_Y = 90;

export function ErrorGauge({ errorPct, errorLevel, visible }: ErrorGaugeProps) {
  if (!visible) return null;

  // Clamp error to 0-100 for display
  const clampedError = Math.min(100, Math.max(0, errorPct));
  const angle = (clampedError / 100) * 180;
  const circumference = Math.PI * GAUGE_RADIUS;
  const fillLength = (clampedError / 100) * circumference;
  const color = ERROR_COLORS[errorLevel];

  // Needle endpoint
  const needleAngle = ((180 - angle) * Math.PI) / 180;
  const needleX = CENTER_X + (GAUGE_RADIUS - 10) * Math.cos(needleAngle);
  const needleY = CENTER_Y - (GAUGE_RADIUS - 10) * Math.sin(needleAngle);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 12 }}
      className="flex justify-center"
    >
      <svg viewBox="0 0 200 110" className="w-full max-w-[280px]">
        {/* Background arc */}
        <path
          d={describeArc(CENTER_X, CENTER_Y, GAUGE_RADIUS, 180, 0)}
          fill="none"
          stroke="currentColor"
          strokeWidth={GAUGE_STROKE}
          className="text-foreground/10"
          strokeLinecap="round"
        />
        {/* Colored fill arc */}
        <motion.path
          d={describeArc(CENTER_X, CENTER_Y, GAUGE_RADIUS, 180, 0)}
          fill="none"
          stroke={color}
          strokeWidth={GAUGE_STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - fillLength }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        {/* Needle */}
        <motion.line
          x1={CENTER_X}
          y1={CENTER_Y}
          x2={needleX}
          y2={needleY}
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        />
        {/* Center dot */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={5} fill={color} />
        {/* Labels */}
        <text x={15} y={105} className="fill-foreground/40 text-[10px]">0%</text>
        <text x={170} y={105} className="fill-foreground/40 text-[10px]">100%</text>
      </svg>
    </motion.div>
  );
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const startRad = (startAngle * Math.PI) / 180;
  const endRad = (endAngle * Math.PI) / 180;
  const startX = cx + r * Math.cos(startRad);
  const startY = cy - r * Math.sin(startRad);
  const endX = cx + r * Math.cos(endRad);
  const endY = cy - r * Math.sin(endRad);
  const largeArc = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  return `M ${startX} ${startY} A ${r} ${r} 0 ${largeArc} 1 ${endX} ${endY}`;
}
