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

export function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const showQuantity =
    product.cantidad && !isInName(product.nombre, product.cantidad);

  const subtitleParts: string[] = [];
  if (product.marca) subtitleParts.push(product.marca);
  if (showQuantity && product.cantidad) subtitleParts.push(product.cantidad);

  return (
    <div className="flex flex-col items-center">
      {/* Hero product image — no decorative background, product breathes */}
      <div className="relative h-44 w-44 sm:h-56 sm:w-56">
        <Image
          src={product.imagen_url}
          alt={product.nombre}
          fill
          sizes="(min-width: 640px) 224px, 176px"
          priority
          className={`object-contain mix-blend-multiply transition-all duration-700 ease-out ${
            imageLoaded
              ? "scale-100 blur-0 opacity-100"
              : "scale-105 blur-md opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Product name + subtitle */}
      <div className="mt-5 text-center">
        <h1 className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold text-foreground sm:text-xl">
          {product.nombre}
        </h1>
        {subtitleParts.length > 0 && (
          <p className="mt-0.5 text-sm text-foreground/50">
            {subtitleParts.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
