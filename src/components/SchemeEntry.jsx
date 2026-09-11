import { Link } from "react-router-dom";

const STATUS_LABEL = {
  active: "Active",
  verify_status: "Verify status",
  closed: "Scheme closed",
};

export default function SchemeEntry({ scheme, index }) {
  return (
    <article className="entry">
      <div className="entry-index">{String(index).padStart(2, "0")}</div>
      <div>
        <div className="entry-head">
          <h3>{scheme.name}</h3>
          <span className={`status-tag status-${scheme.status}`}>
            {STATUS_LABEL[scheme.status] || scheme.status}
          </span>
          <span className="level-tag">{scheme.level}</span>
        </div>
        <p className="muted" style={{ marginBottom: 4 }}>{scheme.fullName}</p>
        <div className="entry-amount">{scheme.subsidy}</div>
        <p>{scheme.summary}</p>
        <div className="entry-tags">
          {scheme.sectors?.map((s) => (
            <span className="pill" key={s}>{s}</span>
          ))}
        </div>
        <Link to={`/schemes/${scheme.slug}`} className="entry-link">
          View full details →
        </Link>
      </div>
    </article>
  );
}
