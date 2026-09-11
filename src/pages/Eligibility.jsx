import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

const initialForm = {
  businessType: "",
  projectCost: "",
  community: "",
  gender: "",
  age: "",
  businessStatus: "New business",
  state: "Tamil Nadu",
  annualIncome: "",
  contactPhone: "",
};

export default function Eligibility() {
  const [sectors, setSectors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getSectors().then(setSectors).catch(() => {});
  }, []);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!form.businessType || !form.projectCost || !form.community || !form.age) {
      setError("Please fill business type, project cost, community and age.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        projectCost: Number(form.projectCost),
        age: Number(form.age),
        annualIncome: form.annualIncome ? Number(form.annualIncome) : null,
      };
      const res = await api.checkEligibility(payload);
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <span className="eyebrow">Free preliminary check</span>
          <h1>Check your potential eligibility</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            Answer a few questions and we'll match your profile against every scheme in our
            database. This is not a government approval or a loan sanction.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid cols-2">
          <form className="form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="businessType">Business type</label>
              <select id="businessType" value={form.businessType} onChange={(e) => update("businessType", e.target.value)}>
                <option value="">Select business type</option>
                {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="form-row two">
              <div className="field">
                <label htmlFor="projectCost">Project cost (₹)</label>
                <input id="projectCost" type="number" min="0" placeholder="e.g. 500000"
                  value={form.projectCost} onChange={(e) => update("projectCost", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="age">Your age</label>
                <input id="age" type="number" min="18" max="100"
                  value={form.age} onChange={(e) => update("age", e.target.value)} />
              </div>
            </div>

            <div className="form-row two">
              <div className="field">
                <label htmlFor="community">Community / category</label>
                <select id="community" value={form.community} onChange={(e) => update("community", e.target.value)}>
                  <option value="">Select category</option>
                  <option>General</option><option>BC</option><option>MBC</option>
                  <option>DNC</option><option>SC</option><option>ST</option>
                  <option>Minority</option><option>Other</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="gender">Gender</label>
                <select id="gender" value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-row two">
              <div className="field">
                <label htmlFor="businessStatus">Business status</label>
                <select id="businessStatus" value={form.businessStatus} onChange={(e) => update("businessStatus", e.target.value)}>
                  <option>New business</option>
                  <option>Existing business</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="state">State</label>
                <select id="state" value={form.state} onChange={(e) => update("state", e.target.value)}>
                  <option>Tamil Nadu</option>
                  <option>Other state</option>
                </select>
              </div>
            </div>

            <div className="form-row two">
              <div className="field">
                <label htmlFor="annualIncome">Approx. annual family income (₹, optional)</label>
                <input id="annualIncome" type="number" min="0"
                  value={form.annualIncome} onChange={(e) => update("annualIncome", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="contactPhone">Mobile number (optional, for a callback)</label>
                <input id="contactPhone" type="tel" placeholder="+91"
                  value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
              </div>
            </div>

            {error && <div className="form-status err">{error}</div>}

            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Checking…" : "Find potential schemes →"}
            </button>
          </form>

          <div>
            {!result && (
              <div className="tile">
                <h3>What happens next</h3>
                <p className="muted">
                  We check your answers against every scheme's eligibility rules stored in our
                  database — business type, community, age, project cost and more — and return
                  schemes you may want to look into further.
                </p>
              </div>
            )}

            {result && (
              <div>
                <h3>{result.matchCount} potential {result.matchCount === 1 ? "match" : "matches"}</h3>
                {result.matches.length === 0 && (
                  <div className="no-match">
                    No schemes matched this exact profile. Try adjusting project cost or business
                    type, or <Link to="/about">contact our team</Link> for manual guidance.
                  </div>
                )}
                {result.matches.map((m) => (
                  <div className="match" key={m.slug}>
                    <h4>{m.name} — {m.fullName}</h4>
                    <p style={{ margin: "4px 0", fontSize: 14 }}>{m.subsidy}</p>
                    <ul>
                      {m.reasons.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                    <Link to={`/schemes/${m.slug}`} className="entry-link">View scheme →</Link>
                  </div>
                ))}
                <p className="fee-note" style={{ marginTop: 10 }}>{result.disclaimer}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
