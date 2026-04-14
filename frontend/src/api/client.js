const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  health:      ()           => request("/health"),
  analyze:     (data)       => request("/analyze", { method: "POST", body: JSON.stringify({ data }) }),
  getChain:    ()           => request("/audit-chain"),
  getBlock:    (id)         => request(`/audit-chain/${id}`),
  verifyChain: ()           => request("/audit-chain/verify"),
};
