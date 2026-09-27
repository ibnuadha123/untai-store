"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart";
import { Product } from "@/types/product";

// Renders nothing — just keeps the cart's cached stock/price numbers in
// sync with whatever the homepage just fetched from the database. Runs
// again whenever the cart's contents change (e.g. right after the
// persisted cart loads from localStorage on first mount), and safely
// settles once nothing is left to reconcile (see the "unchanged" check
// inside syncWithProducts).
export default function CartSync({ products }: { products: Product[] }) {
  const { items, syncWithProducts } = useCart();

  useEffect(() => {
    syncWithProducts(products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, products]);

  return null;
}
