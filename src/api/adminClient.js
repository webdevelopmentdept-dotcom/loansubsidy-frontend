import { adminAuth } from "../utils/adminAuth.js";

const BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const token = adminAuth.getToken();
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (res.status === 401) {
    adminAuth.clearToken();
    window.location.href = "/admin/login";
    throw new Error("Session expired. Please log in again.");
  }

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body;
}

export const adminApi = {
  login: (username, password) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(async (res) => {
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error || "Login failed");
      return body;
    }),

  getSummary: () => request("/admin/summary"),

  getSchemes: () => request("/admin/schemes"),
  getScheme: (slug) => request(`/admin/schemes/${slug}`),
  createScheme: (payload) =>
    request("/admin/schemes", { method: "POST", body: JSON.stringify(payload) }),
  updateScheme: (slug, payload) =>
    request(`/admin/schemes/${slug}`, { method: "PUT", body: JSON.stringify(payload) }),
  deactivateScheme: (slug) => request(`/admin/schemes/${slug}`, { method: "DELETE" }),
  activateScheme: (slug) => request(`/admin/schemes/${slug}/activate`, { method: "PATCH" }),

  getLeads: () => request("/admin/leads"),
  updateLeadStatus: (id, status) =>
    request(`/admin/leads/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};