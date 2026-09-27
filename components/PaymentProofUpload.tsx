"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface PaymentProofUploadProps {
  orderNumber: string;
  alreadyUploaded: boolean;
}

export default function PaymentProofUpload({
  orderNumber,
  alreadyUploaded,
}: PaymentProofUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phone, setPhone] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(alreadyUploaded);

  async function handleUpload() {
    if (!selectedFile) return;
    if (!phone.trim()) {
      setError("Enter the phone number you used at checkout");
      return;
    }
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("phone", phone.trim());

      const res = await fetch(`/api/orders/${orderNumber}/proof`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Upload failed, please try again");
        setIsUploading(false);
        return;
      }

      setDone(true);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setIsUploading(false);
    }
  }

  if (done) {
    return (
      <div className="mt-6 rounded-lg bg-forest/10 px-4 py-3 font-body text-sm text-forest">
        Payment proof uploaded. We&apos;ll check it against what we&apos;ve
        received and update your order soon.
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-ink/10 pt-6">
      <p className="font-body text-sm text-ink/70">
        Already paid? Upload a screenshot as proof.
      </p>

      <input
        type="tel"
        placeholder="Phone number used at checkout"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="mt-3 w-full rounded-lg border border-ink/15 bg-paper px-3 py-2 font-body text-sm text-ink outline-none focus:border-raspberry"
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="font-body text-sm text-ink/70 file:mr-3 file:rounded-full file:border file:border-ink/15 file:bg-paper file:px-4 file:py-2 file:font-body file:text-sm file:text-ink hover:file:border-raspberry"
        />
        <button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="shrink-0 rounded-strap bg-ink px-5 py-2.5 font-body text-sm font-medium text-paper transition-colors hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>
      </div>

      {error && (
        <p className="mt-2 font-body text-sm text-raspberry">{error}</p>
      )}

      <p className="mt-2 font-body text-xs text-ink/45">
        JPG, PNG, or WEBP, up to 5 MB.
      </p>
    </div>
  );
}
