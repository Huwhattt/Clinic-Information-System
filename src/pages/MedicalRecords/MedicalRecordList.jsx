import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import { useAuth } from "../../context/AuthContext";
import { medicalRecordsApi, patientsApi } from "../../api/mockApi";

const emptyForm = { patientId: "", diagnosis: "", notes: "" };

export default function MedicalRecordList() {
  const { user, patientProfile } = useAuth();
  const isDoctor = user.role === "doctor";
  const isPatient = user.role === "patient";
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const [recs, pats] = await Promise.all([medicalRecordsApi.getAll(), patientsApi.getAll()]);
    setPatients(pats);
    if (isPatient && patientProfile) {
      setRecords(recs.filter((r) => r.patientId === patientProfile.id));
    } else {
      setRecords(recs);
    }
  };

  useEffect(() => { load(); }, [patientProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => { setForm(emptyForm); setModalOpen(true); };
  const close = () => setModalOpen(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);
    await medicalRecordsApi.create({
      ...form,
      patientName: patient?.name || "",
      doctorName: user.name,
    });
    close();
    load();
  };

  const columns = [
    ...(!isPatient ? [{ key: "patientName", label: "Patient" }] : []),
    { key: "doctorName", label: "Doctor" },
    { key: "date", label: "Date" },
    { key: "diagnosis", label: "Diagnosis" },
    { key: "notes", label: "Notes" },
  ];

  return (
    <AppLayout title={isPatient ? "My Medical Records" : "Medical Records"}>
      <PageHeader
        title={isPatient ? "My Medical Records" : "Medical Records"}
        subtitle={`${records.length} record${records.length === 1 ? "" : "s"} on file`}
        action={isDoctor && <button className="btn btn--primary" onClick={openAdd}>+ New Record</button>}
      />

      <DataTable columns={columns} rows={records} emptyMessage="No medical records yet." />

      {modalOpen && (
        <Modal
          title="New Medical Record"
          onClose={close}
          footer={
            <>
              <button className="btn btn--ghost" onClick={close}>Cancel</button>
              <button className="btn btn--primary" form="record-form" type="submit">Save Record</button>
            </>
          }
        >
          <form id="record-form" onSubmit={handleSave}>
            <div className="field">
              <label>Patient</label>
              <select value={form.patientId} onChange={update("patientId")} required>
                <option value="">Select patient…</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Diagnosis</label>
              <input value={form.diagnosis} onChange={update("diagnosis")} required />
            </div>
            <div className="field">
              <label>Clinical notes</label>
              <textarea rows={4} value={form.notes} onChange={update("notes")} required />
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}