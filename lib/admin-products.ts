import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Product } from "@/types/product";
import { ProductCategory } from "@/lib/product-categories";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapRow(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    description: row.description as string,
    price: row.price as number,
    stock: row.stock as number,
    category: row.category as Product["category"],
    imageUrl: row.image_url as string,
    secondaryImageUrl: (row.secondary_image_url as string) ?? undefined,
    isFeatured: row.is_featured as boolean,
    isActive: row.is_active as boolean,
  };
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getProductByIdAdmin(id: string): Promise<Product | null> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;
  return mapRow(data);
}

async function uploadProductImage(file: File, slugHint: string): Promise<string> {
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${slugHint}-${Date.now()}.${extension}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error } = await supabaseAdmin.storage
    .from("product-images")
    .upload(path, arrayBuffer, { contentType: file.type, upsert: false });

  if (error) throw new Error("Gagal mengunggah gambar");

  const { data } = supabaseAdmin.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  isFeatured: boolean;
  isActive: boolean;
  imageFile: File | null;
}

export async function createProduct(
  input: ProductInput
): Promise<{ product: Product | null; error: string | null }> {
  if (!input.imageFile) {
    return { product: null, error: "Gambar produk wajib diisi" };
  }

  const slug = slugify(input.name);
  if (!slug) {
    return { product: null, error: "Nama produk tidak valid" };
  }

  let imageUrl: string;
  try {
    imageUrl = await uploadProductImage(input.imageFile, slug);
  } catch {
    return { product: null, error: "Gagal mengunggah gambar" };
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      name: input.name,
      slug,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category: input.category,
      image_url: imageUrl,
      is_featured: input.isFeatured,
      is_active: input.isActive,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return {
        product: null,
        error: "Sudah ada produk dengan nama yang menghasilkan slug sama. Coba nama lain.",
      };
    }
    return { product: null, error: "Gagal menyimpan produk" };
  }

  return { product: mapRow(data), error: null };
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<{ product: Product | null; error: string | null }> {
  const existing = await getProductByIdAdmin(id);
  if (!existing) {
    return { product: null, error: "Produk tidak ditemukan" };
  }

  let imageUrl = existing.imageUrl;
  if (input.imageFile) {
    try {
      imageUrl = await uploadProductImage(input.imageFile, existing.slug);
    } catch {
      return { product: null, error: "Gagal mengunggah gambar" };
    }
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      category: input.category,
      image_url: imageUrl,
      is_featured: input.isFeatured,
      is_active: input.isActive,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return { product: null, error: "Gagal memperbarui produk" };
  }

  return { product: mapRow(data), error: null };
}

export type DeleteResult = "deleted" | "deactivated" | "not_found" | "error";

// Deletes a product outright if it has no order history; otherwise
// deactivates it instead, since order_items.product_id references it and
// deleting would either fail (FK constraint) or corrupt past orders.
export async function deleteOrDeactivateProduct(id: string): Promise<DeleteResult> {
  const { count, error: countError } = await supabaseAdmin
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);

  if (countError) return "error";

  if (count && count > 0) {
    const { error } = await supabaseAdmin
      .from("products")
      .update({ is_active: false })
      .eq("id", id);
    return error ? "error" : "deactivated";
  }

  const { error, count: deleteCount } = await supabaseAdmin
    .from("products")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) return "error";
  return deleteCount && deleteCount > 0 ? "deleted" : "not_found";
}
