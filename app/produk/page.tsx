import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartSync from "@/components/CartSync";
import AllProductsGrid from "@/components/AllProductsGrid";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Semua Produk — Untai",
  description: "Seluruh strap ponsel Untai dalam satu halaman.",
};

// Daftar produk selalu diambil langsung dari database pada setiap
// permintaan. Jadi produk yang baru ditambah admin langsung muncul, dan
// produk yang dihapus (atau dinonaktifkan) admin langsung hilang dari sini.
export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  const products = await getProducts();

  return (
    <>
      <CartSync products={products} />
      <Navbar />
      <main className="px-6 pb-24 pt-14">
        <div className="mx-auto max-w-6xl">
          <a
            href="/#collection"
            className="font-body text-sm text-ink/60 transition-colors hover:text-raspberry"
          >
            ← Kembali ke beranda
          </a>
          <h1 className="mt-6 font-display text-5xl text-ink">Semua produk</h1>
          <p className="mt-3 max-w-prose font-body text-ink/70">
            Seluruh strap yang tersedia di Untai saat ini, termasuk yang sedang
            habis stok.
          </p>

          <AllProductsGrid products={products} />
        </div>
      </main>
      <Footer />
    </>
  );
}
