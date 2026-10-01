// StatCard.jsx
import React from "react";

export default function StatCard({ label, value, hint, accent = "blue" }) {
  return (
    <div className={`stat-card stat-card--${accent}`}>
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      {hint && <div className="stat-card__hint">{hint}</div>}
    </div>
  );
}