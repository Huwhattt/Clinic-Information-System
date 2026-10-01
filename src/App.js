import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/Layout/ProtectedRoute";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import PatientList from "./pages/Patients/PatientList";
import DoctorList from "./pages/Doctors/DoctorList";
import AppointmentList from "./pages/Appointments/AppointmentList";
import MedicalRecordList from "./pages/MedicalRecords/MedicalRecordList";
import PrescriptionList from "./pages/Prescriptions/PrescriptionList";
import BillingList from "./pages/Billing/BillingList";
import Reports from "./pages/Reports/Reports";
import UserManagement from "./pages/Users/UserManagement";

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/patients" element={
            <ProtectedRoute roles={["admin", "staff", "doctor"]}><PatientList /></ProtectedRoute>
          } />
          <Route path="/doctors" element={
            <ProtectedRoute roles={["admin", "staff"]}><DoctorList /></ProtectedRoute>
          } />
          <Route path="/appointments" element={
            <ProtectedRoute><AppointmentList /></ProtectedRoute>
          } />
          <Route path="/records" element={
            <ProtectedRoute roles={["admin", "staff", "doctor", "patient"]}><MedicalRecordList /></ProtectedRoute>
          } />
          <Route path="/prescriptions" element={
            <ProtectedRoute roles={["admin", "staff", "doctor", "patient"]}><PrescriptionList /></ProtectedRoute>
          } />
          <Route path="/billing" element={
            <ProtectedRoute roles={["admin", "staff", "patient"]}><BillingList /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute roles={["admin"]}><Reports /></ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute roles={["admin"]}><UserManagement /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}