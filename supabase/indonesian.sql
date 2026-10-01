-- Untai — Fase B/D: pesan error berbahasa Indonesia + deskripsi produk baru
-- Jalankan di Supabase SQL Editor. Aman dijalankan ulang.

-- ============================================================
-- 1. Fungsi database: logika sama persis, hanya pesan error yang diterjemahkan
-- ============================================================
create or replace function create_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_payment_method text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal integer := 0;
  v_shipping integer;
  v_total integer;
  v_item jsonb;
  v_product products%rowtype;
  v_quantity integer;
  v_attempt integer := 0;
begin
  if p_payment_method not in ('QRIS', 'DANA') then
    raise exception 'Metode pembayaran tidak valid';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Keranjang kosong';
  end if;

  for v_item in
    select * from jsonb_array_elements(p_items) order by (value->>'product_id')
  loop
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Jumlah tidak valid';
    end if;

    select * into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and is_active = true
    for update;

    if not found then
      raise exception 'Salah satu item di keranjangmu sudah tidak tersedia';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Stok % tidak cukup, tersisa %', v_product.name, v_product.stock;
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  v_shipping := case when v_subtotal >= 150000 then 0 else 15000 end;
  v_total := v_subtotal + v_shipping;

  loop
    v_attempt := v_attempt + 1;
    v_order_number := 'UNT-' || to_char(now(), 'YYMMDD') || '-' ||
                       upper(substr(md5(random()::text || clock_timestamp()::text), 1, 5));
    begin
      insert into orders (
        order_number, customer_name, customer_phone, customer_address,
        subtotal, shipping_cost, total, payment_method
      )
      values (
        v_order_number, p_customer_name, p_customer_phone, p_customer_address,
        v_subtotal, v_shipping, v_total, p_payment_method
      )
      returning id into v_order_id;
      exit;
    exception when unique_violation then
      if v_attempt >= 5 then
        raise exception 'Gagal membuat nomor pesanan unik, silakan coba lagi';
      end if;
    end;
  end loop;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;

    select * into v_product from products where id = (v_item->>'product_id')::uuid;

    insert into order_items (order_id, product_id, product_name, unit_price, quantity)
    values (v_order_id, v_product.id, v_product.name, v_product.price, v_quantity);

    update products set stock = stock - v_quantity where id = v_product.id;
  end loop;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'shipping_cost', v_shipping,
    'total', v_total
  );
end;
$$;

create or replace function restore_stock_for_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_already_restored boolean;
  v_item record;
begin
  select stock_restored into v_already_restored from orders where id = p_order_id;

  if v_already_restored is null then
    raise exception 'Pesanan tidak ditemukan';
  end if;

  if v_already_restored then
    return;
  end if;

  for v_item in
    select product_id, quantity from order_items where order_id = p_order_id
  loop
    update products set stock = stock + v_item.quantity where id = v_item.product_id;
  end loop;

  update orders set stock_restored = true where id = p_order_id;
end;
$$;

create or replace function decrement_stock_for_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_was_restored boolean;
  v_item record;
  v_product products%rowtype;
begin
  select stock_restored into v_was_restored from orders where id = p_order_id;

  if v_was_restored is null then
    raise exception 'Pesanan tidak ditemukan';
  end if;

  if not v_was_restored then
    return;
  end if;

  for v_item in
    select product_id, quantity from order_items where order_id = p_order_id
    order by product_id
  loop
    select * into v_product from products where id = v_item.product_id for update;

    if not found or v_product.stock < v_item.quantity then
      raise exception 'Stok % tidak cukup untuk memulihkan pesanan ini', coalesce(v_product.name, v_item.product_id::text);
    end if;

    update products set stock = stock - v_item.quantity where id = v_item.product_id;
  end loop;

  update orders set stock_restored = false where id = p_order_id;
end;
$$;

-- Hak akses tetap seperti sebelumnya: hanya service_role yang boleh menjalankan.
revoke all on function create_order(text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function create_order(text, text, text, text, jsonb) to service_role;
revoke all on function restore_stock_for_order(uuid) from public, anon, authenticated;
grant execute on function restore_stock_for_order(uuid) to service_role;
revoke all on function decrement_stock_for_order(uuid) from public, anon, authenticated;
grant execute on function decrement_stock_for_order(uuid) to service_role;


-- ============================================================
-- 2. Deskripsi produk baru (tanpa klaim bahan)
--    Nanti bisa diubah kapan saja lewat panel admin (Fase F).
-- ============================================================
update products set description = 'Untaian manik hangat bernuansa senja. Dinamai senja, saat langit Indonesia berwarna keemasan.'
  where slug = 'senja-beaded-strap';

update products set description = 'Untaian manik bernuansa hijau hutan yang tenang, mudah dipadukan dengan gaya apa pun.'
  where slug = 'hutan-beaded-strap';

update products set description = 'Strap anyaman datar dengan warna tanah yang hangat, nyaman dipakai setiap hari.'
  where slug = 'anyam-clay-woven-strap';

update products set description = 'Strap anyaman berwarna zaitun, pilihan yang lebih kalem dari Anyam Clay.'
  where slug = 'anyam-olive-woven-strap';

update products set description = 'Strap ramping berwarna gelap, pilihan paling minimalis di koleksi ini.'
  where slug = 'kulit-slim-leather-strap';

update products set description = 'Gugusan kecil charm dan manik-manik yang bisa dikaitkan ke strap mana pun. Dijual terpisah supaya bisa kamu padukan dengan koleksimu sendiri.'
  where slug = 'manik-charm-cluster';
