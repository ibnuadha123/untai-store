"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Product } from "@/types/product";
import { formatIDR } from "@/lib/format";
import { useCart } from "@/lib/cart";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useCart();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (product) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product-modal-title"
        >
          <motion.div
            className="thin-scroll grid max-h-[85vh] w-full max-w-3xl grid-cols-1 gap-8 overflow-y-auto rounded-strap bg-paper p-6 md:grid-cols-2 md:p-8"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-strap bg-cloud">
              <Image
                src={product.imageUrl}
                alt={`${product.name}, a ${product.category.toLowerCase()} phone strap`}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-body text-xs text-forest">{product.category}</p>
                  <h2
                    id="product-modal-title"
                    className="mt-1 font-display text-3xl text-ink"
                  >
                    {product.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close product details"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-raspberry hover:text-raspberry"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <p className="mt-2 font-body text-lg text-ink/80">
                {formatIDR(product.price)}
              </p>
              <p className="mt-4 font-body leading-relaxed text-ink/70">
                {product.description}
              </p>

              <p className="mt-4 font-body text-sm text-ink/60">
                {product.stock === 0
                  ? "Currently sold out."
                  : product.stock <= 5
                  ? `Only ${product.stock} left.`
                  : "In stock."}
              </p>

              <button
                type="button"
                disabled={product.stock === 0}
                onClick={() => {
                  addToCart(product);
                  onClose();
                }}
                className="mt-6 w-full rounded-strap bg-raspberry py-3 font-body text-base font-medium text-paper transition-colors hover:bg-raspberry-dark disabled:cursor-not-allowed disabled:bg-ink/15 disabled:text-ink/40"
              >
                {product.stock === 0 ? "Sold out" : "Add to cart"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
