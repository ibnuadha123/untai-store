import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutBody {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: "QRIS" | "DANA";
  items: CheckoutItem[];
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  let body: CheckoutBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  const { customerName, customerPhone, customerAddress, paymentMethod, items } = body;

  // Defense-in-depth validation at the API layer — the DB function also
  // validates, but failing fast here gives clearer error messages and
  // avoids a round trip for obviously malformed requests.
  if (!customerName?.trim() || customerName.trim().length > 100) {
    return NextResponse.json({ error: "Masukkan namamu" }, { status: 400 });
  }
  if (!customerPhone?.trim() || customerPhone.trim().length > 20) {
    return NextResponse.json({ error: "Masukkan nomor telepon yang valid" }, { status: 400 });
  }
  if (!customerAddress?.trim() || customerAddress.trim().length > 500) {
    return NextResponse.json({ error: "Masukkan alamat pengirimanmu" }, { status: 400 });
  }
  if (paymentMethod !== "QRIS" && paymentMethod !== "DANA") {
    return NextResponse.json({ error: "Pilih metode pembayaran" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Keranjangmu kosong" }, { status: 400 });
  }
  for (const item of items) {
    if (!UUID_RE.test(item.productId)) {
      return NextResponse.json({ error: "Ada item tidak valid di keranjang" }, { status: 400 });
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 99) {
      return NextResponse.json({ error: "Jumlah di keranjang tidak valid" }, { status: 400 });
    }
  }

  const { data, error } = await supabaseAdmin.rpc("create_order", {
    p_customer_name: customerName.trim(),
    p_customer_phone: customerPhone.trim(),
    p_customer_address: customerAddress.trim(),
    p_payment_method: paymentMethod,
    p_items: items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
  });

  if (error) {
    // Postgres exception messages from create_order are written to be
    // customer-safe (e.g. "Not enough stock for X: only 2 left"), so it's
    // fine to pass them straight through.
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
