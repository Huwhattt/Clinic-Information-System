import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CLINIC_NAME } from "../../data/mockData";

const initialForm = { name: "", email: "", password: "", age: "", gender: "Female", contact: "", address: "" };

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-screen__side">
        <div className="auth-screen__side-mark">{CLINIC_NAME}</div>
        <div className="auth-screen__side-quote">
          <h2>Register once, skip the paperwork every visit.</h2>
          <p>Create your patient account to book appointments and view your records online.</p>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
          Integrative Programming and Technologies — Full-Stack MERN Project
        </div>
      </div>
      <div className="auth-screen__form">
        <div className="auth-card" style={{ maxWidth: 400 }}>
          <h1>Create your account</h1>
          <p className="text-muted">Patient self-registration.</p>

          {error && <div className="form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" value={form.name} onChange={update("name")} required />
            </div>
            <div className="field">
              <label htmlFor="regEmail">Email</label>
              <input id="regEmail" type="email" value={form.email} onChange={update("email")} required />
            </div>
            <div className="field">
              <label htmlFor="regPassword">Password</label>
              <input id="regPassword" type="password" value={form.password} onChange={update("password")} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="age">Age</label>
                <input id="age" type="number" min="0" value={form.age} onChange={update("age")} required />
              </div>
              <div className="field">
                <label htmlFor="gender">Gender</label>
                <select id="gender" value={form.gender} onChange={update("gender")}>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor="contact">Contact number</label>
              <input id="contact" value={form.contact} onChange={update("contact")} required />
            </div>
            <div className="field">
              <label htmlFor="address">Address</label>
              <input id="address" value={form.address} onChange={update("address")} required />
            </div>
            <button className="btn btn--primary" type="submit" disabled={submitting} style={{ width: "100%" }}>
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-muted" style={{ marginTop: 16, fontSize: 13 }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}