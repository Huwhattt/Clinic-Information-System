import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import AppLayout from "../components/Layout/AppLayout";
import StatCard from "../components/common/StatCard";
import Badge from "../components/common/Badge";
import { useAuth } from "../context/AuthContext";
import {
  reportsApi,
  appointmentsApi,
  prescriptionsApi,
  billingApi,
  doctorsApi,
} from "../api/mockApi";

export default function Dashboard() {
  const { user, patientProfile } = useAuth();

  if (user.role === "admin" || user.role === "staff") return <AdminStaffDashboard role={user.role} />;
  if (user.role === "doctor") return <DoctorDashboard />;
  return <PatientDashboard patientProfile={patientProfile} />;
}

// ---------------- Admin / Staff ----------------
function AdminStaffDashboard({ role }) {
  const [summary, setSummary] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    reportsApi.getSummary().then(setSummary);
    appointmentsApi.getAll().then((data) =>
      setAppointments(data.filter((a) => a.status !== "Cancelled").slice(0, 6))
    );
  }, []);

  return (
    <AppLayout title="Dashboard">
      {summary && (
        <div className="stat-grid">
          <StatCard label="Total Patients" value={summary.totalPatients} accent="blue" />
          <StatCard label="Active Doctors" value={summary.totalDoctors} accent="teal" />
          <StatCard label="Pending Appointments" value={summary.pendingAppointments} accent="gold" />
          {role === "admin" && (
            <StatCard
              label="Outstanding Balance"
              value={`₱${summary.outstanding.toLocaleString()}`}
              hint={`₱${summary.totalRevenue.toLocaleString()} collected`}
              accent="clay"
            />
          )}
        </div>
      )}

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <h3>Patient visits, last 6 months</h3>
          {summary && (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={summary.monthlyVisits}>
                <CartesianGrid stroke="#e3ecf1" vertical={false} />
                <XAxis dataKey="month" stroke="#5b6e7a" fontSize={12} />
                <YAxis stroke="#5b6e7a" fontSize={12} width={30} />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#1c6e8c" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel">
          <h3>Upcoming appointments</h3>
          <ul className="mini-list">
            {appointments.map((a) => (
              <li key={a.id}>
                <div>
                  <div>{a.patientName}</div>
                  <div className="mini-list__meta">{a.doctorName} · {a.date} {a.time}</div>
                </div>
                <Badge status={a.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {role === "admin" && summary && (
        <div className="panel chart-panel">
          <h3>Revenue, last 6 months</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={summary.revenueByMonth}>
              <CartesianGrid stroke="#e3ecf1" vertical={false} />
              <XAxis dataKey="month" stroke="#5b6e7a" fontSize={12} />
              <YAxis stroke="#5b6e7a" fontSize={12} width={50} tickFormatter={(v) => `₱${v / 1000}k`} />
              <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#3f9c82" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </AppLayout>
  );
}

// ---------------- Doctor ----------------
function DoctorDashboard() {
  const { user } = useAuth();
  const [todays, setTodays] = useState([]);
  const [all, setAll] = useState([]);

  useEffect(() => {
    doctorsApi.getAll().then((docs) => {
      const me = docs.find((d) => d.userId === user.id);
      appointmentsApi.getAll().then((appts) => {
        const mine = me ? appts.filter((a) => a.doctorId === me.id) : appts;
        setAll(mine);
        const today = new Date().toISOString().slice(0, 10);
        setTodays(mine.filter((a) => a.date === today || a.status === "Pending"));
      });
    });
  }, [user.id]);

  return (
    <AppLayout title="Dashboard">
      <div className="stat-grid">
        <StatCard label="Appointments Today" value={todays.length} accent="blue" />
        <StatCard label="Total Scheduled" value={all.length} accent="teal" />
        <StatCard label="Pending Confirmations" value={all.filter((a) => a.status === "Pending").length} accent="gold" />
      </div>
      <div className="panel">
        <h3>Your upcoming appointments</h3>
        <ul className="mini-list">
          {all.slice(0, 8).map((a) => (
            <li key={a.id}>
              <div>
                <div>{a.patientName}</div>
                <div className="mini-list__meta">{a.reason} · {a.date} {a.time}</div>
              </div>
              <Badge status={a.status} />
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

// ---------------- Patient ----------------
function PatientDashboard({ patientProfile }) {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [billing, setBilling] = useState([]);

  useEffect(() => {
    if (!patientProfile) return;
    appointmentsApi.getByPatientId(patientProfile.id).then(setAppointments);
    prescriptionsApi.getByPatientId(patientProfile.id).then(setPrescriptions);
    billingApi.getByPatientId(patientProfile.id).then(setBilling);
  }, [patientProfile]);

  const balanceDue = billing.filter((b) => b.status !== "Paid").reduce((s, b) => s + b.amount, 0);

  return (
    <AppLayout title="My Dashboard">
      <div className="stat-grid">
        <StatCard label="Upcoming Appointments" value={appointments.filter((a) => a.status !== "Cancelled" && a.status !== "Completed").length} accent="blue" />
        <StatCard label="Active Prescriptions" value={prescriptions.filter((p) => p.status === "Active").length} accent="teal" />
        <StatCard label="Balance Due" value={`₱${balanceDue.toLocaleString()}`} accent={balanceDue > 0 ? "clay" : "teal"} />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <h3>My appointments</h3>
          <ul className="mini-list">
            {appointments.length === 0 && <li className="text-muted">No appointments yet.</li>}
            {appointments.map((a) => (
              <li key={a.id}>
                <div>
                  <div>{a.doctorName}</div>
                  <div className="mini-list__meta">{a.reason} · {a.date} {a.time}</div>
                </div>
                <Badge status={a.status} />
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3>Active prescriptions</h3>
          <ul className="mini-list">
            {prescriptions.length === 0 && <li className="text-muted">No prescriptions on file.</li>}
            {prescriptions.map((p) => (
              <li key={p.id}>
                <div>
                  <div>{p.medication}</div>
                  <div className="mini-list__meta">{p.dosage} · {p.duration}</div>
                </div>
                <Badge status={p.status} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}