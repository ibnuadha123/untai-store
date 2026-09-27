-- Untai — Phase 7: order creation
-- Run this in the Supabase SQL Editor after schema.sql.

create or replace function create_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_address text,
  p_payment_method text,
  p_items jsonb  -- [{ "product_id": "uuid", "quantity": 2 }, ...]
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
    raise exception 'Invalid payment method';
  end if;

  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;

  -- Pass 1: lock every product row involved (in a stable order, by id, to
  -- avoid deadlocks between two concurrent checkouts with overlapping
  -- carts), validate stock, and accumulate the real subtotal.
  for v_item in
    select * from jsonb_array_elements(p_items) order by (value->>'product_id')
  loop
    v_quantity := (v_item->>'quantity')::integer;
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'Invalid quantity';
    end if;

    select * into v_product
    from products
    where id = (v_item->>'product_id')::uuid
      and is_active = true
    for update;

    if not found then
      raise exception 'One of the items in your cart is no longer available';
    end if;

    if v_product.stock < v_quantity then
      raise exception 'Not enough stock for %: only % left', v_product.name, v_product.stock;
    end if;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  v_shipping := case when v_subtotal >= 150000 then 0 else 15000 end;
  v_total := v_subtotal + v_shipping;

  -- Insert the order, retrying the order number on the rare collision.
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
        raise exception 'Could not generate a unique order number, please try again';
      end if;
    end;
  end loop;

  -- Pass 2: write line items and decrement stock.
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

-- Lock this down to server-side use only. Even though it's security definer
-- (so it can write to orders/order_items despite their empty RLS policies),
-- nothing but the service-role key should be able to call it — the app's
-- own validation and rate-limiting live in the API route, not here.
revoke all on function create_order(text, text, text, text, jsonb) from public;
revoke all on function create_order(text, text, text, text, jsonb) from anon;
revoke all on function create_order(text, text, text, text, jsonb) from authenticated;
grant execute on function create_order(text, text, text, text, jsonb) to service_role;
