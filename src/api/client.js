const BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    const message = body?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return body;
}

export const api = {
  getSchemes: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/schemes${qs ? `?${qs}` : ""}`);
  },
  getScheme: (slug) => request(`/schemes/${slug}`),
  getSectors: () => request(`/schemes/meta/sectors`),
  checkEligibility: (payload) =>
    request(`/eligibility`, { method: "POST", body: JSON.stringify(payload) }),
  submitLead: (payload) =>
    request(`/leads`, { method: "POST", body: JSON.stringify(payload) }),
};
