import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CLINIC_NAME } from "../../data/mockData";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword("demo1234");
  };

  return (
    <div className="auth-screen">
      <div className="auth-screen__side">
        <div className="auth-screen__side-mark">{CLINIC_NAME}</div>
        <div className="auth-screen__side-quote">
          <h2>One record, every visit.</h2>
          <p>
            Patients, appointments, prescriptions, and billing in a single system —
            built so front desk, physicians, and administrators see exactly what they need.
          </p>
        </div>
      </div>
      <div className="auth-screen__form">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="text-muted">Sign in to continue to your dashboard.</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@wellpoint.clinic"
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password works in this demo"
                required
              />
            </div>
            <button className="btn btn--primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-muted" style={{ marginTop: 16, fontSize: 13 }}>
            New patient? <Link to="/register">Create an account</Link>
          </p>

          <div className="auth-demo-box">
            <div><strong>Demo accounts</strong> (any password):</div>
            <div>
              <button className="btn btn--ghost btn--sm" onClick={() => fillDemo("admin@wellpoint.clinic")} type="button">Admin</button>{" "}
              <button className="btn btn--ghost btn--sm" onClick={() => fillDemo("staff@wellpoint.clinic")} type="button">Staff</button>{" "}
              <button className="btn btn--ghost btn--sm" onClick={() => fillDemo("dr.gipit@wellpoint.clinic")} type="button">Doctor</button>{" "}
              <button className="btn btn--ghost btn--sm" onClick={() => fillDemo("liza.fernandez@mail.com")} type="button">Patient</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}