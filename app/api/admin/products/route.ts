import { NextRequest, NextResponse } from "next/server";
import { createProduct } from "@/lib/admin-products";
import { parseProductForm } from "@/lib/parse-product-form";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const parsed = parseProductForm(formData);
  if ("error" in parsed) return parsed.error;

  const { product, error } = await createProduct(parsed.input);
  if (error || !product) {
    return NextResponse.json({ error: error ?? "Gagal menyimpan produk" }, { status: 400 });
  }

  return NextResponse.json({ product }, { status: 201 });
}
