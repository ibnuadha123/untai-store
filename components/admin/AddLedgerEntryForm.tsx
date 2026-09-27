"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddLedgerEntryForm() {
  const router = useRouter();
  const [type, setType] = useState<"IN" | "OUT">("OUT");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = Number(amount);
    if (!Number.isInteger(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid whole-number amount");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, amount: parsedAmount, description }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save entry");
        return;
      }

      setAmount("");
      setDescription("");
      router.refresh();
    } catch {
      setError("Couldn't reach the server");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-strap border border-ink/10 p-5"
    >
      <p className="font-display text-lg text-ink">Add manual entry</p>
      <p className="mt-1 font-body text-xs text-ink/50">
        For expenses like restocking or shipping paid out of pocket. Income
        from paid orders is added automatically.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr_1fr]">
        <div className="flex gap-2">
          {(["OUT", "IN"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-lg px-3 py-2 font-body text-sm ${
                type === t
                  ? t === "OUT"
                    ? "bg-raspberry text-paper"
                    : "bg-forest text-paper"
                  : "border border-ink/15 text-ink/60"
              }`}
            >
              {t === "OUT" ? "Expense" : "Income"}
            </button>
          ))}
        </div>

        <input
          type="number"
          min={1}
          step={1}
          required
          placeholder="Amount (Rp)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-lg border border-ink/15 bg-paper px-3 py-2 font-body text-ink outline-none focus:border-raspberry"
        />

        <input
          type="text"
          required
          maxLength={200}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="rounded-lg border border-ink/15 bg-paper px-3 py-2 font-body text-ink outline-none focus:border-raspberry"
        />
      </div>

      {error && (
        <p className="mt-3 font-body text-sm text-raspberry">{error}</p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="mt-4 rounded-strap bg-ink px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving…" : "Add entry"}
      </button>
    </form>
  );
}
