import { useState } from "react";
import { api } from "../api/client.js";

const initialForm = { name: "", phone: "", email: "", businessType: "", district: "", message: "" };

export default function About() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null); // { ok: bool, message: string }
  const [submitting, setSubmitting] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);
    setSubmitting(true);
    try {
      const res = await api.submitLead({ ...form, source: "website" });
      setStatus({ ok: true, message: res.message });
      setForm(initialForm);
    } catch (err) {
      setStatus({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <span className="eyebrow">About BUSINESSLOANSUBSIDY.in</span>
          <h1>Transparent business finance assistance</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            A private platform helping entrepreneurs understand government schemes, compare
            potential options, and prepare for the application process.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container grid cols-3">
          <div className="tile">
            <h3>Scheme discovery</h3>
            <p className="muted">We organise public scheme information by business type, applicant profile and benefit.</p>
          </div>
          <div className="tile">
            <h3>Application guidance</h3>
            <p className="muted">Document checklists, project-report guidance, and process navigation.</p>
          </div>
          <div className="tile">
            <h3>Transparent process</h3>
            <p className="muted">No upfront payment for basic assistance. Any fee is disclosed before it becomes payable.</p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>Contact us</h2>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row two">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" required value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="phone">Mobile number</label>
                <input id="phone" required value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
            </div>
            <div className="form-row two">
              <div className="field">
                <label htmlFor="email">Email (optional)</label>
                <input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="businessType">Business type</label>
                <input id="businessType" value={form.businessType} onChange={(e) => update("businessType", e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label htmlFor="district">District</label>
              <input id="district" value={form.district} onChange={(e) => update("district", e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="message">Tell us about your business/project</label>
              <textarea id="message" rows="5" value={form.message} onChange={(e) => update("message", e.target.value)} />
            </div>
            {status && <div className={`form-status ${status.ok ? "ok" : "err"}`}>{status.message}</div>}
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Sending…" : "Submit enquiry"}
            </button>
          </form>
        </div>
      </section>

      <section id="terms" className="section">
        <div className="container">
          <h2>Terms &amp; fee disclosure</h2>
          <div className="disclaimer-box">
            <p>
              BUSINESSLOANSUBSIDY.in is a private assistance platform and is not a Government of
              India or Government of Tamil Nadu website. Scheme information can change. We do not
              guarantee loan sanction or subsidy approval.
            </p>
            <p>
              <strong>No upfront payment:</strong> basic assistance does not require an upfront
              payment. If a service/success fee applies, the exact amount, calculation basis and
              payment trigger will be disclosed in writing before the customer becomes obligated.
            </p>
          </div>
        </div>
      </section>

      <section id="privacy" className="section alt">
        <div className="container">
          <h2>Privacy</h2>
          <p className="muted" style={{ maxWidth: 680 }}>
            We collect only the information needed for the assistance you request, with your
            consent, and take reasonable steps to protect applicant data. A full privacy policy
            will be published before sensitive documents (Aadhaar, PAN, income/community
            certificates, etc.) are collected during onboarding.
          </p>
        </div>
      </section>
    </>
  );
}
