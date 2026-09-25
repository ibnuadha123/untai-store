const faqs = [
  {
    question: "How do I pay?",
    answer:
      "At checkout you'll get a QRIS code or our DANA number along with the exact total and your order number. Pay from any e-wallet or mobile banking app that supports QRIS, then upload a screenshot of the payment as proof.",
  },
  {
    question: "Why isn't my order marked as paid right away?",
    answer:
      "We check every payment against our merchant account by hand before marking an order PAID. This usually takes a few hours during the day. Uploading proof doesn't confirm payment on its own — it just gives us something to check against.",
  },
  {
    question: "Will a strap fit my phone case?",
    answer:
      "Yes, as long as your case has a strap hole or lug — most silicone and clear cases sold in the last few years do. If your case doesn't have one, we sell a small adhesive lug separately.",
  },
  {
    question: "How long does a strap last?",
    answer:
      "With daily use, expect 6–12 months from a beaded or woven strap and longer from leather, which just ages instead of wearing out. Cords can be restrung — message us on WhatsApp and we'll quote a repair.",
  },
  {
    question: "Do you restock sold-out colorways?",
    answer:
      "Rarely in the exact same colors, since beads are sourced in small, inconsistent lots. We post new runs on our Instagram before they go up on the site.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-4xl text-ink">Questions</h2>

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
