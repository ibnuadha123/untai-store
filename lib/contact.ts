// Satu tempat untuk info kontak toko. Ubah di sini kalau nomor, email,
// atau akun sosial berubah — semua komponen yang menampilkan info ini
// mengambil dari sini.

export const contactInfo = {
  whatsapp: {
    // Format internasional untuk link wa.me: kode negara tanpa "+" atau "0" di depan.
    international: "6282160231800",
    // Format lokal untuk ditampilkan ke pengguna.
    display: "0821-6023-1800",
    defaultMessage: "Halo Untai, saya mau tanya soal produk.",
  },
  email: "untaistore26@gmail.com",
  instagram: {
    url: "https://www.instagram.com/untai.store",
    handle: "@untai.store",
  },
};

export function buildWhatsAppUrl(message?: string): string {
  const text = message ?? contactInfo.whatsapp.defaultMessage;
  return `https://wa.me/${contactInfo.whatsapp.international}?text=${encodeURIComponent(text)}`;
}
