"use client";

import { motion, useSpring, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface BellCurveProps {
  readonly percentile: number;
  readonly visible: boolean;
}

type MidwitZone = "simpleton" | "midwit" | "expert";

/* ── Math helpers ──────────────────────────────────────── */

function normalPDF(z: number): number {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
}

function percentileToZ(percentile: number): number {
  const p = Math.max(0.001, Math.min(0.999, percentile / 100));
  const sign = p < 0.5 ? -1 : 1;
  const t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
  return (
    sign *
    (t -
      (2.515517 + 0.802853 * t + 0.010328 * t * t) /
        (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t))
  );
}

function getZone(percentile: number): MidwitZone {
  if (percentile <= 16) return "simpleton";
  if (percentile > 84) return "expert";
  return "midwit";
}

/* ── SVG layout ───────────────────────────────────────── */

const CHAR_SPACE = 95;
const W = 380;
const CURVE_H = 200;
const H = CURVE_H + CHAR_SPACE;
const PX = 20;
const PT = 20;
const PB = 28;
const CW = W - 2 * PX;
const CH = CURVE_H - PT - PB;
const BASE_Y = H - PB;
const Z_MIN = -3.5;
const Z_MAX = 3.5;
const Z_SPAN = Z_MAX - Z_MIN;
const PEAK = normalPDF(0);

const zToX = (z: number): number => PX + ((z - Z_MIN) / Z_SPAN) * CW;
const yFromPdf = (v: number): number => BASE_Y - (v / PEAK) * CH;
const PEAK_Y = yFromPdf(PEAK);

/* ── Precomputed paths ────────────────────────────────── */

function buildPath(close: boolean): string {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const z = Z_MIN + (i / 200) * Z_SPAN;
    pts.push(
      (i === 0 ? "M" : "L") + `${zToX(z)},${yFromPdf(normalPDF(z))}`
    );
  }
  if (close) {
    pts.push(`L${zToX(Z_MAX)},${BASE_Y} L${zToX(Z_MIN)},${BASE_Y}Z`);
  }
  return pts.join(" ");
}

/* ── Reference data ───────────────────────────────────── */

const SD_LINES = [-2, -1, 0, 1, 2];

const SEGMENTS = [
  { z: -2.5, pct: "2%" },
  { z: -1.5, pct: "14%" },
  { z: -0.5, pct: "34%" },
  { z: 0.5, pct: "34%" },
  { z: 1.5, pct: "14%" },
  { z: 2.5, pct: "2%" },
] as const;

/* ── Character image config ───────────────────────────── */

const CHAR_DEFS: { zone: MidwitZone; src: string; z: number; w: number; h: number }[] = [
  { zone: "simpleton", src: "/midwits/left.png", z: -3.1, w: 76, h: 76 },
  { zone: "midwit", src: "/midwits/center.png", z: 0, w: 76, h: 76 },
  { zone: "expert", src: "/midwits/right.png", z: 3.1, w: 76, h: 76 },
];

const ACTIVE_SCALE = 1;
const INACTIVE_SCALE = 1;
const ACTIVE_OPACITY = 1;
const INACTIVE_OPACITY = 0.2;

/* ── Main component ───────────────────────────────────── */

export function BellCurve({ percentile, visible }: BellCurveProps) {
  const outline = useMemo(() => buildPath(false), []);
  const filled = useMemo(() => buildPath(true), []);
  const targetZ = useMemo(() => percentileToZ(percentile), [percentile]);
  const zone = useMemo(() => getZone(percentile), [percentile]);

  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.97, filter: "blur(4px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full justify-center"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Distribución: mejor que el ${Math.round(percentile)}% de jugadores`}
      >
        <defs>
          <linearGradient id="bc-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.10" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id="bc-stroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        {/* ── All 3 midwit characters — each at their curve position ── */}
        {CHAR_DEFS.map((char) => {
          const isActive = char.zone === zone;
          const scale = isActive ? ACTIVE_SCALE : INACTIVE_SCALE;
          const sw = char.w * scale;
          const sh = char.h * scale;
          const cx = zToX(char.z) - sw / 2;
          const curveY = char.zone === "midwit"
            ? PEAK_Y
            : yFromPdf(normalPDF(char.z));
          const cy = curveY - sh - (char.zone === "midwit" ? 4 : 14);
          return (
            <motion.image
              key={char.zone}
              href={char.src}
              x={cx}
              y={cy}
              width={sw}
              height={sh}
              initial={false}
              animate={{ opacity: visible ? (isActive ? ACTIVE_OPACITY : INACTIVE_OPACITY) : 0 }}
              transition={{ duration: 0.5, delay: visible ? (isActive ? 0.4 : 0.5) : 0 }}
            />
          );
        })}

        {/* ── Filled area under curve ── */}
        <motion.path
          d={filled}
          fill="url(#bc-fill)"
          initial={false}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: 0.6, delay: visible ? 0.05 : 0 }}
        />

        {/* ── Curve outline ── */}
        <motion.path
          d={outline}
          fill="none"
          stroke="url(#bc-stroke)"
          strokeWidth={3}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: visible ? 1 : 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* ── SD vertical lines ── */}
        {SD_LINES.map((z) => (
          <motion.line
            key={z}
            x1={zToX(z)}
            y1={yFromPdf(normalPDF(z))}
            x2={zToX(z)}
            y2={BASE_Y}
            stroke="currentColor"
            strokeWidth={0.75}
            strokeDasharray="3 3"
            className="text-foreground/10"
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ delay: visible ? 0.3 : 0, duration: 0.4 }}
          />
        ))}

        {/* ── Segment percentage labels — staircase following curve ── */}
        {SEGMENTS.map(({ z, pct }) => {
          const curveTop = yFromPdf(normalPDF(z));
          const midY = curveTop + (BASE_Y - curveTop) * 0.4;
          return (
            <motion.text
              key={z}
              x={zToX(z)}
              y={midY + 4}
              textAnchor="middle"
              className="fill-foreground/25 text-[11px] font-medium"
              initial={false}
              animate={{ opacity: visible ? 1 : 0 }}
              transition={{ delay: visible ? 0.35 : 0, duration: 0.4 }}
            >
              {pct}
            </motion.text>
          );
        })}

        {/* ── Base line ── */}
        <line
          x1={PX}
          y1={BASE_Y}
          x2={W - PX}
          y2={BASE_Y}
          stroke="currentColor"
          strokeWidth={1.5}
          className="text-foreground/15"
        />

        {/* ── Axis labels ── */}
        <motion.text
          x={PX + 2}
          y={H - 5}
          className="fill-foreground/40 text-[12px]"
          initial={false}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ delay: visible ? 0.35 : 0, duration: 0.4 }}
        >
          Peor
        </motion.text>
        <motion.text
          x={W - PX - 2}
          y={H - 5}
          textAnchor="end"
          className="fill-foreground/40 text-[12px]"
          initial={false}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ delay: visible ? 0.35 : 0, duration: 0.4 }}
        >
          Mejor
        </motion.text>

        {/* ── User marker ── */}
        {visible && <Marker targetZ={targetZ} />}
      </svg>
    </motion.div>
  );
}

/* ── Animated user marker ─────────────────────────────── */

function Marker({ targetZ }: { readonly targetZ: number }) {
  const spring = useSpring(Z_MIN, { stiffness: 50, damping: 12 });
  const [pos, setPos] = useState({
    x: zToX(Z_MIN),
    y: yFromPdf(normalPDF(Z_MIN)),
  });

  useEffect(() => {
    const id = setTimeout(() => spring.set(targetZ), 300);
    return () => clearTimeout(id);
  }, [targetZ, spring]);

  useMotionValueEvent(spring, "change", (z) => {
    setPos({ x: zToX(z), y: yFromPdf(normalPDF(z)) });
  });

  return (
    <g>
      <line
        x1={pos.x}
        y1={pos.y}
        x2={pos.x}
        y2={BASE_Y}
        stroke="var(--color-accent)"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.7}
      />
      <circle
        cx={pos.x}
        cy={pos.y}
        r={6}
        fill="var(--color-accent)"
        stroke="var(--color-surface)"
        strokeWidth={2.5}
      />
      <text
        x={pos.x}
        y={pos.y - 14}
        textAnchor="middle"
        fill="var(--color-accent)"
        fontSize="13"
        fontWeight="bold"
        fontFamily="var(--font-space-grotesk), system-ui"
      >
        Tú
      </text>
    </g>
  );
}
