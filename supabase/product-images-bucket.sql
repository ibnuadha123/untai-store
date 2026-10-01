-- Untai — Fase F: bucket penyimpanan foto produk
-- Jalankan di Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Catatan: tidak perlu policy RLS tambahan di sini.
-- - Baca (lihat foto): karena bucket ini "public", gambar bisa diakses
--   lewat URL publiknya tanpa perlu lolos RLS sama sekali.
-- - Tulis (upload/hapus): hanya dilakukan lewat panel admin, yang di balik
--   layar memakai service-role key — kunci ini sudah melewati semua RLS,
--   jadi tidak butuh policy insert/update/delete terpisah.
