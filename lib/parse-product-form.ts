import { NextResponse } from "next/server";
import { ProductInput } from "@/lib/admin-products";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";

export function parseProductForm(
  formData: FormData
): { input: ProductInput } | { error: NextResponse } {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = formData.get("price");
  const stockRaw = formData.get("stock");
  const category = String(formData.get("category") ?? "");
  const isFeatured = formData.get("isFeatured") === "true";
  const isActive = formData.get("isActive") === "true";
  const imageFile = formData.get("image");

  if (!name || name.length > 100) {
    return { error: NextResponse.json({ error: "Nama produk wajib diisi" }, { status: 400 }) };
  }
  if (!description || description.length > 2000) {
    return { error: NextResponse.json({ error: "Deskripsi wajib diisi" }, { status: 400 }) };
  }

  const price = Number(priceRaw);
  if (!Number.isInteger(price) || price < 0) {
    return { error: NextResponse.json({ error: "Harga tidak valid" }, { status: 400 }) };
  }

  const stock = Number(stockRaw);
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: NextResponse.json({ error: "Stok tidak valid" }, { status: 400 }) };
  }

  if (!PRODUCT_CATEGORIES.includes(category as (typeof PRODUCT_CATEGORIES)[number])) {
    return { error: NextResponse.json({ error: "Kategori tidak valid" }, { status: 400 }) };
  }

  if (imageFile !== null && !(imageFile instanceof File)) {
    return { error: NextResponse.json({ error: "Gambar tidak valid" }, { status: 400 }) };
  }
  if (imageFile instanceof File) {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(imageFile.type)) {
      return {
        error: NextResponse.json(
          { error: "Gambar harus berformat JPG, PNG, atau WEBP" },
          { status: 400 }
        ),
      };
    }
    if (imageFile.size > 5 * 1024 * 1024) {
      return {
        error: NextResponse.json(
          { error: "Ukuran gambar terlalu besar (maks. 5 MB)" },
          { status: 400 }
        ),
      };
    }
  }

  return {
    input: {
      name,
      description,
      price,
      stock,
      category: category as (typeof PRODUCT_CATEGORIES)[number],
      isFeatured,
      isActive,
      imageFile: imageFile instanceof File ? imageFile : null,
    },
  };
}
