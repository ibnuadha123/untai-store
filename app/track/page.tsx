"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackOrderPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Lacak pesanan — Untai";
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/order/${data.orderNumber}`);
    } catch {
      setError("Tidak bisa terhubung ke server. Periksa koneksimu lalu coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-display text-4xl text-ink">Lacak pesananmu</h1>
      <p className="mt-3 font-body text-ink/60">
        Masukkan nomor pesanan dan nomor telepon yang kamu pakai saat checkout.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="orderNumber" className="font-body text-sm text-ink/70">
            Nomor pesanan
          </label>
          <input
            id="orderNumber"
            type="text"
            required
            placeholder="UNT-260926-A1B2C"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body uppercase text-ink outline-none placeholder:normal-case focus:border-raspberry"
          />
        </div>

        <div>
          <label htmlFor="phone" className="font-body text-sm text-ink/70">
            Nomor telepon
          </label>
          <input
            id="phone"
            type="tel"
            required
            placeholder="08xx xxxx xxxx"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
          />
        </div>

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
          {isSubmitting ? "Mencari…" : "Cari pesananku"}
        </button>
      </form>
    </main>
  );
}
