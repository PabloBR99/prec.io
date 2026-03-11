"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/types/game";

interface ProductCardProps {
  readonly product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-44 w-44 overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-foreground/[0.06] sm:h-52 sm:w-52">
        <Image
          src={product.imagen_url}
          alt={product.nombre}
          fill
          sizes="256px"
          priority
          className={`object-contain p-2 transition-all duration-700 ease-out ${
            imageLoaded ? "scale-100 blur-0 opacity-100" : "scale-105 blur-md opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="text-center">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-xl font-bold text-foreground sm:text-2xl">
          {product.nombre}
        </h1>
        {product.cantidad && (
          <p className="mt-1 text-sm text-foreground/50">{product.cantidad}</p>
        )}
        {product.categoria && (
          <span className="mt-2 inline-block rounded-full bg-gradient-to-r from-accent/15 to-[#F97316]/15 px-3.5 py-1 text-xs font-semibold text-accent">
            {product.categoria}
          </span>
        )}
      </div>
    </div>
  );
}

