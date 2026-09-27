import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export interface LedgerEntry {
  id: string;
  type: "IN" | "OUT";
  amount: number;
  description: string;
  orderId: string | null;
  createdAt: string;
}

export async function getLedgerEntries(): Promise<LedgerEntry[]> {
  const { data, error } = await supabaseAdmin
    .from("ledger_entries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((e) => ({
    id: e.id,
    type: e.type,
    amount: e.amount,
    description: e.description,
    orderId: e.order_id,
    createdAt: e.created_at,
  }));
}

export async function getBalance(): Promise<{
  balance: number;
  totalIn: number;
  totalOut: number;
}> {
  const entries = await getLedgerEntries();
  const totalIn = entries
    .filter((e) => e.type === "IN")
    .reduce((sum, e) => sum + e.amount, 0);
  const totalOut = entries
    .filter((e) => e.type === "OUT")
    .reduce((sum, e) => sum + e.amount, 0);

  return { balance: totalIn - totalOut, totalIn, totalOut };
}

export async function addManualLedgerEntry(entry: {
  type: "IN" | "OUT";
  amount: number;
  description: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabaseAdmin.from("ledger_entries").insert({
    type: entry.type,
    amount: entry.amount,
    description: entry.description,
    order_id: null,
  });

  return { error: error ? error.message : null };
}

// Called whenever an order's payment_status changes. Keeps exactly one
// auto-generated income entry per order in sync with its current PAID
// state — adds one on PENDING/FAILED → PAID, removes it on PAID → anything
// else, and does nothing for transitions that don't cross that boundary.
export async function syncLedgerForOrderPaymentChange(params: {
  orderId: string;
  orderNumber: string;
  previousStatus: string;
  newStatus: string;
  orderTotal: number;
}): Promise<void> {
  const { orderId, orderNumber, previousStatus, newStatus, orderTotal } = params;

  if (previousStatus === newStatus) return;

  if (newStatus === "PAID" && previousStatus !== "PAID") {
    // Guard against double-insertion if this were ever called twice.
    const { data: existing } = await supabaseAdmin
      .from("ledger_entries")
      .select("id")
      .eq("order_id", orderId)
      .maybeSingle();

    if (!existing) {
      await supabaseAdmin.from("ledger_entries").insert({
        type: "IN",
        amount: orderTotal,
        description: `Order ${orderNumber}`,
        order_id: orderId,
      });
    }
  } else if (previousStatus === "PAID" && newStatus !== "PAID") {
    await supabaseAdmin.from("ledger_entries").delete().eq("order_id", orderId);
  }
}
