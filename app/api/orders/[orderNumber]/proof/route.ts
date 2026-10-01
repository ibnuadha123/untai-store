import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { phonesMatch } from "@/lib/orders";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  const formData = await req.formData();
  const file = formData.get("file");
  const phone = formData.get("phone");

  if (typeof phone !== "string" || !phone.trim()) {
    return NextResponse.json(
      { error: "Masukkan nomor telepon yang dipakai saat checkout" },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File belum dipilih" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Unggah gambar JPG, PNG, atau WEBP" },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Ukuran file terlalu besar (maks. 5 MB)" },
      { status: 400 }
    );
  }

  // Confirm the order actually exists and is still awaiting payment before
  // accepting an upload for it — an order number alone shouldn't let
  // someone attach a file to an already-paid or nonexistent order.
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .select("id, payment_status, customer_phone")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderError || !order) {
    return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }
  if (!phonesMatch(order.customer_phone, phone)) {
    return NextResponse.json(
      { error: "Nomor telepon tidak cocok dengan pesanan ini" },
      { status: 403 }
    );
  }
  if (order.payment_status !== "PENDING") {
    return NextResponse.json(
      { error: "Pesanan ini sudah tidak menunggu pembayaran" },
      { status: 400 }
    );
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `${orderNumber}/${Date.now()}.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from("payment-proofs")
    .upload(path, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Unggahan gagal, silakan coba lagi" },
      { status: 500 }
    );
  }

  const { error: updateError } = await supabaseAdmin
    .from("orders")
    .update({ payment_proof_path: path })
    .eq("id", order.id);

  if (updateError) {
    return NextResponse.json(
      { error: "File tersimpan tetapi gagal dikaitkan ke pesananmu" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
