import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl text-ink">404</p>
      <h1 className="mt-3 font-display text-2xl text-ink">
        Untainya terlepas dari halaman ini.
      </h1>
      <p className="mt-2 max-w-sm font-body text-ink/60">
        Halaman yang kamu cari tidak ditemukan. Mungkin sudah pindah, habis
        terjual, atau memang belum pernah ada.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-strap bg-raspberry px-6 py-3 font-body text-sm font-medium text-paper transition-colors hover:bg-raspberry-dark"
      >
        Kembali ke Untai
      </Link>
    </main>
  );
}
