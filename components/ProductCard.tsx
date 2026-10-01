"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { formatIDR } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { categoryLabel, label } from "@/lib/labels";

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  className?: string;
}

export default function ProductCard({
  product,
  onOpenDetail,
  className = "",
}: ProductCardProps) {
  const { addToCart } = useCart();
  const isSoldOut = product.stock === 0;

  return (
    <article className={`group flex flex-col ${className}`}>
      <button
        type="button"
        onClick={() => onOpenDetail(product)}
        className="relative aspect-square w-full overflow-hidden rounded-strap bg-cloud text-left"
        aria-label={`Lihat detail ${product.name}`}
      >
        <Image
          src={product.imageUrl}
          alt={`${product.name}, strap ponsel ${label(categoryLabel, product.category).toLowerCase()}`}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {isSoldOut && (
          <span className="absolute left-4 top-4 rounded-full bg-ink px-3 py-1 font-body text-xs font-medium text-paper">
            Habis
          </span>
        )}
      </button>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-body text-xs text-forest">{label(categoryLabel, product.category)}</p>
          <h3 className="mt-1 font-display text-xl text-ink">{product.name}</h3>
          <p className="mt-1 font-body text-sm text-ink/60">
            {formatIDR(product.price)}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={isSoldOut}
        onClick={() => addToCart(product)}
        className="mt-4 w-full rounded-strap border border-ink/15 py-2.5 font-body text-sm font-medium text-ink transition-colors hover:border-raspberry hover:text-raspberry disabled:cursor-not-allowed disabled:border-ink/10 disabled:text-ink/35 disabled:hover:border-ink/10 disabled:hover:text-ink/35"
      >
        {isSoldOut ? "Habis" : "Tambah ke keranjang"}
      </button>
    </article>
  );
}
