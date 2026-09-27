import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl text-ink">404</p>
      <h1 className="mt-3 font-display text-2xl text-ink">
        This page came loose.
      </h1>
      <p className="mt-2 max-w-sm font-body text-ink/60">
        We couldn&apos;t find what you were looking for — it may have moved,
        sold out, or never existed.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-strap bg-raspberry px-6 py-3 font-body text-sm font-medium text-paper transition-colors hover:bg-raspberry-dark"
      >
        Back to Untai
      </Link>
    </main>
  );
}
