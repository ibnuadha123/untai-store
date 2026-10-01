export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-14 text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl">Untai</p>
          <p className="mt-3 font-body text-sm text-paper/60">
            Strap ponsel dari untaian benang dan manik-manik, dirangkai satu
            per satu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          <div>
            <p className="font-body text-sm text-paper/50">Belanja</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-paper/80">
              <li><a href="#shop" className="hover:text-paper">Koleksi terbaru</a></li>
              <li><a href="#collection" className="hover:text-paper">Semua koleksi</a></li>
              <li><a href="/track" className="hover:text-paper">Lacak pesanan</a></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-sm text-paper/50">Untai</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-paper/80">
              <li><a href="#about" className="hover:text-paper">Tentang</a></li>
              <li><a href="#faq" className="hover:text-paper">Pertanyaan umum</a></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-sm text-paper/50">Kontak</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-paper/80">
              <li>
                <a href="https://wa.me/6282160231800" className="hover:text-paper">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:untaistore26@gmail.com" className="hover:text-paper">
                  Email
                </a>
              </li>
              <li>
                <a href="https://instagram.com/untai.store" className="hover:text-paper">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl font-body text-xs text-paper/40">
        © {new Date().getFullYear()} Untai. Dibuat di Indonesia.
      </p>
    </footer>
  );
}
