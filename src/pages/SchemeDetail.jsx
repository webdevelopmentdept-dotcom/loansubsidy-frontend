import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client.js";

export default function SchemeDetail() {
  const { slug } = useParams();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    api
      .getScheme(slug)
      .then((s) => { if (!ignore) setScheme(s); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [slug]);

  if (loading) return <p className="loading">Loading scheme…</p>;

  if (error || !scheme) {
    return (
      <div className="container section">
        <h1>Scheme not found</h1>
        <p className="muted">{error || "This scheme does not exist or is no longer listed."}</p>
        <Link to="/schemes" className="btn btn-outline">← Back to all schemes</Link>
      </div>
    );
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 30 }}>
        <div className="container">
          <span className="eyebrow">{scheme.type}</span>
          <h1>{scheme.name}</h1>
          <p className="muted" style={{ fontSize: 17 }}>{scheme.fullName}</p>
          <p style={{ maxWidth: 680 }}>{scheme.summary}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid cols-3">
            <div className="tile">
              <h3>Subsidy / Benefit</h3>
              <p>{scheme.subsidy || "—"}</p>
              {scheme.interestSupport && <p className="muted">{scheme.interestSupport}</p>}
            </div>
            <div className="tile">
              <h3>Project / Loan size</h3>
              <p>{scheme.maxProject || "—"}</p>
            </div>
            <div className="tile">
              <h3>Who it's for</h3>
              <p>{scheme.target}</p>
              <div className="entry-tags">
                {scheme.sectors?.map((s) => <span className="pill" key={s}>{s}</span>)}
              </div>
            </div>
          </div>

          {scheme.eligibilityPoints?.length > 0 && (
            <div style={{ marginTop: 26 }}>
              <h2>Eligibility points</h2>
              <ul>
                {scheme.eligibilityPoints.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          <div className="grid cols-2" style={{ marginTop: 26 }}>
            <div>
              <h2>Documents typically required</h2>
              <ul>
                {scheme.documents?.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </div>
            <div>
              <h2>Guidelines &amp; important notes</h2>
              <p>{scheme.guidelines || "No additional notes."}</p>
              {scheme.source && (
                <a className="btn btn-outline" href={scheme.source} target="_blank" rel="noopener noreferrer">
                  Official source ↗
                </a>
              )}
            </div>
          </div>

          <div className="notice" style={{ marginTop: 28 }}>
            <strong>Important:</strong> Scheme details can change. Final eligibility, sanction and
            subsidy amount are decided by the concerned government authority, bank or financial
            institution — this page does not guarantee approval.
          </div>

          <div style={{ marginTop: 22 }}>
            <Link to="/eligibility" className="btn btn-primary">Check if you qualify →</Link>{" "}
            <Link to="/schemes" className="btn btn-outline">← Back to all schemes</Link>
          </div>
        </div>
      </section>
    </>
  );
}
