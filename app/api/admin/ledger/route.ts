import { NextRequest, NextResponse } from "next/server";
import { addManualLedgerEntry } from "@/lib/ledger";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { type, amount, description } = body;

  if (type !== "IN" && type !== "OUT") {
    return NextResponse.json({ error: "Jenis catatan tidak valid" }, { status: 400 });
  }
  if (!Number.isInteger(amount) || amount <= 0) {
    return NextResponse.json({ error: "Masukkan nominal yang valid" }, { status: 400 });
  }
  if (typeof description !== "string" || !description.trim()) {
    return NextResponse.json({ error: "Masukkan keterangan" }, { status: 400 });
  }

  const { error } = await addManualLedgerEntry({
    type,
    amount,
    description: description.trim(),
  });

  if (error) {
    return NextResponse.json({ error: "Gagal menyimpan catatan" }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
