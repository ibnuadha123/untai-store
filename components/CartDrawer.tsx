"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import { formatIDR } from "@/lib/format";

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    subtotal,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden="true"
          />

          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Keranjang belanja"
            className="thin-scroll fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className="font-display text-2xl text-ink">Keranjang</h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Tutup keranjang"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:border-raspberry hover:text-raspberry"
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

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <p className="font-display text-xl text-ink">Keranjangmu kosong</p>
                <p className="mt-2 font-body text-sm text-ink/60">
                  Tambahkan strap dari toko untuk melihatnya di sini.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-6 rounded-strap bg-raspberry px-6 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-raspberry-dark"
                >
                  Lanjut belanja
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ink/10 px-6">
                  {items.map((item) => (
                    <li key={item.productId} className="flex gap-4 py-5">
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cloud">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-base text-ink">
                            {item.name}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            aria-label={`Hapus ${item.name} dari keranjang`}
                            className="font-body text-xs text-ink/40 underline underline-offset-2 hover:text-raspberry"
                          >
                            Hapus
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-ink/15 px-2 py-1">
                            <button
                              type="button"
                              onClick={() => decreaseQuantity(item.productId)}
                              aria-label={`Kurangi jumlah ${item.name}`}
                              className="flex h-5 w-5 items-center justify-center text-ink/70 hover:text-raspberry"
                            >
                              −
                            </button>
                            <span className="w-4 text-center font-body text-sm text-ink">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => increaseQuantity(item.productId)}
                              disabled={item.quantity >= item.stock}
                              aria-label={`Tambah jumlah ${item.name}`}
                              className="flex h-5 w-5 items-center justify-center text-ink/70 hover:text-raspberry disabled:text-ink/25"
                            >
                              +
                            </button>
                          </div>
                          <p className="font-body text-sm text-ink/70">
                            {formatIDR(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-ink/10 px-6 py-6">
                  <div className="flex items-center justify-between font-body text-ink">
                    <span className="text-sm text-ink/60">Subtotal</span>
                    <span className="text-lg">{formatIDR(subtotal)}</span>
                  </div>
                  <p className="mt-1 font-body text-xs text-ink/45">
                    Ongkos kirim dihitung saat checkout.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      closeCart();
                      router.push("/checkout");
                    }}
                    className="mt-5 w-full rounded-strap bg-raspberry py-3 font-body text-base font-medium text-paper transition-colors hover:bg-raspberry-dark"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
