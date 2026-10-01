"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";

export default function AllProductsGrid({ products }: { products: Product[] }) {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const active = products.filter((p) => p.isActive);

  if (active.length === 0) {
    return (
      <p className="mt-12 font-body text-ink/50">
        Belum ada produk saat ini. Cek lagi nanti.
      </p>
    );
  }

  return (
    <>
      <p className="mt-8 font-body text-sm text-ink/50">
        {active.length} produk
      </p>
      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {active.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onOpenDetail={setActiveProduct}
          />
        ))}
      </div>
      <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
    </>
  );
}
