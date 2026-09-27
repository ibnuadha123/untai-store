import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

// Strips formatting and normalizes Indonesian phone numbers so "0812...",
// "+62812...", and "62812..." all compare as the same number.
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits.slice(2);
  if (digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function phonesMatch(a: string, b: string): boolean {
  return normalizePhone(a) === normalizePhone(b);
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: "QRIS" | "DANA";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "NEW" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  paymentProofPath: string | null;
  createdAt: string;
  items: {
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderRecord | null> {
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !order) return null;

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("product_name, unit_price, quantity")
    .eq("order_id", order.id);

  return {
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name,
    customerPhone: order.customer_phone,
    customerAddress: order.customer_address,
    subtotal: order.subtotal,
    shippingCost: order.shipping_cost,
    total: order.total,
    paymentMethod: order.payment_method,
    paymentStatus: order.payment_status,
    orderStatus: order.order_status,
    paymentProofPath: order.payment_proof_path,
    createdAt: order.created_at,
    items: (items ?? []).map((i) => ({
      productName: i.product_name,
      unitPrice: i.unit_price,
      quantity: i.quantity,
    })),
  };
}

// Used by the "track my order" page — requires the phone number on file to
// match, so knowing an order number alone isn't enough to view someone
// else's order details.
export async function getOrderByNumberAndPhone(
  orderNumber: string,
  phone: string
): Promise<boolean> {
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("customer_phone")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error || !order) return false;
  return phonesMatch(order.customer_phone, phone);
}
