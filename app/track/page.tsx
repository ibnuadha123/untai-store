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
    document.title = "Track your order — Untai";
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
        setError(data.error ?? "Something went wrong. Please try again.");
        setIsSubmitting(false);
        return;
      }

      router.push(`/order/${data.orderNumber}`);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-24">
      <h1 className="font-display text-4xl text-ink">Track your order</h1>
      <p className="mt-3 font-body text-ink/60">
        Enter your order number and the phone number you checked out with.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
        <div>
          <label htmlFor="orderNumber" className="font-body text-sm text-ink/70">
            Order number
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
            Phone number
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
          {isSubmitting ? "Looking up…" : "Find my order"}
        </button>
      </form>
    </main>
  );
}
