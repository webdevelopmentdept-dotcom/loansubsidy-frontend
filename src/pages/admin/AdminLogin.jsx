import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminClient.js";
import { adminAuth } from "../../utils/adminAuth.js";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await adminApi.login(username, password);
      adminAuth.setToken(res.token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <form className="form admin-login-card" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
        <p className="muted">BUSINESSLOANSUBSIDY.in management panel</p>

        <div className="field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="form-status err">{error}</div>}

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>
    </div>
  );
}