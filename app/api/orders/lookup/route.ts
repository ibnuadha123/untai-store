import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumberAndPhone } from "@/lib/orders";

export async function POST(req: NextRequest) {
  let body: { orderNumber?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Permintaan tidak valid" }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim().toUpperCase();
  const phone = body.phone?.trim();

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "Masukkan nomor pesanan dan nomor teleponmu" },
      { status: 400 }
    );
  }

  const matches = await getOrderByNumberAndPhone(orderNumber, phone);

  if (!matches) {
    return NextResponse.json(
      { error: "Pesanan dengan nomor pesanan dan nomor telepon tersebut tidak ditemukan" },
      { status: 404 }
    );
  }

  return NextResponse.json({ orderNumber }, { status: 200 });
}
