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
<<<<<<< HEAD
  //return hash.slice(0, 8) + "…" + hash.slice(-8);
  if (!hash) return "—";
=======
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
  return hash.slice(0, 8) + "…" + hash.slice(-8);
}
