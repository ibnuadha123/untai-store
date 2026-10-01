import { NextRequest, NextResponse } from "next/server";
import { updateProduct, deleteOrDeactivateProduct } from "@/lib/admin-products";
import { parseProductForm } from "@/lib/parse-product-form";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const formData = await req.formData();
  const parsed = parseProductForm(formData);
  if ("error" in parsed) return parsed.error;

  const { product, error } = await updateProduct(id, parsed.input);
  if (error || !product) {
    return NextResponse.json({ error: error ?? "Gagal memperbarui produk" }, { status: 400 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await deleteOrDeactivateProduct(id);

  if (result === "not_found") {
    return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
  }
  if (result === "error") {
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }

  return NextResponse.json({ result });
}
