"use client";

import Image from "next/image";
import { motion } from "motion/react";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-6 pb-20 pt-14 md:pt-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-body text-sm text-forest">
            Strap ponsel dari untaian benang dan manik-manik
          </p>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] text-ink md:text-6xl">
            Seuntai keindahan untuk gawai yang selalu kamu bawa.
          </h1>
          <p className="mt-6 max-w-prose font-body text-lg leading-relaxed text-ink/70">
            Untai merangkai strap ponsel dari benang dan manik-manik dengan
            beragam karakter. Setiap strap dirangkai satu per satu, jadi tidak
            ada dua yang benar-benar sama.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#shop"
              className="rounded-strap bg-raspberry px-7 py-3 font-body text-base font-medium text-paper transition-colors hover:bg-raspberry-dark"
            >
              Lihat koleksi
            </a>
            <a
              href="#about"
              className="font-body text-base text-ink/70 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-ink"
            >
              Tentang Untai
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-sm md:max-w-md"
        >
          <div className="relative aspect-[13/16] w-full">
            <Image
              src="/images/hero-strap.svg"
              alt="Ponsel dengan strap Untai dari untaian manik-manik yang menjuntai"
              fill
              priority
              className="object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
