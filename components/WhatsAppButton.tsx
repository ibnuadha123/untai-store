"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppUrl } from "@/lib/contact";

// A generic chat-bubble icon, not the official WhatsApp logo (that's a
// registered trademark) — this just signals "chat with us" in our own
// brand color.
export default function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Untai lewat WhatsApp"
      className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-raspberry text-paper shadow-lg transition-transform hover:scale-105 hover:bg-raspberry-dark"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3a9 9 0 0 0-7.5 13.9L3 21l4.3-1.4A9 9 0 1 0 12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 9.5c0 3 2 5 5 5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="8.6" cy="9.4" r="0.9" fill="currentColor" />
        <circle cx="13.5" cy="14.3" r="0.9" fill="currentColor" />
      </svg>
    </a>
  );
}
