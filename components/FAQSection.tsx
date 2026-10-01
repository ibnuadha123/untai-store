import { contactInfo } from "@/lib/contact";

const faqs = [
  {
    question: "Bagaimana cara membayar?",
    answer:
      "Saat checkout, kamu akan mendapat kode QRIS atau nomor DANA beserta total yang harus dibayar dan nomor pesananmu. Bayar lewat e-wallet atau aplikasi mobile banking yang mendukung QRIS, lalu unggah tangkapan layar pembayaran sebagai bukti.",
  },
  {
    question: "Kenapa pesananku belum langsung berstatus lunas?",
    answer:
      "Setiap pembayaran kami cek manual dengan akun merchant sebelum pesanan ditandai lunas. Biasanya butuh beberapa jam pada jam kerja. Mengunggah bukti pembayaran belum otomatis mengonfirmasi pembayaran, tapi membantu kami mencocokkannya.",
  },
  {
    question: "Apakah strap bisa dipasang di casing ponselku?",
    answer:
      "Bisa, selama casingmu punya lubang atau pengait tali. Kalau tidak yakin, hubungi kami lewat WhatsApp sebelum memesan.",
  },
  {
    question: "Apakah warna yang sudah habis akan dibuat lagi?",
    answer: (
      <>
        Jarang persis sama, karena manik-manik kami kumpulkan dalam jumlah
        kecil dan tidak selalu seragam. Koleksi baru akan kami umumkan di{" "}
        <a
          href={contactInfo.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-raspberry underline underline-offset-2 hover:text-raspberry-dark"
        >
          Instagram
        </a>{" "}
        sebelum tampil di situs ini.
      </>
    ),
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-4xl text-ink">Pertanyaan umum</h2>

        <div className="mt-10 divide-y divide-ink/10 border-t border-ink/10">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-base text-ink marker:content-none">
                {faq.question}
                <span
                  className="shrink-0 text-xl text-ink/40 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 font-body leading-relaxed text-ink/65">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
