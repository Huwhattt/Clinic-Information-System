import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ROLE_LABEL = {
  admin: "Administrator",
  staff: "Front Desk Staff",
  doctor: "Physician",
  patient: "Patient",
};

export default function Topbar({ title, onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((part) => part[0]).slice(0, 2).join("")
    : "?";

  return (
    <header className="topbar">
      <button className="topbar__menu-btn" onClick={onMenuToggle} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>
      <h1 className="topbar__title">{title}</h1>
      <div className="topbar__user">
        <div className="topbar__user-info">
          <span className="topbar__user-name">{user?.name}</span>
          <span className="topbar__user-role">{ROLE_LABEL[user?.role] || user?.role}</span>
        </div>
        <div className="topbar__avatar">{initials}</div>
        <button className="btn btn--ghost btn--sm" onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}