import React, { useEffect, useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import AppLayout from "../../components/Layout/AppLayout";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import { reportsApi, billingApi, appointmentsApi } from "../../api/mockApi";

const STATUS_COLORS = { Paid: "#3f9c82", Unpaid: "#c1563f", Pending: "#b98328" };

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const [billingByStatus, setBillingByStatus] = useState([]);
  const [appointmentsByStatus, setAppointmentsByStatus] = useState([]);

  useEffect(() => {
    reportsApi.getSummary().then(setSummary);
    billingApi.getAll().then((bills) => {
      const grouped = {};
      bills.forEach((b) => { grouped[b.status] = (grouped[b.status] || 0) + b.amount; });
      setBillingByStatus(Object.entries(grouped).map(([status, amount]) => ({ status, amount })));
    });
    appointmentsApi.getAll().then((appts) => {
      const grouped = {};
      appts.forEach((a) => { grouped[a.status] = (grouped[a.status] || 0) + 1; });
      setAppointmentsByStatus(Object.entries(grouped).map(([status, count]) => ({ status, count })));
    });
  }, []);

  return (
    <AppLayout title="Reports">
      <PageHeader title="Clinic Reports" subtitle="Operational and financial overview" />

      {summary && (
        <div className="stat-grid">
          <StatCard label="Total Patients" value={summary.totalPatients} accent="blue" />
          <StatCard label="Total Doctors" value={summary.totalDoctors} accent="teal" />
          <StatCard label="Revenue Collected" value={`₱${summary.totalRevenue.toLocaleString()}`} accent="teal" />
          <StatCard label="Outstanding Balance" value={`₱${summary.outstanding.toLocaleString()}`} accent="clay" />
        </div>
      )}

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <h3>Patient visits, last 6 months</h3>
          {summary && (
            <ResponsiveContainer width="100%" height={240}>
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

        <div className="panel chart-panel">
          <h3>Appointments by status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={appointmentsByStatus} dataKey="count" nameKey="status" innerRadius={55} outerRadius={85} paddingAngle={2}>
                {appointmentsByStatus.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#1c6e8c"} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel chart-panel">
          <h3>Revenue, last 6 months</h3>
          {summary && (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={summary.revenueByMonth}>
                <CartesianGrid stroke="#e3ecf1" vertical={false} />
                <XAxis dataKey="month" stroke="#5b6e7a" fontSize={12} />
                <YAxis stroke="#5b6e7a" fontSize={12} width={50} tickFormatter={(v) => `₱${v / 1000}k`} />
                <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#3f9c82" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="panel chart-panel">
          <h3>Billing by status</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={billingByStatus} layout="vertical">
              <CartesianGrid stroke="#e3ecf1" horizontal={false} />
              <XAxis type="number" stroke="#5b6e7a" fontSize={12} tickFormatter={(v) => `₱${v / 1000}k`} />
              <YAxis type="category" dataKey="status" stroke="#5b6e7a" fontSize={12} width={70} />
              <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {billingByStatus.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#1c6e8c"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}