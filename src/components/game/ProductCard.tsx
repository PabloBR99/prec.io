"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/game";

interface ProductCardProps {
  readonly product: Product;
}

function isInName(nombre: string, text: string): boolean {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  return norm(nombre).includes(norm(text));
}

const FIRST_DAY = "2026-03-11";

const STAMP_COLORS = [
  "#4d91ff", // azul
  "#e05297", // rosa
  "#10b981", // verde
  "#f59e0b", // ámbar
  "#8b5cf6", // violeta
  "#ef4444", // rojo
  "#06b6d4", // cyan
  "#f97316", // naranja
];

function getDayNumber(dateStr: string): number {
  const start = new Date(FIRST_DAY + "T00:00:00");
  const current = new Date(dateStr + "T00:00:00");
  return Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const dayNum = getDayNumber(product.fecha);
  const stampColor = STAMP_COLORS[(dayNum - 1) % STAMP_COLORS.length];

  const showQuantity =
    product.cantidad && !isInName(product.nombre, product.cantidad);

  // Build subtitle parts: brand (always) + quantity (if not in name)
  const subtitleParts: string[] = [];
  if (product.marca) subtitleParts.push(product.marca);
  if (showQuantity && product.cantidad) subtitleParts.push(product.cantidad);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl px-5 pb-4 pt-5"
      style={{
        background: "linear-gradient(145deg, #FFF9EE 0%, #FFF7E8 100%)",
        boxShadow:
          "0 2px 8px rgba(120,80,20,0.08), 0 8px 24px rgba(120,80,20,0.05), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {/* Dark mode — soften the white card */}
      <div className="pointer-events-none absolute inset-0 hidden rounded-2xl bg-black/[0.06] dark:block" />

      <div className="relative flex items-center gap-[78px]">
        {/* Polaroid — the hero */}
        <div className="relative shrink-0 rotate-[2deg]">
          {/* Tape strip */}
          <div
            className="absolute -right-3 -top-2.5 z-10 h-6 w-12 rotate-[18deg] rounded-sm"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,230,160,0.75) 0%, rgba(255,220,130,0.55) 100%)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
            }}
          />
          <div
            className="overflow-hidden rounded-sm bg-white p-1.5 pb-2.5"
            style={{
              boxShadow:
                "0 3px 10px rgba(80,50,10,0.15), 0 1px 3px rgba(80,50,10,0.10), inset 0 0 0 1px rgba(0,0,0,0.04)",
            }}
          >
            <div className="relative h-[95px] w-[95px] overflow-hidden rounded-[2px] bg-neutral-50 sm:h-[124px] sm:w-[124px]">
              <Image
                src={product.imagen_url}
                alt={product.nombre}
                fill
                sizes="144px"
                priority
                className={`object-contain p-1.5 transition-all duration-700 ease-out ${
                  imageLoaded
                    ? "scale-100 blur-0 opacity-100"
                    : "scale-105 blur-md opacity-0"
                }`}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>

        {/* Product info — right of polaroid, left-aligned */}
        <div className="min-w-0 flex-1 self-start pt-4">
          <h1 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold leading-tight text-[#2D1F0E] sm:text-xl">
            {product.nombre}
          </h1>
          {subtitleParts.length > 0 && (
            <p className="mt-0.5 text-sm text-[#2D1F0E]/45">
              {subtitleParts.join(" · ")}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {product.categoria && (
              <span
                className="inline-block rounded-full border border-[#D97706]/20 px-2.5 py-0.5 text-xs font-semibold text-[#D97706]"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(217,119,6,0.08) 0%, rgba(249,115,22,0.06) 100%)",
                }}
              >
                {product.categoria}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Day stamp — circular seal, inside bottom right */}
      <div className="pointer-events-none absolute bottom-1 right-2">
        <div className="relative rotate-[-12deg]">
          <svg width="80" height="80" viewBox="0 0 96 96" fill="none">
            {/* Outer ring */}
            <circle cx="48" cy="48" r="44" stroke={stampColor} strokeWidth="2.5" opacity="0.7" strokeDasharray="4 2.5" />
            {/* Inner ring */}
            <circle cx="48" cy="48" r="36" stroke={stampColor} strokeWidth="1.5" opacity="0.6" />
            {/* Center band background */}
            <rect x="6" y="35" width="84" height="22" rx="4" fill="#FFF9EE" stroke={stampColor} strokeWidth="1.5" opacity="0.7" />
            {/* Curved top text */}
            <defs>
              <path id="stampArcTop" d="M 16,48 A 32,32 0 0,1 80,48" />
              <path id="stampArcBottom" d="M 16,48 A 32,32 0 0,0 80,48" />
            </defs>
            <text
              fill={stampColor}
              opacity="0.75"
              fontSize="9"
              fontWeight="800"
              fontFamily="var(--font-space-grotesk), system-ui"
              letterSpacing="4"
            >
              <textPath href="#stampArcTop" startOffset="50%" textAnchor="middle">
                PREC.IO
              </textPath>
            </text>
            {/* Curved bottom text */}
            <text
              fill={stampColor}
              opacity="0.75"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="var(--font-space-grotesk), system-ui"
              letterSpacing="3"
            >
              <textPath href="#stampArcBottom" startOffset="50%" textAnchor="middle">
                OFICIAL
              </textPath>
            </text>
          </svg>
          {/* Center number */}
          <span
            className="absolute inset-0 flex items-center justify-center font-[family-name:var(--font-space-grotesk)] text-lg font-extrabold tracking-wide"
            style={{ color: stampColor, opacity: 0.8 }}
          >
            #{dayNum}
          </span>
        </div>
      </div>
    </div>
  );
}
