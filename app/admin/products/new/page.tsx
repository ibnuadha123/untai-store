import Link from "next/link";
import { Metadata } from "next";
import ProductForm from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Tambah Produk — Admin Untai" };

export default function NewProductPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <Link
        href="/admin/products"
        className="font-body text-sm text-ink/60 hover:text-raspberry"
      >
        ← Semua produk
      </Link>
      <h1 className="mt-2 font-display text-3xl text-ink">Tambah produk</h1>

      <div className="mt-8">
        <ProductForm />
      </div>
    </main>
  );
}
