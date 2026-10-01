import React, { useEffect, useState } from "react";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import DataTable from "../../components/common/DataTable";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import StatCard from "../../components/common/StatCard";
import { useAuth } from "../../context/AuthContext";
import { billingApi, patientsApi } from "../../api/mockApi";

const emptyForm = { patientId: "", description: "", amount: "" };

export default function BillingList() {
  const { user, patientProfile } = useAuth();
  const isPatient = user.role === "patient";
  const canManage = user.role === "admin" || user.role === "staff";
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    const [bills, pats] = await Promise.all([billingApi.getAll(), patientsApi.getAll()]);
    setPatients(pats);
    if (isPatient && patientProfile) {
      setRecords(bills.filter((b) => b.patientId === patientProfile.id));
    } else {
      setRecords(bills);
    }
  };

  useEffect(() => { load(); }, [patientProfile]); // eslint-disable-line react-hooks/exhaustive-deps

  const openAdd = () => { setForm(emptyForm); setModalOpen(true); };
  const close = () => setModalOpen(false);
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === form.patientId);
    await billingApi.create({ ...form, amount: Number(form.amount), patientName: patient?.name || "" });
    close();
    load();
  };

  const markPaid = async (id) => {
    await billingApi.update(id, { status: "Paid" });
    load();
  };

  const totalDue = records.filter((r) => r.status !== "Paid").reduce((s, r) => s + r.amount, 0);
  const totalPaid = records.filter((r) => r.status === "Paid").reduce((s, r) => s + r.amount, 0);

  const columns = [
    ...(!isPatient ? [{ key: "patientName", label: "Patient" }] : []),
    { key: "date", label: "Date" },
    { key: "description", label: "Description" },
    { key: "amount", label: "Amount", render: (row) => `₱${row.amount.toLocaleString()}` },
    { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
    ...(canManage ? [{
      key: "actions",
      label: "",
      render: (row) => row.status !== "Paid" && (
        <button className="btn btn--secondary btn--sm" onClick={() => markPaid(row.id)}>Mark Paid</button>
      ),
    }] : []),
  ];

  return (
    <AppLayout title={isPatient ? "My Billing" : "Billing"}>
      <PageHeader
        title={isPatient ? "My Billing" : "Billing & Invoices"}
        subtitle={`${records.length} record${records.length === 1 ? "" : "s"}`}
        action={canManage && <button className="btn btn--primary" onClick={openAdd}>+ New Invoice</button>}
      />

      <div className="stat-grid">
        <StatCard label="Outstanding" value={`₱${totalDue.toLocaleString()}`} accent="clay" />
        <StatCard label="Collected" value={`₱${totalPaid.toLocaleString()}`} accent="teal" />
      </div>

      <DataTable columns={columns} rows={records} emptyMessage="No billing records yet." />

      {modalOpen && (
        <Modal
          title="New Invoice"
          onClose={close}
          footer={
            <>
              <button className="btn btn--ghost" onClick={close}>Cancel</button>
              <button className="btn btn--primary" form="bill-form" type="submit">Save Invoice</button>
            </>
          }
        >
          <form id="bill-form" onSubmit={handleSave}>
            <div className="field">
              <label>Patient</label>
              <select value={form.patientId} onChange={update("patientId")} required>
                <option value="">Select patient…</option>
                {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Description</label>
              <input value={form.description} onChange={update("description")} placeholder="e.g. Consultation + lab work" required />
            </div>
            <div className="field">
              <label>Amount (₱)</label>
              <input type="number" min="0" value={form.amount} onChange={update("amount")} required />
            </div>
          </form>
        </Modal>
      )}
    </AppLayout>
  );
}