"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal menghapus produk");
        setIsDeleting(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server");
      setIsDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="font-body text-sm text-raspberry underline underline-offset-2 hover:text-raspberry-dark"
      >
        Hapus produk
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-raspberry/30 bg-raspberry/5 p-4">
      <p className="font-body text-sm text-ink">
        Yakin ingin menghapus produk ini? Kalau sudah pernah dipesan, produk
        hanya akan dinonaktifkan (disembunyikan dari toko), bukan dihapus
        permanen — agar riwayat pesanan lama tetap utuh.
      </p>
      {error && (
        <p className="mt-2 font-body text-sm text-raspberry">{error}</p>
      )}
      <div className="mt-3 flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="rounded-strap bg-raspberry px-4 py-2 font-body text-sm font-medium text-paper hover:bg-raspberry-dark disabled:opacity-60"
        >
          {isDeleting ? "Memproses…" : "Ya, lanjutkan"}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={isDeleting}
          className="rounded-strap border border-ink/15 px-4 py-2 font-body text-sm text-ink"
        >
          Batal
        </button>
      </div>
    </div>
  );
}
