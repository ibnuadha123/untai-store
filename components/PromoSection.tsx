const items = [
  {
    title: "Pay your way",
    detail: "Checkout with QRIS or DANA — no card required.",
  },
  {
    title: "Free shipping over Rp150.000",
    detail: "Anywhere in Indonesia via our usual courier partners.",
  },
  {
    title: "Small batches",
    detail: "Most colorways are made in runs of 12–20 pieces.",
  },
];

export default function PromoSection() {
  return (
    <section className="border-y border-ink/10 bg-cloud px-6 py-12">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title}>
            <p className="font-display text-xl text-ink">{item.title}</p>
            <p className="mt-1 font-body text-sm text-ink/60">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
