import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminClient.js";
import { adminAuth } from "../../utils/adminAuth.js";
import AdminSchemes from "./AdminSchemes.jsx";
import AdminLeads from "./AdminLeads.jsx";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("schemes");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    adminApi.getSummary().then(setSummary).catch(() => {});
  }, []);

  function logout() {
    adminAuth.clearToken();
    navigate("/admin/login");
  }

  return (
    <div className="admin-shell">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="eyebrow">Admin Panel</span>
            <h1 style={{ marginBottom: 0 }}>BUSINESSLOANSUBSIDY.in</h1>
          </div>
          <button className="btn btn-outline" onClick={logout}>Log out</button>
        </div>

        {summary && (
          <div className="grid cols-4" style={{ marginBottom: 30 }}>
            <div className="tile"><h3>{summary.activeSchemeCount}</h3><p className="muted">Active schemes ({summary.schemeCount} total)</p></div>
            <div className="tile"><h3>{summary.leadCount}</h3><p className="muted">Total enquiries</p></div>
            <div className="tile"><h3>{summary.newLeadCount}</h3><p className="muted">New / unread enquiries</p></div>
            <div className="tile"><h3>{summary.eligibilityCount}</h3><p className="muted">Eligibility checks run</p></div>
          </div>
        )}

        <div className="admin-tabs">
          <button className={tab === "schemes" ? "active" : ""} onClick={() => setTab("schemes")}>Schemes</button>
          <button className={tab === "leads" ? "active" : ""} onClick={() => setTab("leads")}>Leads</button>
        </div>

        <div className="admin-panel">
          {tab === "schemes" && <AdminSchemes />}
          {tab === "leads" && <AdminLeads />}
        </div>
      </div>
    </div>
  );
}