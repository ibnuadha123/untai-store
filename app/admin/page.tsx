import Link from "next/link";
import { Metadata } from "next";
import { getAllOrders } from "@/lib/admin-orders";
import { getBalance } from "@/lib/ledger";
import { formatIDR } from "@/lib/format";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

export const metadata: Metadata = { title: "Admin — Untai" };
export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [orders, { balance }] = await Promise.all([getAllOrders(), getBalance()]);
  const pendingCount = orders.filter((o) => o.paymentStatus === "PENDING").length;
  const paidCount = orders.filter((o) => o.paymentStatus === "PAID").length;

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Admin</h1>
        <AdminLogoutButton />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-strap border border-ink/10 p-5">
          <p className="font-body text-xs text-ink/50">Balance</p>
          <p className="mt-1 font-display text-2xl text-ink">{formatIDR(balance)}</p>
        </div>
        <div className="rounded-strap border border-ink/10 p-5">
          <p className="font-body text-xs text-ink/50">Total orders</p>
          <p className="mt-1 font-display text-2xl text-ink">{orders.length}</p>
        </div>
        <div className="rounded-strap border border-ink/10 p-5">
          <p className="font-body text-xs text-ink/50">Awaiting payment</p>
          <p className="mt-1 font-display text-2xl text-ink">{pendingCount}</p>
        </div>
        <div className="rounded-strap border border-ink/10 p-5">
          <p className="font-body text-xs text-ink/50">Paid</p>
          <p className="mt-1 font-display text-2xl text-ink">{paidCount}</p>
        </div>
      </div>

      <nav className="mt-10 flex flex-col gap-3">
        <Link
          href="/admin/orders"
          className="rounded-strap border border-ink/15 px-5 py-4 font-body text-ink transition-colors hover:border-raspberry hover:text-raspberry"
        >
          Orders →
        </Link>
        <Link
          href="/admin/ledger"
          className="rounded-strap border border-ink/15 px-5 py-4 font-body text-ink transition-colors hover:border-raspberry hover:text-raspberry"
        >
          Ledger →
        </Link>
      </nav>
    </main>
  );
}
