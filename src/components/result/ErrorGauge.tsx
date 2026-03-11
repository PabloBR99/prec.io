"use client";

import { motion, useSpring, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";

interface ErrorGaugeProps {
  readonly errorPct: number;
  readonly visible: boolean;
}

const GAUGE_RADIUS = 80;
const GAUGE_STROKE = 12;
const NEEDLE_LEN = GAUGE_RADIUS - 10;
const CENTER_X = 100;
const CENTER_Y = 90;
const GRADIENT_ID = "gauge-gradient";

function angleToPt(deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: CENTER_X + NEEDLE_LEN * Math.cos(rad),
    y: CENTER_Y - NEEDLE_LEN * Math.sin(rad),
  };
}

export function ErrorGauge({ errorPct, visible }: ErrorGaugeProps) {
  if (!visible) return null;

  const accuracy = Math.max(0, Math.min(100, 100 - errorPct));
  const targetAngle = 180 - (accuracy / 100) * 180; // 180=left(0%), 0=right(100%)
  const circumference = Math.PI * GAUGE_RADIUS;
  const fillLength = (accuracy / 100) * circumference;
  const needleColor = gaugeColorAt(accuracy / 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 12 }}
      className="flex justify-center"
    >
      <svg viewBox="0 0 200 110" className="w-full max-w-[280px]">
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e63946" />
            <stop offset="50%" stopColor="#f4a261" />
            <stop offset="75%" stopColor="#a3d550" />
            <stop offset="100%" stopColor="#0ead69" />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d={describeArc(CENTER_X, CENTER_Y, GAUGE_RADIUS, 180, 0)}
          fill="none"
          stroke="currentColor"
          strokeWidth={GAUGE_STROKE}
          className="text-foreground/10"
          strokeLinecap="round"
        />
        {/* Gradient fill arc */}
        <motion.path
          d={describeArc(CENTER_X, CENTER_Y, GAUGE_RADIUS, 180, 0)}
          fill="none"
          stroke={`url(#${GRADIENT_ID})`}
          strokeWidth={GAUGE_STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - fillLength }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
        {/* Animated needle */}
        <Needle targetAngle={targetAngle} color={needleColor} />
        {/* Center dot */}
        <circle cx={CENTER_X} cy={CENTER_Y} r={5} fill={needleColor} />
        {/* Labels */}
        <text x={15} y={105} className="fill-foreground/40 text-[10px]">0%</text>
        <text x={170} y={105} className="fill-foreground/40 text-[10px]">100%</text>
      </svg>
    </motion.div>
  );
}

function Needle({ targetAngle, color }: { targetAngle: number; color: string }) {
  const spring = useSpring(180, { stiffness: 60, damping: 10 });
  const [pt, setPt] = useState(angleToPt(180));

  useEffect(() => {
    const timer = setTimeout(() => spring.set(targetAngle), 300);
    return () => clearTimeout(timer);
  }, [targetAngle, spring]);

  useMotionValueEvent(spring, "change", (v) => {
    setPt(angleToPt(v));
  });

  return (
    <line
      x1={CENTER_X}
      y1={CENTER_Y}
      x2={pt.x}
      y2={pt.y}
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
    />
  );
}

function gaugeColorAt(t: number): string {
  const stops = [
    { p: 0, r: 230, g: 57, b: 70 },
    { p: 0.5, r: 244, g: 162, b: 97 },
    { p: 0.75, r: 163, g: 213, b: 80 },
    { p: 1, r: 14, g: 173, b: 105 },
  ];
  let lo = stops[0], hi = stops[stops.length - 1];
  for (let i = 0; i < stops.length - 1; i++) {
    if (t >= stops[i].p && t <= stops[i + 1].p) {
      lo = stops[i];
      hi = stops[i + 1];
      break;
    }
  }
  const f = hi.p === lo.p ? 0 : (t - lo.p) / (hi.p - lo.p);
  const r = Math.round(lo.r + (hi.r - lo.r) * f);
  const g = Math.round(lo.g + (hi.g - lo.g) * f);
  const b = Math.round(lo.b + (hi.b - lo.b) * f);
  return `rgb(${r},${g},${b})`;
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
