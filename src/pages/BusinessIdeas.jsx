import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client.js";

const GLYPHS = {
  "Goat & Sheep": "🐐",
  "Dairy": "🥛",
  "Poultry": "🐔",
  "Food Processing": "🍱",
  "Manufacturing": "🏭",
  "Trading": "🛍️",
  "Services": "💻",
};

const BLURB = {
  "Goat & Sheep": "Explore National Livestock Mission and other eligible livestock finance options.",
  "Dairy": "Animal husbandry and concessional finance routes for dairy units.",
  "Poultry": "Livestock and micro-enterprise schemes for rural poultry.",
  "Food Processing": "PMFME is the key central programme for micro food-processing units.",
  "Manufacturing": "PMEGP and NEEDS support new and expanding manufacturing units.",
  "Trading": "UYEGP, MUDRA and state routes can support retail/trading businesses.",
  "Services": "Compare state and central credit/support schemes for service enterprises.",
};

export default function BusinessIdeas() {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getSectors().then(setSectors).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <span className="eyebrow">Business Ideas</span>
          <h1>Business ideas that may qualify for finance</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            Use these sectors as starting points. Actual eligibility depends on the exact scheme,
            business activity and your applicant profile.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {loading && <p className="loading">Loading business categories…</p>}
          <div className="grid cols-4">
            {sectors.map((s) => (
              <div className="tile" key={s}>
                <div className="glyph">{GLYPHS[s] || "📁"}</div>
                <h3>{s}</h3>
                <p className="muted" style={{ fontSize: 13.5 }}>{BLURB[s] || "Explore eligible schemes for this sector."}</p>
                <Link to={`/schemes?sector=${encodeURIComponent(s)}`} className="entry-link">
                  See schemes →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
