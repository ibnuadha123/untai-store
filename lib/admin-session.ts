// Signs a simple "expires-at" session token with HMAC-SHA256, using the
// Web Crypto API (crypto.subtle) rather than Node's `crypto` module, so
// this same code works in both the Edge middleware runtime and ordinary
// Node API routes without any runtime-specific branching.

const encoder = new TextEncoder();
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

async function getKey(secret: string) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

export async function createSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");

  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const payload = String(expiresAt);
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));

  return `${payload}.${toHex(signature)}`;
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const [payload, signatureHex] = token.split(".");
  if (!payload || !signatureHex) return false;

  const expiresAt = Number(payload);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return false;

  try {
    const key = await getKey(secret);
    const signatureBytes = fromHex(signatureHex);
    // subtle.verify does a constant-time comparison internally, avoiding
    // any timing side-channel from a naive string/byte comparison.
    return await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as BufferSource,
      encoder.encode(payload)
    );
  } catch {
    return false;
  }
}
