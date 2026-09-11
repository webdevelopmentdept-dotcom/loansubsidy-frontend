import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminClient.js";

const STATUS_OPTIONS = ["new", "contacted", "in_progress", "closed"];

const SOURCE_LABELS = {
  apply_form: { label: "Apply Form", color: "#e07a1f", bg: "#fdecd8" },
  website: { label: "Contact", color: "#3b6ea5", bg: "#e2edf7" },
  eligibility_form: { label: "Eligibility", color: "#5a9c68", bg: "#e4f2e6" },
  whatsapp: { label: "WhatsApp", color: "#2f9d5a", bg: "#e1f5e8" },
};

function SourceBadge({ source }) {
  const info = SOURCE_LABELS[source] || { label: source || "Unknown", color: "#666", bg: "#eee" };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: info.color,
        background: info.bg,
        whiteSpace: "nowrap",
      }}
    >
      {info.label}
    </span>
  );
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  function load() {
    setLoading(true);
    adminApi
      .getLeads()
      .then((res) => setLeads(res.leads))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatus(id, status) {
    try {
      await adminApi.updateLeadStatus(id, status);
      setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
    } catch (err) {
      alert(err.message);
    }
  }

  const filteredLeads = sourceFilter === "all" ? leads : leads.filter((l) => l.source === sourceFilter);

  return (
    <div>
      <div className="admin-toolbar">
        <h3>Leads ({filteredLeads.length}{sourceFilter !== "all" ? ` of ${leads.length}` : ""})</h3>
        <button className="btn btn-outline" onClick={load}>Refresh</button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button
          className={sourceFilter === "all" ? "btn btn-primary" : "btn btn-outline"}
          onClick={() => setSourceFilter("all")}
        >
          All
        </button>
        <button
          className={sourceFilter === "apply_form" ? "btn btn-primary" : "btn btn-outline"}
          onClick={() => setSourceFilter("apply_form")}
        >
          Apply Form
        </button>
        <button
          className={sourceFilter === "website" ? "btn btn-primary" : "btn btn-outline"}
          onClick={() => setSourceFilter("website")}
        >
          Contact
        </button>
        <button
          className={sourceFilter === "eligibility_form" ? "btn btn-primary" : "btn btn-outline"}
          onClick={() => setSourceFilter("eligibility_form")}
        >
          Eligibility
        </button>
      </div>

      {loading && <p className="loading">Loading…</p>}
      {error && <p className="field-error">{error}</p>}
      {!loading && !error && filteredLeads.length === 0 && <p className="muted">No enquiries yet.</p>}

      {!loading && !error && filteredLeads.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Source</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Business / District</th>
              <th>Taluk</th>
              <th>Loan Value</th>
              <th>Message</th>
              <th>Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((l) => (
              <tr key={l._id}>
                <td><SourceBadge source={l.source} /></td>
                <td><strong>{l.name}</strong><div className="muted" style={{ fontSize: 12 }}>{l.email}</div></td>
                <td>{l.phone}</td>
                <td>{l.businessType || "—"}<div className="muted" style={{ fontSize: 12 }}>{l.district}</div></td>
                <td>{l.taluk || "—"}</td>
                <td>{l.loanValue || "—"}</td>
                <td style={{ maxWidth: 240 }}>{l.message || "—"}</td>
                <td className="muted" style={{ fontSize: 12.5 }}>{new Date(l.createdAt).toLocaleString("en-IN")}</td>
                <td>
                  <select value={l.status} onChange={(e) => updateStatus(l._id, e.target.value)}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}