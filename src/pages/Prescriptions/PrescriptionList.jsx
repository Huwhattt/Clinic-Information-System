import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { prescriptionsApi, patientsApi } from "../../api/mockApi";

const emptyForm = { patientId: "", medication: "", dosage: "", duration: "" };

export default function PrescriptionList() {
  const { user, patientProfile } = useAuth();
  const isDoctor = user.role === "doctor";
  const isPatient = user.role === "patient";
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const [rx, pats] = await Promise.all([prescriptionsApi.getAll(), patientsApi.getAll()]);
    setPatients(pats);
    if (isPatient && patientProfile) {
      setPrescriptions(rx.filter((r) => r.patientId === patientProfile.id));
    } else {
      setPrescriptions(rx);
    }
  };

  useEffect(() => { load(); }, [patientProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => { setForm(emptyForm); setModalOpen(true); };
  const close = () => setModalOpen(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);
    await prescriptionsApi.create({ ...form, patientName: patient?.name || "", doctorName: user.name });
    close();
    load();
  };

  const markCompleted = async (id) => {
    await prescriptionsApi.update(id, { status: "Completed" });
    load();
  };

  const columns = [
    ...(!isPatient ? [{ key: "patientName", label: "Patient" }] : []),
    { key: "doctorName", label: "Prescribed by" },
    { key: "date", label: "Date" },
    { key: "medication", label: "Medication" },
    { key: "dosage", label: "Dosage" },
    { key: "duration", label: "Duration" },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    ...(isDoctor ? [{
      key: "actions",
      label: "",
      render: (row) => row.status === "Active" && (
        <button className="btn btn--secondary btn--sm" onClick={() => markCompleted(row.id)}>Mark Completed</button>
      ),
    }] : []),
  ];

  return (
    <AppLayout title={isPatient ? "My Prescriptions" : "Prescriptions"}>
      <PageHeader
        title={isPatient ? "My Prescriptions" : "Prescriptions"}
        subtitle={`${prescriptions.length} prescription${prescriptions.length === 1 ? "" : "s"}`}
        action={isDoctor && <button className="btn btn--primary" onClick={openAdd}>+ New Prescription</button>}
      />

      <DataTable columns={columns} rows={prescriptions} emptyMessage="No prescriptions on file." />

      {modalOpen && (
        <Modal
          title="New Prescription"
          onClose={close}
          footer={
            <>
              <button className="btn btn--ghost" onClick={close}>Cancel</button>
              <button className="btn btn--primary" form="rx-form" type="submit">Save Prescription</button>
            </>
          }
        >
          <form id="rx-form" onSubmit={handleSave}>
            <div className="field">
              <label>Patient</label>
              <select value={form.patientId} onChange={update("patientId")} required>
                <option value="">Select patient…</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Medication</label>
              <input value={form.medication} onChange={update("medication")} required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Dosage</label>
                <input value={form.dosage} onChange={update("dosage")} placeholder="e.g. 1 tablet twice daily" required />
              </div>
              <div className="field">
                <label>Duration</label>
                <input value={form.duration} onChange={update("duration")} placeholder="e.g. 7 days" required />
              </div>
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}