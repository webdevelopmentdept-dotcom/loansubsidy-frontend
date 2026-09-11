import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminClient.js";

const STATUS_OPTIONS = ["new", "contacted", "in_progress", "closed"];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <div>
      <div className="admin-toolbar">
        <h3>Leads ({leads.length})</h3>
        <button className="btn btn-outline" onClick={load}>Refresh</button>
      </div>

      {loading && <p className="loading">Loading…</p>}
      {error && <p className="field-error">{error}</p>}
      {!loading && !error && leads.length === 0 && <p className="muted">No enquiries yet.</p>}

      {!loading && !error && leads.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Business / District</th>
              <th>Message</th>
              <th>Received</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id}>
                <td><strong>{l.name}</strong><div className="muted" style={{ fontSize: 12 }}>{l.email}</div></td>
                <td>{l.phone}</td>
                <td>{l.businessType || "—"}<div className="muted" style={{ fontSize: 12 }}>{l.district}</div></td>
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