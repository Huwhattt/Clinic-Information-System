import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { doctorsApi } from "../../api/mockApi";

const emptyForm = { name: "", specialization: "", schedule: "", contact: "" };

export default function DoctorList() {
  const { user } = useAuth();
  const canEdit = user.role === "admin";
  const [doctors, setDoctors] = useState([]);
  const [modalMode, setModalMode] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const load = () => doctorsApi.getAll().then(setDoctors);
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setModalMode("add"); };
  const openEdit = (d) => { setForm(d); setEditingId(d.id); setModalMode("edit"); };
  const close = () => { setModalMode(null); setEditingId(null); };
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (modalMode === "add") await doctorsApi.create(form);
    else await doctorsApi.update(editingId, form);
    close();
    load();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Remove this doctor from the roster?")) {
      await doctorsApi.remove(id);
      load();
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "specialization", label: "Specialization" },
    { key: "schedule", label: "Schedule" },
    { key: "contact", label: "Contact" },
    { key: "patientsSeen", label: "Patients Seen" },
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
    <AppLayout title="Doctors">
      <PageHeader
        title="Doctor Roster"
        subtitle={`${doctors.length} doctor${doctors.length === 1 ? "" : "s"} on staff`}
        action={canEdit && <button className="btn btn--primary" onClick={openAdd}>+ Add Doctor</button>}
      />

      <DataTable columns={columns} rows={doctors} />

      {modalMode && (
        <Modal
          title={modalMode === "add" ? "Add Doctor" : "Edit Doctor"}
          onClose={close}
          footer={
            <>
              <button className="btn btn--ghost" onClick={close}>Cancel</button>
              <button className="btn btn--primary" form="doctor-form" type="submit">Save</button>
            </>
          }
        >
          <form id="doctor-form" onSubmit={handleSave}>
            <div className="field">
              <label>Full name</label>
              <input value={form.name} onChange={update("name")} required />
            </div>
            <div className="field">
              <label>Specialization</label>
              <input value={form.specialization} onChange={update("specialization")} required />
            </div>
            <div className="field">
              <label>Schedule</label>
              <input value={form.schedule} onChange={update("schedule")} placeholder="e.g. Mon–Fri, 8AM–12PM" required />
            </div>
            <div className="field">
              <label>Contact number</label>
              <input value={form.contact} onChange={update("contact")} required />
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}