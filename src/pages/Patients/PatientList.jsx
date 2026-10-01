import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { patientsApi } from "../../api/mockApi";

const emptyForm = { name: "", age: "", gender: "Female", contact: "", address: "", bloodType: "", allergies: "" };

export default function PatientList() {
  const { user } = useAuth();
  const canEdit = user.role === "admin" || user.role === "staff";
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [modalMode, setModalMode] = useState(null); // "add" | "edit" | null
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const loadPatients = () => patientsApi.getAll().then(setPatients);
  useEffect(() => { loadPatients(); }, []);

  const filtered = patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm(emptyForm); setModalMode("add"); };
  const openEdit = (p) => { setForm(p); setEditingId(p.id); setModalMode("edit"); };
  const close = () => { setModalMode(null); setEditingId(null); };

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      await patientsApi.create({ ...form, age: Number(form.age) });
    } else {
      await patientsApi.update(editingId, { ...form, age: Number(form.age) });
    }
    close();
    loadPatients();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this patient record? This cannot be undone.")) {
      await patientsApi.remove(id);
      loadPatients();
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Gender" },
    { key: "contact", label: "Contact" },
    { key: "bloodType", label: "Blood Type" },
    { key: "allergies", label: "Allergies" },
    ...(canEdit ? [{
      key: "actions",
      label: "",
      render: (row) => (
        <div className="table-actions">
          <button className="btn btn--secondary btn--sm" onClick={() => openEdit(row)}>Edit</button>
          <button className="btn btn--danger btn--sm" onClick={() => handleDelete(row.id)}>Remove</button>
        </div>
      ),
    }] : []),
  ];

  return (
    <AppLayout title="Patients">
      <PageHeader
        title="Patient Records"
        subtitle={`${patients.length} registered patient${patients.length === 1 ? "" : "s"}`}
        action={canEdit && <button className="btn btn--primary" onClick={openAdd}>+ Add Patient</button>}
      />

      <div className="toolbar">
        <div className="toolbar__search">
          <input placeholder="Search by name…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <DataTable columns={columns} rows={filtered} emptyMessage="No patients match your search." />

      {modalMode && (
        <Modal
          title={modalMode === "add" ? "Add Patient" : "Edit Patient"}
          onClose={close}
          footer={
            <>
              <button className="btn btn--ghost" onClick={close}>Cancel</button>
              <button className="btn btn--primary" form="patient-form" type="submit">Save</button>
            </>
          }
        >
          <form id="patient-form" onSubmit={handleSave}>
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={update("name")} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Age</label>
                <input type="number" min="0" value={form.age} onChange={update("age")} required />
              </div>
              <div className="field">
                <label>Gender</label>
                <select value={form.gender} onChange={update("gender")}>
                  <option>Female</option>
                  <option>Male</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Contact number</label>
              <input value={form.contact} onChange={update("contact")} required />
            </div>
            <div className="field">
              <label>Address</label>
              <input value={form.address} onChange={update("address")} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Blood type</label>
                <input value={form.bloodType} onChange={update("bloodType")} placeholder="e.g. O+" />
              </div>
              <div className="field">
                <label>Known allergies</label>
                <input value={form.allergies} onChange={update("allergies")} placeholder="e.g. Penicillin" />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}