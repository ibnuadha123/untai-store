"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatIDR } from "@/lib/format";

type PaymentMethod = "QRIS" | "DANA";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QRIS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Checkout — Untai";
  }, []);

  const estimatedShipping = subtotal >= 150000 ? 0 : 15000;
  const estimatedTotal = subtotal + estimatedShipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Keranjangmu kosong.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          paymentMethod,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order/${data.order_number}`);
    } catch {
      setError("Tidak bisa terhubung ke server. Periksa koneksimu lalu coba lagi.");
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">Keranjangmu kosong</h1>
        <p className="mt-3 font-body text-ink/60">
          Tambahkan strap dari toko sebelum checkout.
        </p>
        <Link
          href="/#shop"
          className="mt-6 inline-block rounded-strap bg-raspberry px-6 py-3 font-body text-sm font-medium text-paper hover:bg-raspberry-dark"
        >
          Kembali ke toko
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Checkout</h1>

      <div className="mt-10 grid gap-12 md:grid-cols-[1.2fr_1fr]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label htmlFor="name" className="font-body text-sm text-ink/70">
              Nama lengkap
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
            />
          </div>

          <div>
            <label htmlFor="phone" className="font-body text-sm text-ink/70">
              Nomor telepon (sebaiknya yang aktif WhatsApp)
            </label>
            <input
              id="phone"
              type="tel"
              required
              maxLength={20}
              placeholder="08xx xxxx xxxx"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
            />
          </div>

          <div>
            <label htmlFor="address" className="font-body text-sm text-ink/70">
              Alamat pengiriman
            </label>
            <textarea
              id="address"
              required
              maxLength={500}
              rows={4}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
            />
          </div>

          <fieldset>
            <legend className="font-body text-sm text-ink/70">
              Metode pembayaran
            </legend>
            <div className="mt-2 flex gap-3">
              {(["QRIS", "DANA"] as const).map((method) => (
                <label
                  key={method}
                  className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border py-3 font-body text-sm transition-colors ${
                    paymentMethod === method
                      ? "border-raspberry bg-raspberry/10 text-raspberry"
                      : "border-ink/15 text-ink/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="sr-only"
                  />
                  {method}
                </label>
              ))}
            </div>
          </fieldset>

          {error && (
            <p className="rounded-xl bg-raspberry/10 px-4 py-3 font-body text-sm text-raspberry">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-strap bg-raspberry py-3 font-body text-base font-medium text-paper transition-colors hover:bg-raspberry-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Memproses pesanan…" : "Buat pesanan"}
          </button>
        </form>

        <div className="h-fit rounded-strap border border-ink/10 p-6">
          <h2 className="font-display text-xl text-ink">Ringkasan pesanan</h2>
          <ul className="mt-4 divide-y divide-ink/10">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between py-3">
                <span className="font-body text-sm text-ink/80">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-body text-sm text-ink/60">
                  {formatIDR(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 font-body text-sm">
            <div className="flex justify-between text-ink/60">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span>Ongkos kirim</span>
              <span>
                {estimatedShipping === 0 ? "Gratis" : formatIDR(estimatedShipping)}
              </span>
            </div>
            <div className="flex justify-between pt-2 text-base font-medium text-ink">
              <span>Total</span>
              <span>{formatIDR(estimatedTotal)}</span>
            </div>
          </div>
          <p className="mt-4 font-body text-xs text-ink/45">
            Total akhir dikonfirmasi server saat kamu membuat pesanan.
          </p>
        </div>
      </div>
    </main>
  );
}
