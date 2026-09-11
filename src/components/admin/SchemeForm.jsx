import { useState } from "react";

const emptyScheme = {
  slug: "",
  name: "",
  fullName: "",
  level: "Tamil Nadu State",
  type: "",
  status: "active",
  target: "",
  sectors: "",
  maxProject: "",
  subsidy: "",
  interestSupport: "",
  summary: "",
  eligibilityPoints: "",
  documents: "",
  guidelines: "",
  source: "",
  filters: {
    businessTypes: "",
    communities: "",
    genderFocus: "Any",
    state: "Any",
    minAge: 18,
    maxAge: 100,
    maxProjectCost: "",
    minProjectCost: "",
    maxFamilyIncome: "",
    newBusinessOnly: false,
  },
};

// Convert a DB scheme document (arrays) into form state (strings the inputs can edit)
function toFormState(scheme) {
  if (!scheme) return emptyScheme;
  return {
    ...emptyScheme,
    ...scheme,
    sectors: (scheme.sectors || []).join(", "),
    eligibilityPoints: (scheme.eligibilityPoints || []).join("\n"),
    documents: (scheme.documents || []).join("\n"),
    filters: {
      ...emptyScheme.filters,
      ...(scheme.filters || {}),
      businessTypes: (scheme.filters?.businessTypes || []).join(", "),
      communities: (scheme.filters?.communities || []).join(", "),
      maxProjectCost: scheme.filters?.maxProjectCost ?? "",
      minProjectCost: scheme.filters?.minProjectCost ?? "",
      maxFamilyIncome: scheme.filters?.maxFamilyIncome ?? "",
    },
  };
}

// Convert form state (strings) back into the shape the API expects (arrays/numbers)
function toApiPayload(form) {
  const splitList = (s) =>
    s.split(",").map((x) => x.trim()).filter(Boolean);
  const splitLines = (s) =>
    s.split("\n").map((x) => x.trim()).filter(Boolean);

  return {
    slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
    name: form.name.trim(),
    fullName: form.fullName.trim(),
    level: form.level,
    type: form.type.trim(),
    status: form.status,
    target: form.target.trim(),
    sectors: splitList(form.sectors),
    maxProject: form.maxProject.trim(),
    subsidy: form.subsidy.trim(),
    interestSupport: form.interestSupport.trim(),
    summary: form.summary.trim(),
    eligibilityPoints: splitLines(form.eligibilityPoints),
    documents: splitLines(form.documents),
    guidelines: form.guidelines.trim(),
    source: form.source.trim(),
    filters: {
      businessTypes: splitList(form.filters.businessTypes),
      communities: splitList(form.filters.communities),
      genderFocus: form.filters.genderFocus,
      state: form.filters.state,
      minAge: Number(form.filters.minAge) || 18,
      maxAge: Number(form.filters.maxAge) || 100,
      maxProjectCost: form.filters.maxProjectCost === "" ? null : Number(form.filters.maxProjectCost),
      minProjectCost: Number(form.filters.minProjectCost) || 0,
      maxFamilyIncome: form.filters.maxFamilyIncome === "" ? null : Number(form.filters.maxFamilyIncome),
      newBusinessOnly: !!form.filters.newBusinessOnly,
    },
  };
}

export default function SchemeForm({ initialScheme, isEditing, onSubmit, onCancel, saving, error }) {
  const [form, setForm] = useState(() => toFormState(initialScheme));

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }
  function updateFilter(key, value) {
    setForm((f) => ({ ...f, filters: { ...f.filters, [key]: value } }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(toApiPayload(form));
  }

  return (
    <form className="form admin-scheme-form" onSubmit={handleSubmit}>
      <div className="form-row two">
        <div className="field">
          <label>Slug (URL id, unique)</label>
          <input value={form.slug} onChange={(e) => update("slug", e.target.value)} disabled={isEditing} required />
        </div>
        <div className="field">
          <label>Status</label>
          <select value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="active">Active</option>
            <option value="verify_status">Verify status</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      <div className="form-row two">
        <div className="field">
          <label>Short name</label>
          <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </div>
        <div className="field">
          <label>Level</label>
          <select value={form.level} onChange={(e) => update("level", e.target.value)}>
            <option>Central</option>
            <option>Tamil Nadu State</option>
          </select>
        </div>
      </div>

      <div className="field">
        <label>Full name</label>
        <input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
      </div>

      <div className="form-row two">
        <div className="field">
          <label>Type</label>
          <input value={form.type} onChange={(e) => update("type", e.target.value)} placeholder="e.g. Credit-linked subsidy" />
        </div>
        <div className="field">
          <label>Target audience</label>
          <input value={form.target} onChange={(e) => update("target", e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Sectors (comma separated)</label>
        <input value={form.sectors} onChange={(e) => update("sectors", e.target.value)} placeholder="Manufacturing, Services" />
      </div>

      <div className="form-row two">
        <div className="field">
          <label>Max project / loan size</label>
          <input value={form.maxProject} onChange={(e) => update("maxProject", e.target.value)} />
        </div>
        <div className="field">
          <label>Subsidy / benefit</label>
          <input value={form.subsidy} onChange={(e) => update("subsidy", e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label>Interest support (optional)</label>
        <input value={form.interestSupport} onChange={(e) => update("interestSupport", e.target.value)} />
      </div>

      <div className="field">
        <label>Summary</label>
        <textarea rows="3" value={form.summary} onChange={(e) => update("summary", e.target.value)} required />
      </div>

      <div className="field">
        <label>Eligibility points (one per line)</label>
        <textarea rows="4" value={form.eligibilityPoints} onChange={(e) => update("eligibilityPoints", e.target.value)} />
      </div>

      <div className="field">
        <label>Documents required (one per line)</label>
        <textarea rows="4" value={form.documents} onChange={(e) => update("documents", e.target.value)} />
      </div>

      <div className="field">
        <label>Guidelines / important notes</label>
        <textarea rows="3" value={form.guidelines} onChange={(e) => update("guidelines", e.target.value)} />
      </div>

      <div className="field">
        <label>Official source URL</label>
        <input value={form.source} onChange={(e) => update("source", e.target.value)} placeholder="https://..." />
      </div>

      <fieldset className="admin-fieldset">
        <legend>Eligibility-matcher filters (used by the Eligibility Checker)</legend>

        <div className="form-row two">
          <div className="field">
            <label>Business types (comma separated, must match sector names)</label>
            <input value={form.filters.businessTypes} onChange={(e) => updateFilter("businessTypes", e.target.value)} />
          </div>
          <div className="field">
            <label>Communities (comma separated, or "Any")</label>
            <input value={form.filters.communities} onChange={(e) => updateFilter("communities", e.target.value)} placeholder="SC, ST or Any" />
          </div>
        </div>

        <div className="form-row two">
          <div className="field">
            <label>Gender focus</label>
            <select value={form.filters.genderFocus} onChange={(e) => updateFilter("genderFocus", e.target.value)}>
              <option>Any</option>
              <option>Female</option>
            </select>
          </div>
          <div className="field">
            <label>State restriction</label>
            <select value={form.filters.state} onChange={(e) => updateFilter("state", e.target.value)}>
              <option>Any</option>
              <option>Tamil Nadu</option>
            </select>
          </div>
        </div>

        <div className="form-row two">
          <div className="field">
            <label>Min age</label>
            <input type="number" value={form.filters.minAge} onChange={(e) => updateFilter("minAge", e.target.value)} />
          </div>
          <div className="field">
            <label>Max age</label>
            <input type="number" value={form.filters.maxAge} onChange={(e) => updateFilter("maxAge", e.target.value)} />
          </div>
        </div>

        <div className="form-row two">
          <div className="field">
            <label>Min project cost (₹, optional)</label>
            <input type="number" value={form.filters.minProjectCost} onChange={(e) => updateFilter("minProjectCost", e.target.value)} />
          </div>
          <div className="field">
            <label>Max project cost (₹, optional — blank = no ceiling)</label>
            <input type="number" value={form.filters.maxProjectCost} onChange={(e) => updateFilter("maxProjectCost", e.target.value)} />
          </div>
        </div>

        <div className="field">
          <label>Max family income ceiling (₹, optional — blank = no ceiling)</label>
          <input type="number" value={form.filters.maxFamilyIncome} onChange={(e) => updateFilter("maxFamilyIncome", e.target.value)} />
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            checked={form.filters.newBusinessOnly}
            onChange={(e) => updateFilter("newBusinessOnly", e.target.checked)}
          />
          New businesses only
        </label>
      </fieldset>

      {error && <div className="form-status err">{error}</div>}

      <div className="admin-form-actions">
        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Saving…" : isEditing ? "Save changes" : "Create scheme"}
        </button>
        <button className="btn btn-outline" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}