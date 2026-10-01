// Nilai di database tetap bahasa Inggris (PENDING, PAID, dst.) supaya
// constraint dan logika server tidak berubah. File ini hanya mengatur teks
// yang ditampilkan ke pengguna.

export const paymentStatusLabel: Record<string, string> = {
  PENDING: "Menunggu pembayaran",
  PAID: "Lunas",
  FAILED: "Gagal",
};

export const orderStatusLabel: Record<string, string> = {
  NEW: "Baru",
  PROCESSING: "Diproses",
  SHIPPED: "Dikirim",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const categoryLabel: Record<string, string> = {
  Beaded: "Manik",
  Woven: "Anyaman",
  Leather: "Kulit",
  Charm: "Charm",
};

export function label(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}
