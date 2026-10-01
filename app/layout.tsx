import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Untai — Strap Ponsel untuk Dibawa Setiap Hari",
  description:
    "Strap ponsel dari untaian benang dan manik-manik, dirangkai satu per satu. Bayar dengan QRIS atau DANA.",
  openGraph: {
    title: "Untai — Strap Ponsel untuk Dibawa Setiap Hari",
    description:
      "Strap ponsel dari untaian benang dan manik-manik, dirangkai satu per satu.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body">
        <CartProvider>
          {children}
          <CartDrawer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
