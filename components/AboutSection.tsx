export default function AboutSection() {
  return (
    <section id="about" className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div>
          <p className="font-body text-sm text-forest">Sejak 2026</p>
          <h2 className="mt-2 font-display text-4xl text-ink">
            Tentang Untai
          </h2>
        </div>

        <div>
          <p className="font-body text-lg leading-relaxed text-ink/70">
            Untai merupakan usaha pembuatan strap ponsel yang dirangkai dari
            untaian benang dan manik-manik dengan beragam karakter.
          </p>
          <p className="mt-4 font-body leading-relaxed text-ink/70">
            Beri kesan indah dan unik pada gawaimu lewat untaian benang dengan
            tumpukan manik-manik pilihan. Untai mulai dibuat pada 2026, dan
            setiap strap dirangkai satu per satu.
          </p>
        </div>
      </div>
    </section>
  );
}
