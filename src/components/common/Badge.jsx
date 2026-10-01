// Badge.jsx
import React from "react";

// Maps a status word to a badge tone. Extend TONE_MAP if new statuses are introduced.
const TONE_MAP = {
  active: "success",
  confirmed: "success",
  paid: "success",
  completed: "success",
  pending: "warning",
  unpaid: "danger",
  cancelled: "danger",
  inactive: "danger",
};

export default function Badge({ status }) {
  const tone = TONE_MAP[String(status).toLowerCase()] || "neutral";
  return <span className={`badge badge--${tone}`}>{status}</span>;
}