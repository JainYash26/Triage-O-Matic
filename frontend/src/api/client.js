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
<<<<<<< HEAD
  health: () => request("/health"),

  analyze: (data) => {
    console.log("Sending logs:", data);

    return request("/analyze", {
      method: "POST",
      body: JSON.stringify({
        data: data
      }),
    });
  },

  getChain: () => request("/audit-chain"),
  getBlock: (id) => request(`/audit-chain/${id}`),
  verifyChain: () => request("/audit-chain/verify"),
=======
  health:      ()           => request("/health"),
  analyze:     (data)       => request("/analyze", { method: "POST", body: JSON.stringify({ data }) }),
  getChain:    ()           => request("/audit-chain"),
  getBlock:    (id)         => request(`/audit-chain/${id}`),
  verifyChain: ()           => request("/audit-chain/verify"),
>>>>>>> 33aeb1f989947c36c4405a9299e8bf0e6738a7f3
};
