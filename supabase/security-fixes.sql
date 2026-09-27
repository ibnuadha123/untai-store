-- Untai — Phase 14 security review fixes
-- Run this in the Supabase SQL Editor.

-- Tracks whether an order's stock has already been given back, so marking
-- an order FAILED twice (or any other repeat transition) can't double-count
-- the restoration.
alter table orders add column if not exists stock_restored boolean not null default false;

-- Called when an order transitions INTO FAILED. Gives back the stock it
-- was holding. Safe to call more than once — a no-op if already restored.
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
    raise exception 'Order not found';
  end if;

  if v_already_restored then
    return; -- already done, nothing to do
  end if;

  for v_item in
    select product_id, quantity from order_items where order_id = p_order_id
  loop
    update products set stock = stock + v_item.quantity where id = v_item.product_id;
  end loop;

  update orders set stock_restored = true where id = p_order_id;
end;
$$;

-- Called when an order transitions AWAY from FAILED back to PENDING/PAID —
-- an admin correcting a mistake. Re-checks and re-reserves stock the same
-- way create_order does (row locks, real validation), raising an exception
-- if the stock is no longer available. Safe to call when nothing needs
-- decrementing — a no-op if stock was never restored in the first place.
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
    raise exception 'Order not found';
  end if;

  if not v_was_restored then
    return; -- stock was never given back, nothing to re-take
  end if;

  for v_item in
    select product_id, quantity from order_items where order_id = p_order_id
    order by product_id
  loop
    select * into v_product from products where id = v_item.product_id for update;

    if not found or v_product.stock < v_item.quantity then
      raise exception 'Not enough stock for % to restore this order', coalesce(v_product.name, v_item.product_id::text);
    end if;

    update products set stock = stock - v_item.quantity where id = v_item.product_id;
  end loop;

  update orders set stock_restored = false where id = p_order_id;
end;
$$;

revoke all on function restore_stock_for_order(uuid) from public, anon, authenticated;
grant execute on function restore_stock_for_order(uuid) to service_role;

revoke all on function decrement_stock_for_order(uuid) from public, anon, authenticated;
grant execute on function decrement_stock_for_order(uuid) to service_role;
