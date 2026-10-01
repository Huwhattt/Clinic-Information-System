import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import { useAuth } from "../../context/AuthContext";
import { appointmentsApi, doctorsApi, patientsApi } from "../../api/mockApi";

const emptyForm = { patientId: "", doctorId: "", date: "", time: "", reason: "" };

export default function AppointmentList() {
  const { user, patientProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const isPatient = user.role === "patient";
  const isDoctor = user.role === "doctor";
  const canManageStatus = user.role === "admin" || user.role === "staff" || user.role === "doctor";
  const canBook = user.role === "admin" || user.role === "staff" || isPatient;

  const load = async () => {
    const [appts, docs, pats] = await Promise.all([
      appointmentsApi.getAll(),
      doctorsApi.getAll(),
      patientsApi.getAll(),
    ]);
    setDoctors(docs);
    setPatients(pats);

    if (isPatient && patientProfile) {
      setAppointments(appts.filter((a) => a.patientId === patientProfile.id));
    } else if (isDoctor) {
      const me = docs.find((d) => d.userId === user.id);
      setAppointments(me ? appts.filter((a) => a.doctorId === me.id) : appts);
    } else {
      setAppointments(appts);
    }
  };

  useEffect(() => { load(); }, [patientProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const openBooking = () => {
    setForm(isPatient ? { ...emptyForm, patientId: patientProfile?.id || "" } : emptyForm);
    setModalOpen(true);
  };
  const close = () => setModalOpen(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleBook = async (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);
    const doctor = doctors.find((d) => d.id === form.doctorId);
    await appointmentsApi.create({
      ...form,
      patientName: patient?.name || "",
      doctorName: doctor?.name || "",
    });
    close();
    load();
  };

  const updateStatus = async (id, status) => {
    await appointmentsApi.update(id, { status });
    load();
  };

  const columns = [
    ...(!isPatient ? [{ key: "patientName", label: "Patient" }] : []),
    ...(!isDoctor ? [{ key: "doctorName", label: "Doctor" }] : []),
    { key: "date", label: "Date" },
    { key: "time", label: "Time" },
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    ...(canManageStatus ? [{
      key: "actions",
      label: "",
      render: (row) => (
        <div className="table-actions">
          {row.status === "Pending" && (
            <button className="btn btn--secondary btn--sm" onClick={() => updateStatus(row.id, "Confirmed")}>Confirm</button>
          )}
          {row.status === "Confirmed" && (
            <button className="btn btn--secondary btn--sm" onClick={() => updateStatus(row.id, "Completed")}>Complete</button>
          )}
          {row.status !== "Cancelled" && row.status !== "Completed" && (
            <button className="btn btn--danger btn--sm" onClick={() => updateStatus(row.id, "Cancelled")}>Cancel</button>
          )}
        </div>
      ),
    }] : []),
  ];

  return (
    <AppLayout title={isPatient ? "My Appointments" : isDoctor ? "My Appointments" : "Appointments"}>
      <PageHeader
        title={isPatient ? "My Appointments" : "Appointment Schedule"}
        subtitle={`${appointments.length} appointment${appointments.length === 1 ? "" : "s"}`}
        action={canBook && <button className="btn btn--primary" onClick={openBooking}>+ Book Appointment</button>}
      />

      <DataTable columns={columns} rows={appointments} emptyMessage="No appointments scheduled." />

      {modalOpen && (
        <Modal
          title="Book Appointment"
          onClose={close}
          footer={
            <>
              <button className="btn btn--ghost" onClick={close}>Cancel</button>
              <button className="btn btn--primary" form="appt-form" type="submit">Book</button>
            </>
          }
        >
          <form id="appt-form" onSubmit={handleBook}>
            {!isPatient && (
              <div className="field">
                <label>Patient</label>
                <select value={form.patientId} onChange={update("patientId")} required>
                  <option value="">Select patient…</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            )}
            <div className="field">
              <label>Doctor</label>
              <select value={form.doctorId} onChange={update("doctorId")} required>
                <option value="">Select doctor…</option>
                {doctors.map((d) => <option key={d.id} value={d.id}>{d.name} — {d.specialization}</option>)}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Date</label>
                <input type="date" value={form.date} onChange={update("date")} required />
              </div>
              <div className="field">
                <label>Time</label>
                <input type="time" value={form.time} onChange={update("time")} required />
              </div>
            </div>
            <div className="field">
              <label>Reason for visit</label>
              <input value={form.reason} onChange={update("reason")} required />
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}