import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import SchemeEntry from "../components/SchemeEntry.jsx";

const SECTOR_GLYPHS = {
  "Goat & Sheep": "🐐",
  "Dairy": "🥛",
  "Poultry": "🐔",
  "Food Processing": "🍅",
  "Manufacturing": "🏭",
  "Trading": "🛍️",
  "Services": "🧰",
};

export default function Home() {
  const [schemes, setSchemes] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const [schemeRes, sectorRes] = await Promise.all([
          api.getSchemes(),
          api.getSectors(),
        ]);
        if (!ignore) {
          setSchemes(schemeRes.schemes.slice(0, 5));
          setSectors(sectorRes);
        }
      } catch (err) {
        if (!ignore) setError(err.message);
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Government Schemes · Business Loans · Tamil Nadu</span>
            <h1>Turn your business plan into a funded enterprise.</h1>
            <p className="muted" style={{ fontSize: 17, maxWidth: 560 }}>
              We help you find government subsidy schemes and business-loan routes that fit your
              profile, prepare your application, and connect with the right authority or bank.
            </p>
            <div className="no-upfront-stamp">NO UPFRONT PAYMENT</div>
            <p className="fee-note">
              Basic assistance is provided without any upfront payment. Any applicable
              service/success fee is disclosed in writing before it becomes payable.
            </p>
            <div className="hero-actions">
              <Link to="/apply" className="btn btn-primary">Apply Now →</Link>
              <Link to="/schemes" className="btn btn-outline">Browse All Schemes</Link>
            </div>
          </div>
          <div className="hero-panel">
            <h3>10-question eligibility check</h3>
            <p className="muted">
              Business type, project cost, age, community, gender and district — tell us once,
              and we match you against every scheme in our database.
            </p>
            <Link to="/apply" className="btn btn-outline btn-block">Start now</Link>
          </div>
        </div>
      </section>

      <section className="stat-strip">
        <div className="container">
          <div>
            <strong>10,000+</strong>
            <span>Entrepreneurs assisted</span>
          </div>
          <div>
            <strong>12+</strong>
            <span>Government schemes tracked</span>
          </div>
          <div>
            <strong>₹0</strong>
            <span>Upfront payment</span>
          </div>
          <div>
            <strong>All 38</strong>
            <span>Tamil Nadu districts</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Explore support by business type</h2>
            <p className="muted">Sectors commonly covered by government schemes and institutional credit.</p>
          </div>
          <div className="grid cols-4">
            {sectors.length === 0 && !loading && (
              <p className="muted">No sectors published yet.</p>
            )}
            {sectors.map((s) => (
              <Link to={`/schemes?sector=${encodeURIComponent(s)}`} key={s} className="tile">
                <div className="glyph">{SECTOR_GLYPHS[s] || "📁"}</div>
                <h3>{s}</h3>
                <p className="muted" style={{ fontSize: 13 }}>View eligible schemes →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <div className="section-head">
            <h2>How it works</h2>
          </div>
          <div className="steps">
            <div className="step">
              <strong>Tell us your business</strong>
              <p className="muted">Business type, project cost and applicant profile.</p>
            </div>
            <div className="step">
              <strong>See potential schemes</strong>
              <p className="muted">We match your profile against subsidy and loan schemes in our database.</p>
            </div>
            <div className="step">
              <strong>Prepare your application</strong>
              <p className="muted">Document checklist, project report and process guidance.</p>
            </div>
            <div className="step">
              <strong>Apply with the authority/lender</strong>
              <p className="muted">Final approval always rests with the concerned authority or bank.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>Popular schemes</h2>
            <p className="muted">A sample from our live scheme register.</p>
          </div>
          {loading && <p className="loading">Loading schemes…</p>}
          {error && <p className="field-error">{error}</p>}
          {!loading && !error && (
            <div className="register">
              {schemes.map((s, i) => (
                <SchemeEntry key={s.slug} scheme={s} index={i + 1} />
              ))}
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            <Link to="/schemes" className="btn btn-outline">View all schemes →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
