export default function Loading() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="h-8 w-32 animate-pulse rounded-lg bg-cloud" />
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-strap bg-cloud" />
        ))}
      </div>
    </main>
  );
}
