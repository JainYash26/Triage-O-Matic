export async function sha256(message) {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(message)
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function shortHash(hash = "") {
  //return hash.slice(0, 8) + "…" + hash.slice(-8);
  if (!hash) return "—";
  return hash.slice(0, 8) + "…" + hash.slice(-8);
}
