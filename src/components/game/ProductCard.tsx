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

function getDayNumber(dateStr: string): number {
  const start = new Date(FIRST_DAY + "T00:00:00");
  const current = new Date(dateStr + "T00:00:00");
  return Math.floor((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const dayNum = getDayNumber(product.fecha);

  const showQuantity =
    product.cantidad && !isInName(product.nombre, product.cantidad);

  // Build subtitle parts: brand (always) + quantity (if not in name)
  const subtitleParts: string[] = [];
  if (product.marca) subtitleParts.push(product.marca);
  if (showQuantity && product.cantidad) subtitleParts.push(product.cantidad);

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl px-5 pb-10 pt-7"
      style={{
        background: "linear-gradient(145deg, #F97316 0%, #EA580C 100%)",
        boxShadow:
          "0 1px 3px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
      }}
    >
      {/* Diagonal white stripes pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "repeating-linear-gradient(135deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1.5px, transparent 1.5px, transparent 28px)",
        }}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-2.5 sm:gap-[58px]">
        {/* Product image — printed on card */}
        <div className="relative ml-4 shrink-0 sm:ml-6">
          <div className="relative h-[92px] w-[92px] overflow-hidden rounded-sm sm:h-[120px] sm:w-[120px]">
            {/* White base so product is visible */}
            <div className="absolute inset-0 rounded-sm bg-white/90" />
            <Image
              src={product.imagen_url}
              alt={product.nombre}
              fill
              sizes="144px"
              priority
              className={`object-contain p-2 mix-blend-multiply transition-all duration-700 ease-out ${
                imageLoaded
                  ? "scale-100 blur-0 opacity-100"
                  : "scale-105 blur-md opacity-0"
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Subtle grain overlay to simulate print texture */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]" aria-hidden="true">
              <filter id="imgNoise">
                <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="4" stitchTiles="stitch" />
              </filter>
              <rect width="100%" height="100%" filter="url(#imgNoise)" />
            </svg>
          </div>
        </div>

        {/* Product info — right of polaroid, left-aligned */}
        <div className="min-w-0 flex-1 self-start pt-4">
          <h1
            className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold uppercase leading-snug tracking-wide text-white sm:text-base"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            {product.nombre}
          </h1>
          {subtitleParts.length > 0 && (
            <p className="mt-0.5 text-sm text-white/80">
              {subtitleParts.join(" · ")}
            </p>
          )}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {product.categoria && (
              <span
                className="inline-block rounded-full border border-white/25 px-2.5 py-0.5 text-xs font-semibold text-white"
                style={{
                  background: "rgba(255,255,255,0.12)",
                }}
              >
                {product.categoria}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Day badge — bottom right */}
      <div className="pointer-events-none absolute bottom-3 right-3 flex flex-col items-center">
        <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">Día</span>
        <span className="font-[family-name:var(--font-space-grotesk)] text-3xl font-extrabold leading-none text-white/40 sm:text-4xl">
          {dayNum}
        </span>
      </div>
    </div>
  );
}
