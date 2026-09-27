"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

interface ProductSectionProps {
  products: Product[];
}

export default function ProductSection({ products }: ProductSectionProps) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const featured = products.filter((p) => p.isFeatured && p.isActive);

  return (
    <section id="shop" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-prose">
          <h2 className="font-display text-4xl text-ink">The current run</h2>
          <p className="mt-3 font-body text-ink/70">
            Small batches, made in limited numbers. Once a strap sells out,
            it may not come back in the same colorway.
          </p>
        </div>

        {featured.length === 0 ? (
          <p className="mt-12 font-body text-ink/50">
            New pieces are on their way — check back soon.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                onOpenDetail={setActiveProduct}
                className={i % 3 === 1 ? "lg:translate-y-10" : ""}
              />
            ))}
          </div>
        )}
      </div>

      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </section>
  );
}
