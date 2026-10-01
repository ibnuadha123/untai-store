import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { syncLedgerForOrderPaymentChange } from "@/lib/ledger";

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED"];
const ORDER_STATUSES = ["NEW", "PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;
  const body = await req.json().catch(() => ({}));

  const updates: Record<string, string> = {};

  if (body.paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(body.paymentStatus)) {
      return NextResponse.json({ error: "Status pembayaran tidak valid" }, { status: 400 });
    }
    updates.payment_status = body.paymentStatus;
  }

  if (body.orderStatus !== undefined) {
    if (!ORDER_STATUSES.includes(body.orderStatus)) {
      return NextResponse.json({ error: "Status pesanan tidak valid" }, { status: 400 });
    }
    updates.order_status = body.orderStatus;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Tidak ada yang diperbarui" }, { status: 400 });
  }

  // Fetch the order's current state first so we can detect a payment
  // status transition and keep stock + ledger in sync with it.
  const { data: existingOrder, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("id, total, payment_status")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (fetchError || !existingOrder) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const newPaymentStatus = updates.payment_status;
  const oldPaymentStatus = existingOrder.payment_status;

  // Stock changes happen BEFORE the status update commits, so if
  // re-reserving stock fails (someone else bought it in the meantime), the
  // order's status is left untouched rather than ending up in a
  // mismatched state.
  if (newPaymentStatus && newPaymentStatus !== oldPaymentStatus) {
    if (newPaymentStatus === "FAILED" && oldPaymentStatus !== "FAILED") {
      const { error: restoreError } = await supabaseAdmin.rpc(
        "restore_stock_for_order",
        { p_order_id: existingOrder.id }
      );
      if (restoreError) {
        return NextResponse.json({ error: restoreError.message }, { status: 500 });
      }
    } else if (oldPaymentStatus === "FAILED" && newPaymentStatus !== "FAILED") {
      const { error: decrementError } = await supabaseAdmin.rpc(
        "decrement_stock_for_order",
        { p_order_id: existingOrder.id }
      );
      if (decrementError) {
        return NextResponse.json({ error: decrementError.message }, { status: 400 });
      }
    }
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update(updates)
    .eq("order_number", orderNumber);

  if (error) {
    return NextResponse.json({ error: "Gagal memperbarui pesanan" }, { status: 500 });
  }

  if (newPaymentStatus && newPaymentStatus !== oldPaymentStatus) {
    await syncLedgerForOrderPaymentChange({
      orderId: existingOrder.id,
      orderNumber,
      previousStatus: oldPaymentStatus,
      newStatus: newPaymentStatus,
      orderTotal: existingOrder.total,
    });
  }

  return NextResponse.json({ success: true });
}
