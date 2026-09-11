import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client.js";
import SchemeEntry from "../components/SchemeEntry.jsx";

export default function Schemes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [schemes, setSchemes] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const sector = searchParams.get("sector") || "";
  const level = searchParams.get("level") || "";

  useEffect(() => {
    api.getSectors().then(setSectors).catch(() => {});
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError("");
    api
      .getSchemes({ search, sector, level })
      .then((res) => { if (!ignore) setSchemes(res.schemes); })
      .catch((err) => { if (!ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [search, sector, level]);

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 24 }}>
        <div className="container">
          <span className="eyebrow">Scheme Register</span>
          <h1>Government subsidy &amp; loan schemes</h1>
          <p className="muted" style={{ maxWidth: 640 }}>
            Every scheme below is loaded live from our database and kept in sync with the
            latest official guidelines we've verified.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="searchbar">
            <input
              type="search"
              placeholder="Search PMEGP, goat, women, food processing..."
              value={search}
              onChange={(e) => updateParam("search", e.target.value)}
            />
            <select value={sector} onChange={(e) => updateParam("sector", e.target.value)}>
              <option value="">All sectors</option>
              {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={level} onChange={(e) => updateParam("level", e.target.value)}>
              <option value="">Central + State</option>
              <option value="Central">Central Government</option>
              <option value="Tamil Nadu State">Tamil Nadu State</option>
            </select>
          </div>

          {loading && <p className="loading">Loading schemes…</p>}
          {error && <p className="field-error">Could not load schemes: {error}</p>}
          {!loading && !error && schemes.length === 0 && (
            <p className="muted">No schemes match this search. Try a different keyword or sector.</p>
          )}
          {!loading && !error && schemes.length > 0 && (
            <div className="register">
              {schemes.map((s, i) => (
                <SchemeEntry key={s.slug} scheme={s} index={i + 1} />
              ))}
            </div>
          )}

          <div className="notice" style={{ marginTop: 24 }}>
            Scheme information is provided for guidance. Always verify the current official
            notification before submitting an application.
          </div>
        </div>
      </section>
    </>
  );
}
