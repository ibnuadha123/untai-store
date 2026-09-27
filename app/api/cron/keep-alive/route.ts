import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Vercel automatically attaches "Authorization: Bearer <CRON_SECRET>" to
// requests it triggers via vercel.json's cron schedule, as long as a
// CRON_SECRET env var exists in the project. Checking it here means this
// endpoint can't be triggered (and spammed) by anyone who just finds the
// URL — only Vercel's own scheduler.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Any real query counts as activity toward Supabase's free-tier
  // inactivity check — this one is intentionally trivial and read-only.
  const { error } = await supabase.from("products").select("id").limit(1);

  if (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, timestamp: new Date().toISOString() });
}
