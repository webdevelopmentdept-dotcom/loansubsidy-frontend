import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminClient.js";
import SchemeForm from "../../components/admin/SchemeForm.jsx";

export default function AdminSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("list"); // list | create | edit
  const [editingScheme, setEditingScheme] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  function load() {
    setLoading(true);
    adminApi
      .getSchemes()
      .then((res) => setSchemes(res.schemes))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(payload) {
    setSaving(true);
    setFormError("");
    try {
      await adminApi.createScheme(payload);
      setMode("list");
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(payload) {
    setSaving(true);
    setFormError("");
    try {
      await adminApi.updateScheme(editingScheme.slug, payload);
      setMode("list");
      setEditingScheme(null);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(scheme) {
    try {
      if (scheme.isActive) {
        if (!window.confirm(`Hide "${scheme.name}" from the public site?`)) return;
        await adminApi.deactivateScheme(scheme.slug);
      } else {
        await adminApi.activateScheme(scheme.slug);
      }
      load();
    } catch (err) {
      alert(err.message);
    }
  }

  if (mode === "create") {
    return (
      <div>
        <h3>Add new scheme</h3>
        <SchemeForm
          onSubmit={handleCreate}
          onCancel={() => { setMode("list"); setFormError(""); }}
          saving={saving}
          error={formError}
        />
      </div>
    );
  }

  if (mode === "edit" && editingScheme) {
    return (
      <div>
        <h3>Edit: {editingScheme.name}</h3>
        <SchemeForm
          initialScheme={editingScheme}
          isEditing
          onSubmit={handleUpdate}
          onCancel={() => { setMode("list"); setEditingScheme(null); setFormError(""); }}
          saving={saving}
          error={formError}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h3>Schemes ({schemes.length})</h3>
        <button className="btn btn-primary" onClick={() => setMode("create")}>+ Add new scheme</button>
      </div>

      {loading && <p className="loading">Loading…</p>}
      {error && <p className="field-error">{error}</p>}

      {!loading && !error && (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Level</th>
              <th>Status</th>
              <th>Visible</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {schemes.map((s) => (
              <tr key={s.slug}>
                <td>
                  <strong>{s.name}</strong>
                  <div className="muted" style={{ fontSize: 12.5 }}>{s.slug}</div>
                </td>
                <td>{s.level}</td>
                <td><span className={`status-tag status-${s.status}`}>{s.status}</span></td>
                <td>{s.isActive ? "Yes" : "Hidden"}</td>
                <td className="admin-row-actions">
                  <button className="btn btn-outline" onClick={() => { setEditingScheme(s); setMode("edit"); }}>Edit</button>
                  <button className="btn btn-outline" onClick={() => toggleActive(s)}>
                    {s.isActive ? "Hide" : "Show"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}