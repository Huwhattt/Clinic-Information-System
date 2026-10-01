// Mock data for standalone frontend demo.
// Replace the functions in src/api/* with real HTTP calls once the backend is ready —
// the page components already call through that layer, not this file directly.

export const CLINIC_NAME = "Wellpoint Family Clinic";

export let users = [
  { id: "u1", name: "Marilou Jamis", email: "admin@wellpoint.clinic", role: "admin", status: "active" },
  { id: "u2", name: "Emilyn Donor", email: "staff@wellpoint.clinic", role: "staff", status: "active" },
  { id: "u3", name: "Dr. Mark Anthony Gipit", email: "dr.gipit@wellpoint.clinic", role: "doctor", status: "active" },
  { id: "u4", name: "Dr. Androi Pamisaran", email: "dr.pamisaran@wellpoint.clinic", role: "doctor", status: "active" },
  { id: "u5", name: "Liza Fernandez", email: "liza.fernandez@mail.com", role: "patient", status: "active" },
  { id: "u6", name: "Jomar Santos", email: "jomar.santos@mail.com", role: "patient", status: "active" },
];

export let doctors = [
  { id: "d1", userId: "u3", name: "Dr. Mark Anthony Gipit", specialization: "Internal Medicine", schedule: "Mon–Fri, 8:00 AM–12:00 PM", contact: "0917-100-2001", patientsSeen: 128 },
  { id: "d2", userId: "u4", name: "Dr. Androi Pamisaran", specialization: "Pediatrics", schedule: "Mon–Fri, 1:00 PM–5:00 PM", contact: "0917-100-2002", patientsSeen: 96 },
  { id: "d3", userId: null, name: "Dr. Cecilia Ramos", specialization: "OB-GYN", schedule: "Tue/Thu, 9:00 AM–3:00 PM", contact: "0917-100-2003", patientsSeen: 74 },
  { id: "d4", userId: null, name: "Dr. Felix Uy", specialization: "Cardiology", schedule: "Wed/Fri, 10:00 AM–4:00 PM", contact: "0917-100-2004", patientsSeen: 51 },
];

export let patients = [
  { id: "p1", userId: "u5", name: "Liza Fernandez", age: 29, gender: "Female", contact: "0917-555-1001", address: "Brgy. San Isidro, Parañaque City", bloodType: "O+", allergies: "Penicillin", registeredOn: "2025-11-02" },
  { id: "p2", userId: "u6", name: "Jomar Santos", age: 34, gender: "Male", contact: "0917-555-1002", address: "Brgy. Marcelo Green, Parañaque City", bloodType: "A+", allergies: "None", registeredOn: "2025-12-14" },
  { id: "p3", userId: null, name: "Andrea Villaflor", age: 8, gender: "Female", contact: "0917-555-1003", address: "Brgy. Baclaran, Parañaque City", bloodType: "B+", allergies: "Seafood", registeredOn: "2026-01-20" },
  { id: "p4", userId: null, name: "Ricardo Malig", age: 61, gender: "Male", contact: "0917-555-1004", address: "Brgy. Sto. Niño, Parañaque City", bloodType: "AB+", allergies: "None", registeredOn: "2026-02-03" },
  { id: "p5", userId: null, name: "Grace Ong", age: 45, gender: "Female", contact: "0917-555-1005", address: "Brgy. Tambo, Parañaque City", bloodType: "O-", allergies: "Latex", registeredOn: "2026-03-18" },
  { id: "p6", userId: null, name: "Noel Cabrera", age: 52, gender: "Male", contact: "0917-555-1006", address: "Brgy. La Huerta, Parañaque City", bloodType: "A-", allergies: "Aspirin", registeredOn: "2026-04-27" },
];

export let appointments = [
  { id: "a1", patientId: "p1", patientName: "Liza Fernandez", doctorId: "d1", doctorName: "Dr. Mark Anthony Gipit", date: "2026-09-29", time: "09:00 AM", reason: "Annual check-up", status: "Confirmed" },
  { id: "a2", patientId: "p2", patientName: "Jomar Santos", doctorId: "d4", doctorName: "Dr. Felix Uy", date: "2026-09-29", time: "10:30 AM", reason: "Follow-up: hypertension", status: "Confirmed" },
  { id: "a3", patientId: "p3", patientName: "Andrea Villaflor", doctorId: "d2", doctorName: "Dr. Androi Pamisaran", date: "2026-09-30", time: "02:00 PM", reason: "Fever and cough", status: "Pending" },
  { id: "a4", patientId: "p4", patientName: "Ricardo Malig", doctorId: "d1", doctorName: "Dr. Mark Anthony Gipit", date: "2026-10-01", time: "08:30 AM", reason: "Diabetes monitoring", status: "Pending" },
  { id: "a5", patientId: "p5", patientName: "Grace Ong", doctorId: "d3", doctorName: "Dr. Cecilia Ramos", date: "2026-09-25", time: "11:00 AM", reason: "Prenatal check-up", status: "Completed" },
  { id: "a6", patientId: "p6", patientName: "Noel Cabrera", doctorId: "d4", doctorName: "Dr. Felix Uy", date: "2026-09-22", time: "03:00 PM", reason: "Chest pain evaluation", status: "Completed" },
  { id: "a7", patientId: "p1", patientName: "Liza Fernandez", doctorId: "d1", doctorName: "Dr. Mark Anthony Gipit", date: "2026-09-18", time: "09:30 AM", reason: "Blood work review", status: "Cancelled" },
];

export let medicalRecords = [
  { id: "m1", patientId: "p5", patientName: "Grace Ong", doctorName: "Dr. Cecilia Ramos", date: "2026-09-25", diagnosis: "Normal prenatal progress, 28 weeks", notes: "Advise iron supplementation and follow-up ultrasound in 3 weeks." },
  { id: "m2", patientId: "p6", patientName: "Noel Cabrera", doctorName: "Dr. Felix Uy", date: "2026-09-22", diagnosis: "Stable angina, ruled out acute MI", notes: "Continue current medication, refer for stress test." },
  { id: "m3", patientId: "p1", patientName: "Liza Fernandez", doctorName: "Dr. Mark Anthony Gipit", date: "2026-09-18", diagnosis: "Mild anemia", notes: "Prescribed iron supplements, recheck CBC in one month." },
];

export let prescriptions = [
  { id: "rx1", patientId: "p5", patientName: "Grace Ong", doctorName: "Dr. Cecilia Ramos", date: "2026-09-25", medication: "Ferrous Sulfate 325mg", dosage: "1 tablet once daily", duration: "30 days", status: "Active" },
  { id: "rx2", patientId: "p6", patientName: "Noel Cabrera", doctorName: "Dr. Felix Uy", date: "2026-09-22", medication: "Isosorbide Mononitrate 30mg", dosage: "1 tablet every morning", duration: "60 days", status: "Active" },
  { id: "rx3", patientId: "p1", patientName: "Liza Fernandez", doctorName: "Dr. Mark Anthony Gipit", date: "2026-09-18", medication: "Ferrous Sulfate 325mg", dosage: "1 tablet twice daily", duration: "30 days", status: "Completed" },
];

export let billing = [
  { id: "b1", patientId: "p5", patientName: "Grace Ong", date: "2026-09-25", description: "Prenatal consultation + ultrasound", amount: 2500, status: "Paid" },
  { id: "b2", patientId: "p6", patientName: "Noel Cabrera", date: "2026-09-22", description: "Cardiology consultation + ECG", amount: 3200, status: "Paid" },
  { id: "b3", patientId: "p1", patientName: "Liza Fernandez", date: "2026-09-18", description: "General consultation + lab work", amount: 1800, status: "Unpaid" },
  { id: "b4", patientId: "p2", patientName: "Jomar Santos", date: "2026-09-29", description: "Follow-up consultation", amount: 800, status: "Pending" },
  { id: "b5", patientId: "p4", patientName: "Ricardo Malig", date: "2026-09-10", description: "Diabetes panel + consultation", amount: 2100, status: "Unpaid" },
];

export const monthlyVisits = [
  { month: "Apr", visits: 42 },
  { month: "May", visits: 55 },
  { month: "Jun", visits: 48 },
  { month: "Jul", visits: 61 },
  { month: "Aug", visits: 58 },
  { month: "Sep", visits: 67 },
];

export const revenueByMonth = [
  { month: "Apr", revenue: 68000 },
  { month: "May", revenue: 81500 },
  { month: "Jun", revenue: 74200 },
  { month: "Jul", revenue: 92300 },
  { month: "Aug", revenue: 87100 },
  { month: "Sep", revenue: 99800 },
];