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
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-foreground/5">
        <Image
          src={product.imagen_url}
          alt={product.nombre}
          fill
          sizes="(max-width: 768px) 100vw, 512px"
          priority
          className={`object-contain p-4 transition-all duration-1000 ease-out ${
            imageLoaded ? "scale-100 blur-0" : "scale-105 blur-lg"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-bold text-foreground sm:text-2xl">
          {product.nombre}
        </h1>
        {product.cantidad && (
          <p className="mt-1 text-sm text-foreground/60">{product.cantidad}</p>
        )}
        {product.categoria && (
          <span className="mt-2 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {product.categoria}
          </span>
        )}
      </div>
    </div>
  );
}
