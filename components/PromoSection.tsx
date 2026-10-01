const items = [
  {
    title: "Bayar dengan cara yang kamu suka",
    detail: "Checkout dengan QRIS atau DANA, tanpa perlu kartu.",
  },
  {
    title: "Berbagai tema yang bisa dipilih",
    detail: "Pilih tema yang paling kamu sukai untuk membuat strap yang unik.",
  },
  {
    title: "Dirangkai satu per satu",
    detail: "Setiap strap dibuat dengan tangan, jadi punyamu unik.",
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
