-- Untai — Phase 13: ledger / balance tracking
-- Run this in the Supabase SQL Editor.

create table if not exists ledger_entries (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('IN', 'OUT')),
  amount integer not null check (amount >= 0),
  description text not null,
  -- Set only for entries auto-created when an order is marked PAID.
  -- Manual entries (expenses, adjustments) leave this null.
  order_id uuid references orders(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table ledger_entries enable row level security;
-- No anon/authenticated policies — same pattern as orders. Only the
-- service-role key (used server-side in /api/admin routes, which are
-- already gated by the admin session middleware) can read or write this.
