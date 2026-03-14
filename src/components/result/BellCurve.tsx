"use client";

import { motion, useSpring, useMotionValueEvent } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface BellCurveProps {
  readonly percentile: number;
  readonly visible: boolean;
}

type MidwitZone = "simpleton" | "midwit" | "expert";

/* ── Math helpers ── */

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

/* ── SVG layout ── */

const W = 340;
const PX = 10;
const CW = W - 2 * PX;

const CENTER_SIZE = 68;
const SIDE_SIZE = 52;
const CHAR_OVERLAP = 8;

const CURVE_H = 105;
const PEAK_Y = CENTER_SIZE - CHAR_OVERLAP + 4; // 64
const BASE_Y = PEAK_Y + CURVE_H; // 169

const BAR_GAP = 8;
const BAR_H = 7;
const BAR_RX = BAR_H / 2;
const LABEL_GAP = 4;
const LABEL_SIZE = 11;

const H = BASE_Y + BAR_GAP + BAR_H + LABEL_GAP + LABEL_SIZE + 6; // ~205

const Z_MIN = -3.5;
const Z_MAX = 3.5;
const Z_SPAN = Z_MAX - Z_MIN;
const PEAK = normalPDF(0);

const zToX = (z: number): number => PX + ((z - Z_MIN) / Z_SPAN) * CW;
const yFromPdf = (v: number): number => BASE_Y - (v / PEAK) * CURVE_H;

function buildPath(close: boolean): string {
  const pts: string[] = [];
  for (let i = 0; i <= 200; i++) {
    const z = Z_MIN + (i / 200) * Z_SPAN;
    pts.push((i === 0 ? "M" : "L") + `${zToX(z)},${yFromPdf(normalPDF(z))}`);
  }
  if (close) {
    pts.push(`L${zToX(Z_MAX)},${BASE_Y} L${zToX(Z_MIN)},${BASE_Y}Z`);
  }
  return pts.join(" ");
}

/* ── Characters ── */

const CHAR_DEFS: { zone: MidwitZone; src: string; z: number }[] = [
  { zone: "simpleton", src: "/midwits/left.png", z: -2.8 },
  { zone: "midwit", src: "/midwits/center.png", z: 0 },
  { zone: "expert", src: "/midwits/right.png", z: 2.8 },
];

/* ── Section labels ── */

const SECTION_DIVIDERS = [-2, -1, 0, 1, 2];

const SECTION_LABELS = [
  { label: "2%", z: -2.5, opacity: 0.18 },
  { label: "14%", z: -1.5, opacity: 0.28 },
  { label: "34%", z: -0.5, opacity: 0.38 },
  { label: "34%", z: 0.5, opacity: 0.38 },
  { label: "14%", z: 1.5, opacity: 0.28 },
  { label: "2%", z: 2.5, opacity: 0.18 },
];

/* ── Component ── */

export function BellCurve({ percentile, visible }: BellCurveProps) {
  const outline = useMemo(() => buildPath(false), []);
  const filled = useMemo(() => buildPath(true), []);
  const targetZ = useMemo(() => percentileToZ(percentile), [percentile]);
  const zone = useMemo(() => getZone(percentile), [percentile]);

  const zSpring = useSpring(Z_MIN, { stiffness: 50, damping: 12 });
  const pctSpring = useSpring(0, { stiffness: 40, damping: 15 });

  const [markerX, setMarkerX] = useState(zToX(Z_MIN));
  const [markerY, setMarkerY] = useState(yFromPdf(normalPDF(Z_MIN)));
  const [displayPct, setDisplayPct] = useState(0);

  useEffect(() => {
    if (visible) {
      const id = setTimeout(() => {
        zSpring.set(targetZ);
        pctSpring.set(percentile);
      }, 200);
      return () => clearTimeout(id);
    }
  }, [visible, targetZ, percentile, zSpring, pctSpring]);

  useMotionValueEvent(zSpring, "change", (z) => {
    setMarkerX(zToX(z));
    setMarkerY(yFromPdf(normalPDF(z)));
  });

  useEffect(() => {
    const unsub = pctSpring.on("change", (v: number) => setDisplayPct(Math.round(v)));
    return unsub;
  }, [pctSpring]);

  const barY = BASE_Y + BAR_GAP;
  const labelY = barY + BAR_H + LABEL_GAP + LABEL_SIZE;

  return (
    <motion.div
      initial={false}
      animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex w-full max-w-md flex-col items-center gap-1"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label={`Mejor que el ${Math.round(percentile)}% de jugadores`}
      >
        <defs>
          <linearGradient id="bc-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.32" />
          </linearGradient>
          <linearGradient id="bar-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* ── 1. Curve fill ── */}
        <path d={filled} fill="url(#bc-fill)" />

        {/* ── 2. Section dividers ── */}
        {SECTION_DIVIDERS.map((z) => (
          <line
            key={z}
            x1={zToX(z)}
            y1={yFromPdf(normalPDF(z))}
            x2={zToX(z)}
            y2={BASE_Y}
            stroke="var(--color-foreground)"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        ))}

        {/* ── 3. Section percentage labels ── */}
        {SECTION_LABELS.map(({ label, z, opacity }) => {
          const curveY = yFromPdf(normalPDF(z));
          const ly = (curveY + BASE_Y) / 2 + 5;
          return (
            <text
              key={z}
              x={zToX(z)}
              y={ly}
              textAnchor="middle"
              fontSize={10}
              fontWeight={600}
              fill="var(--color-accent)"
              fillOpacity={opacity}
            >
              {label}
            </text>
          );
        })}

        {/* ── 4. Curve outline ── */}
        <path
          d={outline}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />

        {/* ── 5. Characters ── */}
        {CHAR_DEFS.map((char) => {
          const isActive = char.zone === zone;
          const size = char.zone === "midwit" ? CENTER_SIZE : SIDE_SIZE;
          const cx = zToX(char.z);

          let charX: number, charY: number;
          if (char.zone === "midwit") {
            charX = cx - size / 2;
            charY = PEAK_Y - size + CHAR_OVERLAP - 10;
          } else {
            charX = cx - size / 2;
            charY = BASE_Y - size - 8;
          }

          return (
            <g key={char.zone}>
              <motion.image
                href={char.src}
                x={charX}
                y={charY}
                width={size}
                height={size}
                initial={false}
                animate={{ opacity: visible ? (isActive ? 1 : char.zone === "simpleton" ? 0.15 : 0.08) : 0 }}
                transition={{ duration: 0.5, delay: visible ? 0.3 : 0 }}
              />
            </g>
          );
        })}

        {/* ── 6. Vertical marker line ── */}
        {visible && (
          <line
            x1={markerX}
            y1={markerY + 8}
            x2={markerX}
            y2={BASE_Y}
            stroke="var(--color-accent)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            strokeOpacity={0.5}
          />
        )}

        {/* ── 7. Marker dot + "Tú" label ── */}
        {visible && (() => {
          const absZ = Math.abs(targetZ);
          const nearSide = absZ > 2;       // near left/right characters
          const nearCenter = absZ < 0.8;   // near center character
          const showBadge = !nearSide;
          const flipBelow = nearCenter;

          const nudge = percentile < 50 ? -5 : percentile > 50 ? 5 : 0;
          const badgeX = markerX + nudge;
          const badgeRectY = flipBelow ? markerY + 12 : markerY - 33;
          const badgeTextY = flipBelow ? markerY + 25 : markerY - 20;

          return (
            <>
              <circle
                cx={markerX}
                cy={markerY}
                r={7}
                fill="var(--color-accent)"
                stroke="var(--color-surface)"
                strokeWidth={2.5}
              />
              {showBadge && (
                <>
                  <rect
                    x={badgeX - 16}
                    y={badgeRectY}
                    width={32}
                    height={18}
                    rx={9}
                    fill="var(--color-accent)"
                  />
                  <text
                    x={badgeX}
                    y={badgeTextY}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={700}
                    fill="white"
                  >
                    Tú
                  </text>
                </>
              )}
            </>
          );
        })()}

        {/* ── 8. Progress bar ── */}
        <rect
          x={PX}
          y={barY}
          width={CW}
          height={BAR_H}
          rx={BAR_RX}
          fill="var(--color-foreground)"
          fillOpacity={0.07}
        />
        {visible && (
          <rect
            x={PX}
            y={barY}
            width={Math.max(BAR_H, markerX - PX)}
            height={BAR_H}
            rx={BAR_RX}
            fill="url(#bar-grad)"
          />
        )}

        {/* ── 9. "Peor" / "Mejor" labels ── */}
        <text
          x={PX + 2}
          y={labelY}
          fontSize={LABEL_SIZE}
          fill="var(--color-foreground)"
          fillOpacity={0.3}
        >
          Peor
        </text>
        <text
          x={W - PX - 2}
          y={labelY}
          textAnchor="end"
          fontSize={LABEL_SIZE}
          fill="var(--color-foreground)"
          fillOpacity={0.3}
        >
          Mejor
        </text>
      </svg>

      {/* ── Ranking text below SVG ── */}
      <p className="text-center text-sm text-foreground/50">
        Mejor que el{" "}
        <span className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold tabular-nums text-accent sm:text-xl">
          {displayPct}%
        </span>
        {" "}de jugadores hoy
      </p>
    </motion.div>
  );
}
