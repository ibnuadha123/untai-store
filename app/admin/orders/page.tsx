import Link from "next/link";
import { Metadata } from "next";
import { getAllOrders } from "@/lib/admin-orders";
import { formatIDR } from "@/lib/format";

export const metadata: Metadata = { title: "Orders — Untai Admin" };
export const dynamic = "force-dynamic";

const paymentBadgeClass: Record<string, string> = {
  PENDING: "bg-gold/20 text-ink",
  PAID: "bg-forest/15 text-forest",
  FAILED: "bg-raspberry/15 text-raspberry",
};

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Orders</h1>
        <Link
          href="/admin"
          className="font-body text-sm text-ink/60 hover:text-raspberry"
        >
          ← Dashboard
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="mt-8 font-body text-ink/60">No orders yet.</p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/10 font-body text-sm text-ink/50">
                <th className="py-3 pr-4 font-normal">Order</th>
                <th className="py-3 pr-4 font-normal">Customer</th>
                <th className="py-3 pr-4 font-normal">Total</th>
                <th className="py-3 pr-4 font-normal">Payment</th>
                <th className="py-3 pr-4 font-normal">Status</th>
                <th className="py-3 pr-4 font-normal">Date</th>
              </tr>
            </thead>
            <tbody className="font-body text-sm text-ink">
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-ink/5 hover:bg-cloud">
                  <td className="py-3 pr-4">
                    <Link
                      href={`/admin/orders/${o.orderNumber}`}
                      className="text-raspberry hover:underline"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{o.customerName}</td>
                  <td className="py-3 pr-4">{formatIDR(o.total)}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${paymentBadgeClass[o.paymentStatus]}`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-ink/70">{o.orderStatus}</td>
                  <td className="py-3 pr-4 text-ink/50">
                    {new Date(o.createdAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
