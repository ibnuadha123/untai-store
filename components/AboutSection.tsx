const materials = [
  {
    name: "Nylon cord",
    detail: "Rated for a 3kg pull before we'll even consider it for a strap.",
    color: "bg-raspberry",
  },
  {
    name: "Glass and acrylic beads",
    detail: "Sourced from small bead wholesalers around Java, sorted by hand.",
    color: "bg-gold",
  },
  {
    name: "Vegetable-tanned leather",
    detail: "Ages and darkens with wear instead of cracking.",
    color: "bg-forest",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div>
          <h2 className="font-display text-4xl text-ink">
            Made by one small studio, not a factory line.
          </h2>
          <p className="mt-5 font-body leading-relaxed text-ink/70">
            Untai started in 2023 as a way to stop losing phones off the back
            of motorbikes. Every strap is still strung, woven, or cut by hand
            in small batches — usually a dozen or two at a time — which is
            why colors sell out and don&apos;t always come back.
          </p>
          <p className="mt-4 font-body leading-relaxed text-ink/70">
            We test every strap by hanging a full water bottle from it for a
            week before it goes up for sale. If it survives that, it&apos;ll
            survive your phone.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {materials.map((m) => (
            <div
              key={m.name}
              className="flex gap-4 rounded-strap border border-ink/10 p-5"
            >
              <span
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ${m.color}`}
                aria-hidden="true"
              />
              <div>
                <p className="font-display text-lg text-ink">{m.name}</p>
                <p className="mt-1 font-body text-sm text-ink/60">{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
