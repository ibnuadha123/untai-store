import { supabase } from "@/lib/supabase";
import { Product } from "@/types/product";

// Reads through the public anon client, so this only ever returns rows
// allowed by the "Public can view active products" RLS policy — active
// products, nothing else. No extra filtering is strictly required here,
// but the explicit .eq keeps the intent obvious in code, not just in SQL.
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    stock: row.stock,
    category: row.category,
    imageUrl: row.image_url,
    secondaryImageUrl: row.secondary_image_url ?? undefined,
    isFeatured: row.is_featured,
    isActive: row.is_active,
  }));
}