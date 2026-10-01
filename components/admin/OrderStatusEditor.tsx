"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { label, orderStatusLabel, paymentStatusLabel } from "@/lib/labels";

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"] as const;
const ORDER_STATUSES = [
  "NEW",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;

interface OrderStatusEditorProps {
  orderNumber: string;
  paymentStatus: string;
  orderStatus: string;
}

export default function OrderStatusEditor({
  orderNumber,
  paymentStatus,
  orderStatus,
}: OrderStatusEditorProps) {
  const router = useRouter();
  const [payment, setPayment] = useState(paymentStatus);
  const [status, setStatus] = useState(orderStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const res = await fetch(`/api/admin/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: payment, orderStatus: status }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Gagal menyimpan");
        return;
      }

      setSaved(true);
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-strap border border-ink/10 p-5">
      <p className="font-display text-lg text-ink">Perbarui status</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-body text-sm text-ink/60">Status pembayaran</span>
          <select
            value={payment}
            onChange={(e) => setPayment(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 font-body text-ink outline-none focus:border-raspberry"
          >
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(paymentStatusLabel, s)}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="font-body text-sm text-ink/60">Status pesanan</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 font-body text-ink outline-none focus:border-raspberry"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {label(orderStatusLabel, s)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && (
        <p className="mt-3 font-body text-sm text-raspberry">{error}</p>
      )}
      {saved && !error && (
        <p className="mt-3 font-body text-sm text-forest">Tersimpan.</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="mt-4 rounded-strap bg-raspberry px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-raspberry-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Menyimpan…" : "Simpan perubahan"}
      </button>
    </div>
  );
}
