import { createClient } from "@supabase/supabase-js";

// Safe to import from client components. Reads and writes through this
// client are governed entirely by the RLS policies in supabase/schema.sql —
// currently, that means read-only access to active products and nothing
// else. It can never read or write orders directly.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);