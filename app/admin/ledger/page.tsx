import Link from "next/link";
import { Metadata } from "next";
import { getBalance, getLedgerEntries } from "@/lib/ledger";
import { formatIDR } from "@/lib/format";
import AddLedgerEntryForm from "@/components/admin/AddLedgerEntryForm";

export const metadata: Metadata = { title: "Ledger — Untai Admin" };
export const dynamic = "force-dynamic";

export default async function AdminLedgerPage() {
  const [{ balance, totalIn, totalOut }, entries] = await Promise.all([
    getBalance(),
    getLedgerEntries(),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Ledger</h1>
        <Link
          href="/admin"
          className="font-body text-sm text-ink/60 hover:text-raspberry"
        >
          ← Dashboard
        </Link>
      </div>
      <p className="mt-2 font-body text-sm text-ink/50">
        An internal record you keep updated yourself — not a live sync with
        your actual DANA balance.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-strap border border-ink/10 p-5">
          <p className="font-body text-xs text-ink/50">Balance</p>
          <p className="mt-1 font-display text-2xl text-ink">
            {formatIDR(balance)}
          </p>
        </div>
        <div className="rounded-strap border border-ink/10 p-5">
          <p className="font-body text-xs text-ink/50">Total in</p>
          <p className="mt-1 font-display text-2xl text-forest">
            {formatIDR(totalIn)}
          </p>
        </div>
        <div className="rounded-strap border border-ink/10 p-5">
          <p className="font-body text-xs text-ink/50">Total out</p>
          <p className="mt-1 font-display text-2xl text-raspberry">
            {formatIDR(totalOut)}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AddLedgerEntryForm />
      </div>

      <div className="mt-8">
        <h2 className="font-display text-lg text-ink">History</h2>
        {entries.length === 0 ? (
          <p className="mt-3 font-body text-sm text-ink/50">No entries yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-ink/10">
            {entries.map((e) => (
              <li key={e.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-body text-sm text-ink">{e.description}</p>
                  <p className="font-body text-xs text-ink/45">
                    {new Date(e.createdAt).toLocaleString("id-ID")}
                    {e.orderId && " · auto"}
                  </p>
                </div>
                <p
                  className={`font-body text-sm font-medium ${
                    e.type === "IN" ? "text-forest" : "text-raspberry"
                  }`}
                >
                  {e.type === "IN" ? "+" : "−"}
                  {formatIDR(e.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
