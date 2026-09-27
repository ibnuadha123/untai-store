import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders";
import { formatIDR } from "@/lib/format";
import { paymentInfo } from "@/lib/payment-info";
import PaymentProofUpload from "@/components/PaymentProofUpload";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Order ${orderNumber} — Untai` };
}

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-body text-sm text-forest">Order placed</p>
      <h1 className="mt-1 font-display text-4xl text-ink">
        {order.orderNumber}
      </h1>
      <p className="mt-3 font-body text-ink/60">
        Thanks, {order.customerName.split(" ")[0]} — we&apos;ve got your
        order. Save this page&apos;s link, or come back later at{" "}
        <span className="font-medium text-ink">/track</span> with your order
        number and phone number.
      </p>

      <div className="mt-8 rounded-strap border border-ink/10 p-6">
        <ul className="divide-y divide-ink/10">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between py-3">
              <span className="font-body text-sm text-ink/80">
                {item.productName} × {item.quantity}
              </span>
              <span className="font-body text-sm text-ink/60">
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

      <div className="mt-6 rounded-strap bg-cloud p-6">
        <p className="font-display text-lg text-ink">
          Pay via {order.paymentMethod}
        </p>

        {order.paymentStatus !== "PENDING" ? (
          <p className="mt-2 font-body text-sm text-ink/60">
            This order is marked{" "}
            <span className="font-medium text-ink">{order.paymentStatus}</span>.
          </p>
        ) : order.paymentMethod === "QRIS" ? (
          <div className="mt-4">
            {paymentInfo.qris.isPlaceholder && (
              <p className="mb-3 rounded-lg bg-gold/20 px-3 py-2 font-body text-xs text-ink/70">
                Sample QR shown — the store owner needs to add a real QRIS
                code in lib/payment-info.ts before this goes live.
              </p>
            )}
            <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl bg-paper">
              <Image
                src={paymentInfo.qris.imagePath}
                alt="QRIS payment code"
                fill
                className="object-contain p-3"
              />
            </div>
            <p className="mt-4 text-center font-body text-sm text-ink/70">
              Scan with any e-wallet or mobile banking app that supports
              QRIS, and enter this exact amount:
            </p>
            <p className="text-center font-display text-2xl text-ink">
              {formatIDR(order.total)}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="font-body text-sm text-ink/60">Send to DANA number</p>
            <p className="font-display text-2xl text-ink">
              {paymentInfo.dana.number}
            </p>
            <p className="font-body text-sm text-ink/60">
              a/n {paymentInfo.dana.accountName}
            </p>
            <p className="mt-4 font-body text-sm text-ink/70">
              Transfer this exact amount, and include your order number in
              the transfer note:
            </p>
            <p className="font-display text-2xl text-ink">
              {formatIDR(order.total)}
            </p>
            <p className="mt-1 font-body text-sm text-ink/60">
              Note: {order.orderNumber}
            </p>
          </div>
        )}

        {order.paymentStatus === "PENDING" && (
          <PaymentProofUpload
            orderNumber={order.orderNumber}
            alreadyUploaded={!!order.paymentProofPath}
          />
        )}
      </div>
    </main>
  );
}
