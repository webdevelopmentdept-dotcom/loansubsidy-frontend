import { useEffect, useState } from "react";
import { api } from "../api/client.js";
import { TN_DISTRICTS, getTaluksForDistrict } from "../data/tamilNaduData.js";

const LOAN_VALUE_RANGES = [
  "₹50,000 - ₹1 Lakh",
  "₹1 Lakh - ₹3 Lakh",
  "₹3 Lakh - ₹5 Lakh",
  "₹5 Lakh - ₹10 Lakh",
  "₹10 Lakh - ₹25 Lakh",
  "₹25 Lakh - ₹50 Lakh",
  "₹50 Lakh - ₹1 Crore",
  "Above ₹1 Crore",
];

const initialForm = {
  name: "",
  phone: "",
  district: "",
  taluk: "",
  talukOther: "",
  loanValue: "",
  businessType: "",
  businessTypeOther: "",
};

export default function Apply() {
  const [sectors, setSectors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getSectors().then(setSectors).catch(() => {});
  }, []);

  function update(key, value) {
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (key === "district") {
        next.taluk = "";
        next.talukOther = "";
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name || !phone) {
      setError("Please enter your name and mobile number.");
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      setError("Enter a valid mobile number.");
      return;
    }
    if (!form.district) {
      setError("Please select your district.");
      return;
    }
    if (!form.taluk || (form.taluk === "Other" && !form.talukOther.trim())) {
      setError("Please select or enter your taluk.");
      return;
    }
    if (!form.businessType || (form.businessType === "Other" && !form.businessTypeOther.trim())) {
      setError("Please select or enter your business type.");
      return;
    }
    if (!form.loanValue) {
      setError("Please select the loan amount range you're looking for.");
      return;
    }

    const payload = {
      name,
      phone,
      district: form.district,
      taluk: form.taluk === "Other" ? form.talukOther.trim() : form.taluk,
      businessType: form.businessType === "Other" ? form.businessTypeOther.trim() : form.businessType,
      loanValue: form.loanValue,
      source: "apply_form",
    };

    setSubmitting(true);
    try {
      const res = await api.submitLead(payload);
      setSuccess(res.message || "Thank you. Your application has been received.");
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const taluks = form.district ? getTaluksForDistrict(form.district) : [];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <span className="eyebrow">Apply Now</span>
          <h1>Apply for a business loan subsidy</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            Share a few details and our team will get in touch to guide you through the
            right scheme and the application process.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 640 }}>
          {success && <div className="form-status ok" style={{ marginBottom: 16 }}>{success}</div>}

          <form className="form" onSubmit={handleSubmit}>
            <div className="form-row two">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" type="text" placeholder="Your name"
                  value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="phone">Mobile number</label>
                <input id="phone" type="tel" placeholder="+91"
                  value={form.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
            </div>

            <div className="form-row two">
              <div className="field">
                <label htmlFor="district">District</label>
                <select id="district" value={form.district} onChange={(e) => update("district", e.target.value)}>
                  <option value="">Select district</option>
                  {TN_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="taluk">Taluk</label>
                <select id="taluk" value={form.taluk} onChange={(e) => update("taluk", e.target.value)} disabled={!form.district}>
                  <option value="">{form.district ? "Select taluk" : "Select district first"}</option>
                  {taluks.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {form.taluk === "Other" && (
                  <input
                    style={{ marginTop: 8 }}
                    type="text"
                    placeholder="Enter your taluk"
                    value={form.talukOther}
                    onChange={(e) => update("talukOther", e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="form-row two">
              <div className="field">
                <label htmlFor="businessType">Business type</label>
                <select id="businessType" value={form.businessType} onChange={(e) => update("businessType", e.target.value)}>
                  <option value="">Select business type</option>
                  {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
                  <option value="Other">Other</option>
                </select>
                {form.businessType === "Other" && (
                  <input
                    style={{ marginTop: 8 }}
                    type="text"
                    placeholder="Enter your business type"
                    value={form.businessTypeOther}
                    onChange={(e) => update("businessTypeOther", e.target.value)}
                  />
                )}
              </div>
              <div className="field">
                <label htmlFor="loanValue">Loan amount required</label>
                <select id="loanValue" value={form.loanValue} onChange={(e) => update("loanValue", e.target.value)}>
                  <option value="">Select loan amount range</option>
                  {LOAN_VALUE_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {error && <div className="form-status err">{error}</div>}

            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? "Submitting…" : "Submit application →"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}