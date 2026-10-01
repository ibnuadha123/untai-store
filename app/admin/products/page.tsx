import Link from "next/link";
import { Metadata } from "next";
import { getAllProductsAdmin } from "@/lib/admin-products";
import { formatIDR } from "@/lib/format";
import { categoryLabel, label } from "@/lib/labels";

export const metadata: Metadata = { title: "Produk — Admin Untai" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAllProductsAdmin();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Produk</h1>
        <Link
          href="/admin"
          className="font-body text-sm text-ink/60 hover:text-raspberry"
        >
          ← Dasbor
        </Link>
      </div>

      <Link
        href="/admin/products/new"
        className="mt-6 inline-block rounded-strap bg-raspberry px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-raspberry-dark"
      >
        + Tambah produk
      </Link>

      {products.length === 0 ? (
        <p className="mt-8 font-body text-ink/60">Belum ada produk.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/10 font-body text-sm text-ink/50">
                <th className="py-3 pr-4 font-normal">Produk</th>
                <th className="py-3 pr-4 font-normal">Kategori</th>
                <th className="py-3 pr-4 font-normal">Harga</th>
                <th className="py-3 pr-4 font-normal">Stok</th>
                <th className="py-3 pr-4 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-ink">
              {products.map((p) => (
                <tr key={p.id} className="border-b border-ink/5 hover:bg-cloud">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="text-raspberry hover:underline"
                    >
                      {p.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-ink/70">
                    {label(categoryLabel, p.category)}
                  </td>
                  <td className="py-3 pr-4">{formatIDR(p.price)}</td>
                  <td className="py-3 pr-4">{p.stock}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        p.isActive
                          ? "bg-forest/15 text-forest"
                          : "bg-ink/10 text-ink/50"
                      }`}
                    >
                      {p.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                    {p.isFeatured && (
                      <span className="ml-2 rounded-full bg-gold/20 px-2.5 py-1 text-xs text-ink/70">
                        Unggulan
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
