"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { PRODUCT_CATEGORIES } from "@/lib/product-categories";
import { categoryLabel, label } from "@/lib/labels";

interface ProductFormProps {
  product?: Product; // undefined = mode tambah baru
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEditMode = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [stock, setStock] = useState(product ? String(product.stock) : "");
  const [category, setCategory] = useState(product?.category ?? PRODUCT_CATEGORIES[0]);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl ?? null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isEditMode && !imageFile) {
      setError("Gambar produk wajib diisi untuk produk baru");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("isFeatured", String(isFeatured));
      formData.append("isActive", String(isActive));
      if (imageFile) formData.append("image", imageFile);

      const url = isEditMode
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const res = await fetch(url, {
        method: isEditMode ? "PATCH" : "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Gagal menyimpan produk");
        setIsSaving(false);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Tidak bisa terhubung ke server");
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex items-start gap-4">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-cloud">
          {imagePreview && (
            <Image src={imagePreview} alt="" fill className="object-cover" unoptimized />
          )}
        </div>
        <div>
          <label className="font-body text-sm text-ink/70">
            Gambar produk {!isEditMode && "(wajib)"}
          </label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="mt-1 block font-body text-sm text-ink/70 file:mr-3 file:rounded-full file:border file:border-ink/15 file:bg-paper file:px-4 file:py-2 file:font-body file:text-sm file:text-ink hover:file:border-raspberry"
          />
          <p className="mt-1 font-body text-xs text-ink/45">
            JPG, PNG, atau WEBP, maks. 5 MB.{" "}
            {isEditMode && "Kosongkan jika tidak ingin mengganti gambar."}
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="name" className="font-body text-sm text-ink/70">
          Nama produk
        </label>
        <input
          id="name"
          type="text"
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
        />
      </div>

      <div>
        <label htmlFor="description" className="font-body text-sm text-ink/70">
          Deskripsi
        </label>
        <textarea
          id="description"
          required
          maxLength={2000}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full resize-none rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="font-body text-sm text-ink/70">
            Harga (Rp)
          </label>
          <input
            id="price"
            type="number"
            required
            min={0}
            step={1}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
          />
        </div>
        <div>
          <label htmlFor="stock" className="font-body text-sm text-ink/70">
            Stok
          </label>
          <input
            id="stock"
            type="number"
            required
            min={0}
            step={1}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category" className="font-body text-sm text-ink/70">
          Kategori
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as typeof category)}
          className="mt-1 w-full rounded-xl border border-ink/15 bg-paper px-4 py-2.5 font-body text-ink outline-none focus:border-raspberry"
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {label(categoryLabel, c)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 font-body text-sm text-ink/70">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="h-4 w-4 accent-raspberry"
          />
          Unggulan (tampil di beranda)
        </label>
        <label className="flex items-center gap-2 font-body text-sm text-ink/70">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 accent-raspberry"
          />
          Aktif (tampil di toko)
        </label>
      </div>

      {error && (
        <p className="rounded-xl bg-raspberry/10 px-4 py-3 font-body text-sm text-raspberry">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-2 w-full rounded-strap bg-raspberry py-3 font-body text-base font-medium text-paper transition-colors hover:bg-raspberry-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Menyimpan…" : isEditMode ? "Simpan perubahan" : "Tambah produk"}
      </button>
    </form>
  );
}
