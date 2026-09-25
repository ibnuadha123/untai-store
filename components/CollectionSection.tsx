"use client";

import Image from "next/image";
import { useState } from "react";
import { Product } from "@/types/product";
import { formatIDR } from "@/lib/format";
import ProductModal from "./ProductModal";

interface CollectionSectionProps {
  products: Product[];
}

// Mixed tile sizes give the section a scrapbook feel rather than a uniform
// grid — the sizing is fixed here rather than randomized so the layout is
// stable across renders.
const spanPattern = [
  "sm:col-span-3 sm:row-span-2",
  "sm:col-span-3 sm:row-span-1",
  "sm:col-span-2 sm:row-span-1",
  "sm:col-span-4 sm:row-span-1",
  "sm:col-span-3 sm:row-span-1",
  "sm:col-span-3 sm:row-span-1",
];

export default function CollectionSection({ products }: CollectionSectionProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const active = products.filter((p) => p.isActive);

  return (
    <section id="collection" className="bg-ink px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-prose">
          <h2 className="font-display text-4xl text-paper">
            Every strap in the studio
          </h2>
          <p className="mt-3 font-body text-paper/65">
            Beaded, woven, leather, and standalone charms — the full range,
            including a few that have already sold through.
          </p>
        </div>

        <div className="mt-12 grid auto-rows-[160px] grid-cols-1 gap-4 sm:grid-cols-6">
          {active.map((product, i) => (
            <button
              key={product.id}
              type="button"
              onClick={() => setActiveProduct(product)}
              className={`group relative overflow-hidden rounded-strap bg-cloud text-left ${
                spanPattern[i % spanPattern.length]
              }`}
            >
              <Image
                src={product.imageUrl}
                alt={`${product.name}, a ${product.category.toLowerCase()} phone strap`}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent p-4">
                <p className="font-body text-xs text-paper/70">{product.category}</p>
                <p className="font-display text-lg text-paper">{product.name}</p>
                <p className="font-body text-sm text-paper/80">
                  {product.stock === 0 ? "Sold out" : formatIDR(product.price)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </section>
  );
}
