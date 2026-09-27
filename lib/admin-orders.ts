import "server-only";
import { supabaseAdmin } from "@/lib/supabase-admin";

export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  paymentMethod: "QRIS" | "DANA";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  orderStatus: "NEW" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  createdAt: string;
}

export async function getAllOrders(): Promise<AdminOrderSummary[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, order_number, customer_name, total, payment_method, payment_status, order_status, created_at"
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((o) => ({
    id: o.id,
    orderNumber: o.order_number,
    customerName: o.customer_name,
    total: o.total,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    orderStatus: o.order_status,
    createdAt: o.created_at,
  }));
}

export interface AdminOrderDetail {
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
  createdAt: string;
  paymentProofUrl: string | null;
  items: { productName: string; unitPrice: number; quantity: number }[];
}

export async function getOrderDetailForAdmin(
  orderNumber: string
): Promise<AdminOrderDetail | null> {
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

  // Bucket is private, so a plain public URL wouldn't work — this mints a
  // temporary signed URL, valid for 1 hour, only when an admin loads the
  // page. It's never stored anywhere.
  let paymentProofUrl: string | null = null;
  if (order.payment_proof_path) {
    const { data: signed } = await supabaseAdmin.storage
      .from("payment-proofs")
      .createSignedUrl(order.payment_proof_path, 60 * 60);
    paymentProofUrl = signed?.signedUrl ?? null;
  }

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
    createdAt: order.created_at,
    paymentProofUrl,
    items: (items ?? []).map((i) => ({
      productName: i.product_name,
      unitPrice: i.unit_price,
      quantity: i.quantity,
    })),
  };
}
