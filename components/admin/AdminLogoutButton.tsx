"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-strap border border-ink/15 px-4 py-2 font-body text-sm text-ink transition-colors hover:border-raspberry hover:text-raspberry"
    >
      Keluar
    </button>
  );
}
