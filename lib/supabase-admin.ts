import "server-only";
import { createClient } from "@supabase/supabase-js";

// SERVER ONLY. This client bypasses RLS entirely, so it must never be
// imported from a client component ("use client") or any file that ships
// to the browser. The `server-only` import above will throw a build error
// if that ever happens by accident.
//
// Use this inside app/api/**/route.ts handlers for anything that touches
// orders, order_items, payment_status, or order_status — never expose
// those writes to the anon client.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);