import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderDetailForAdmin } from "@/lib/admin-orders";
import { formatIDR } from "@/lib/format";
import OrderStatusEditor from "@/components/admin/OrderStatusEditor";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `${orderNumber} — Untai Admin` };
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderDetailForAdmin(orderNumber);

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link
        href="/admin/orders"
        className="font-body text-sm text-ink/60 hover:text-raspberry"
      >
        ← All orders
      </Link>
      <h1 className="mt-2 font-display text-3xl text-ink">
        {order.orderNumber}
      </h1>
      <p className="mt-1 font-body text-sm text-ink/50">
        {new Date(order.createdAt).toLocaleString("id-ID")}
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="font-display text-lg text-ink">Customer</h2>
          <p className="mt-2 font-body text-sm text-ink/70">
            {order.customerName}
          </p>
          <p className="font-body text-sm text-ink/70">
            {order.customerPhone}
          </p>
          <p className="font-body text-sm text-ink/70">
            {order.customerAddress}
          </p>
        </div>
        <div>
          <h2 className="font-display text-lg text-ink">Payment</h2>
          <p className="mt-2 font-body text-sm text-ink/70">
            Method: {order.paymentMethod}
          </p>
          <p className="font-body text-sm text-ink/70">
            Payment status: {order.paymentStatus}
          </p>
          <p className="font-body text-sm text-ink/70">
            Order status: {order.orderStatus}
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-strap border border-ink/10 p-6">
        <h2 className="font-display text-lg text-ink">Items</h2>
        <ul className="mt-3 divide-y divide-ink/10">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-3 font-body text-sm">
              <span className="text-ink/80">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-ink/60">
                {formatIDR(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-ink/10 pt-4 font-body text-sm">
          <div className="flex justify-between text-ink/60">
            <span>Subtotal</span>
            <span>{formatIDR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/60">
            <span>Shipping</span>
            <span>
              {order.shippingCost === 0
                ? "Free"
                : formatIDR(order.shippingCost)}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base font-medium text-ink">
            <span>Total</span>
            <span>{formatIDR(order.total)}</span>
          </div>
        </div>
      </div>

      {order.paymentProofUrl ? (
        <div className="mt-8">
          <h2 className="font-display text-lg text-ink">Payment proof</h2>
          <a
            href={order.paymentProofUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block w-fit"
          >
            <div className="relative h-64 w-64 overflow-hidden rounded-strap border border-ink/10 bg-cloud">
              <Image
                src={order.paymentProofUrl}
                alt="Payment proof screenshot"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </a>
          <p className="mt-1 font-body text-xs text-ink/45">
            Click to open full size. This link expires after 1 hour — reload
            the page for a fresh one.
          </p>
        </div>
      ) : (
        <p className="mt-8 font-body text-sm text-ink/50">
          No payment proof uploaded yet.
        </p>
      )}

      <div className="mt-8">
        <OrderStatusEditor
          orderNumber={order.orderNumber}
          paymentStatus={order.paymentStatus}
          orderStatus={order.orderStatus}
        />
      </div>
    </main>
  );
}
