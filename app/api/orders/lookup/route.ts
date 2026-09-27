import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumberAndPhone } from "@/lib/orders";

export async function POST(req: NextRequest) {
  let body: { orderNumber?: string; phone?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const orderNumber = body.orderNumber?.trim().toUpperCase();
  const phone = body.phone?.trim();

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "Enter both your order number and phone number" },
      { status: 400 }
    );
  }

  const matches = await getOrderByNumberAndPhone(orderNumber, phone);

  if (!matches) {
    return NextResponse.json(
      { error: "No order found with that order number and phone number" },
      { status: 404 }
    );
  }

  return NextResponse.json({ orderNumber }, { status: 200 });
}
