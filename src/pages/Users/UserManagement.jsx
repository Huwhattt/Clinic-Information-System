import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import { usersApi } from "../../api/mockApi";

const emptyForm = { name: "", email: "", role: "staff" };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => usersApi.getAll().then(setUsers);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setModalOpen(true); };
  const close = () => setModalOpen(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    await usersApi.create(form);
    close();
    load();
  };

  const toggleStatus = async (u) => {
    await usersApi.update(u.id, { status: u.status === "active" ? "inactive" : "active" });
    load();
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role", render: (row) => <span style={{ textTransform: "capitalize" }}>{row.role}</span> },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button className="btn btn--secondary btn--sm" onClick={() => toggleStatus(row)}>
          {row.status === "active" ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <AppLayout title="User Accounts">
      <PageHeader
        title="Staff & Doctor Accounts"
        subtitle="Manage login access for internal clinic accounts. Patients self-register."
        action={<button className="btn btn--primary" onClick={openAdd}>+ Add Account</button>}
      />

      <DataTable columns={columns} rows={users} />

      {modalOpen && (
        <Modal
          title="Add Account"
          onClose={close}
          footer={
            <>
              <button className="btn btn--ghost" onClick={close}>Cancel</button>
              <button className="btn btn--primary" form="user-form" type="submit">Create Account</button>
            </>
          }
        >
          <form id="user-form" onSubmit={handleSave}>
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={update("name")} required />
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" value={form.email} onChange={update("email")} required />
            </div>
            <div className="field">
              <label>Role</label>
              <select value={form.role} onChange={update("role")}>
                <option value="staff">Staff / Receptionist</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}