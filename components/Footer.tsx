export default function Footer() {
  return (
    <footer className="bg-ink px-6 py-14 text-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl">Untai</p>
          <p className="mt-3 font-body text-sm text-paper/60">
            Hand-strung and woven phone straps, made in small batches.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
          <div>
            <p className="font-body text-sm text-paper/50">Shop</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-paper/80">
              <li><a href="#shop" className="hover:text-paper">Current run</a></li>
              <li><a href="#collection" className="hover:text-paper">Full collection</a></li>
              <li><a href="/track" className="hover:text-paper">Track your order</a></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-sm text-paper/50">Studio</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-paper/80">
              <li><a href="#about" className="hover:text-paper">About</a></li>
              <li><a href="#faq" className="hover:text-paper">FAQ</a></li>
            </ul>
          </div>
          <div>
            <p className="font-body text-sm text-paper/50">Contact</p>
            <ul className="mt-3 space-y-2 font-body text-sm text-paper/80">
              <li>
                <a href="https://wa.me/6280000000000" className="hover:text-paper">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href="mailto:hello@untai.id" className="hover:text-paper">
                  hello@untai.id
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-6xl font-body text-xs text-paper/40">
        © {new Date().getFullYear()} Untai. Made in Indonesia.
      </p>
    </footer>
  );
}
