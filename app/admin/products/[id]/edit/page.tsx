import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByIdAdmin } from "@/lib/admin-products";
import ProductForm from "@/components/admin/ProductForm";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductByIdAdmin(id);
  return { title: `${product?.name ?? "Produk"} — Admin Untai` };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductByIdAdmin(id);

  if (!product) notFound();

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <Link
        href="/admin/products"
        className="font-body text-sm text-ink/60 hover:text-raspberry"
      >
        ← Semua produk
      </Link>
      <h1 className="mt-2 font-display text-3xl text-ink">Ubah produk</h1>

      <div className="mt-8">
        <ProductForm product={product} />
      </div>

      <div className="mt-8 border-t border-ink/10 pt-6">
        <DeleteProductButton productId={product.id} />
      </div>
    </main>
  );
}
