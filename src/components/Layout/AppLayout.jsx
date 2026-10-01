import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout({ title, children }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar role={user?.role} open={menuOpen} />
      {menuOpen && <div className="sidebar__scrim" onClick={() => setMenuOpen(false)} />}
      <div className="app-shell__main">
        <Topbar title={title} onMenuToggle={() => setMenuOpen((v) => !v)} />
        <main className="app-shell__content">{children}</main>
      </div>
    </div>
  );
}