"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import { Product } from "@/types/product";

const STORAGE_KEY = "untai:cart";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  syncWithProducts: (products: Product[]) => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  // Skip the very first save-effect run, since it would otherwise
  // immediately overwrite localStorage with the empty initial state
  // before the load-effect below has had a chance to run.
  const hasLoaded = useRef(false);

  // Load persisted cart on first mount only. This runs after hydration,
  // client-side only — localStorage doesn't exist during SSR.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (err) {
      console.error("Failed to load cart from storage:", err);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  // Persist on every change, once the initial load has completed.
  useEffect(() => {
    if (!hasLoaded.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart to storage:", err);
    }
  }, [items]);

  function addToCart(product: Product) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
    setIsOpen(true);
  }

  function removeFromCart(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function increaseQuantity(productId: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.quantity < i.stock
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  }

  function decreaseQuantity(productId: string) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function clearCart() {
    setItems([]);
  }

  // Reconciles cached cart items against a fresh product list — called
  // once per homepage load, since that's where current stock is known.
  // Fixes stock numbers baked into the cart at add-time (or from an older
  // localStorage session) going stale: drops items whose product no
  // longer exists or is inactive, clamps quantity down to current stock
  // (removing the item entirely if stock is now 0), and refreshes the
  // cached stock/price/name so the +/- buttons reflect reality.
  function syncWithProducts(products: Product[]) {
    setItems((prev) => {
      const byId = new Map(products.map((p) => [p.id, p]));
      const next: CartItem[] = [];

      for (const item of prev) {
        const product = byId.get(item.productId);
        if (!product || !product.isActive) continue; // no longer available

        const clampedQuantity = Math.min(item.quantity, product.stock);
        if (clampedQuantity <= 0) continue; // sold out

        next.push({
          ...item,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          stock: product.stock,
          quantity: clampedQuantity,
        });
      }

      // Avoid a pointless state update (and localStorage write) when
      // nothing actually changed.
      const unchanged =
        next.length === prev.length &&
        next.every(
          (n, i) =>
            n.quantity === prev[i].quantity &&
            n.stock === prev[i].stock &&
            n.price === prev[i].price &&
            n.name === prev[i].name &&
            n.image === prev[i].image
        );

      return unchanged ? prev : next;
    });
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        syncWithProducts,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
