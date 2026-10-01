import React from "react";
import { NavLink } from "react-router-dom";
import { CLINIC_NAME } from "../../data/mockData";

const NAV_BY_ROLE = {
  admin: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/patients", label: "Patients" },
    { to: "/doctors", label: "Doctors" },
    { to: "/appointments", label: "Appointments" },
    { to: "/records", label: "Medical Records" },
    { to: "/prescriptions", label: "Prescriptions" },
    { to: "/billing", label: "Billing" },
    { to: "/reports", label: "Reports" },
    { to: "/users", label: "User Accounts" },
  ],
  staff: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/patients", label: "Patients" },
    { to: "/appointments", label: "Appointments" },
    { to: "/billing", label: "Billing" },
  ],
  doctor: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/appointments", label: "My Appointments" },
    { to: "/patients", label: "Patients" },
    { to: "/records", label: "Medical Records" },
    { to: "/prescriptions", label: "Prescriptions" },
  ],
  patient: [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/appointments", label: "My Appointments" },
    { to: "/records", label: "My Records" },
    { to: "/prescriptions", label: "My Prescriptions" },
    { to: "/billing", label: "My Billing" },
  ],
};

export default function Sidebar({ role, open }) {
  const items = NAV_BY_ROLE[role] || [];

  return (
    <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">+</span>
        <div>
          <div className="sidebar__brand-name">{CLINIC_NAME}</div>
          <div className="sidebar__brand-sub">Information System</div>
        </div>
      </div>
      <nav className="sidebar__nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => "sidebar__link" + (isActive ? " sidebar__link--active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}