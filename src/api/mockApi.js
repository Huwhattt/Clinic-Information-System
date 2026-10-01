// In-memory "API" that stands in for the backend during frontend-only development.
// Every function returns a Promise, matching what an axios call will return later,
// so swapping this file's contents for real HTTP requests won't touch any page code.

import {
  users,
  doctors,
  patients,
  appointments,
  medicalRecords,
  prescriptions,
  billing,
  monthlyVisits,
  revenueByMonth,
} from "../data/mockData";

const LATENCY = 250;
const delay = (value) => new Promise((resolve) => setTimeout(() => resolve(value), LATENCY));
const clone = (value) => JSON.parse(JSON.stringify(value));
const nextId = (prefix, list) => `${prefix}${Date.now()}${Math.floor(Math.random() * 100)}`;

// ---------- Auth ----------
export const authApi = {
  login: async (email, password) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user || password.length < 1) {
      await delay();
      throw new Error("Invalid email or password.");
    }
    if (user.status === "inactive") {
      await delay();
      throw new Error("This account has been deactivated. Contact the clinic admin.");
    }
    return delay(clone(user));
  },
  registerPatient: async ({ name, email, password, age, gender, contact, address }) => {
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      await delay();
      throw new Error("An account with that email already exists.");
    }
    const userId = nextId("u");
    users.push({ id: userId, name, email, role: "patient", status: "active" });
    const patientId = nextId("p");
    patients.push({
      id: patientId,
      userId,
      name,
      age: Number(age) || 0,
      gender,
      contact,
      address,
      bloodType: "Unknown",
      allergies: "None recorded",
      registeredOn: new Date().toISOString().slice(0, 10),
    });
    return delay(clone(users.find((u) => u.id === userId)));
  },
};

// ---------- Generic list helpers ----------
function makeResource(list) {
  return {
    getAll: async () => delay(clone(list)),
    getById: async (id) => delay(clone(list.find((item) => item.id === id)) || null),
    remove: async (id) => {
      const idx = list.findIndex((item) => item.id === id);
      if (idx !== -1) list.splice(idx, 1);
      return delay({ success: true });
    },
  };
}

// ---------- Users ----------
export const usersApi = {
  ...makeResource(users),
  create: async (data) => {
    const record = { id: nextId("u"), status: "active", ...data };
    users.push(record);
    return delay(clone(record));
  },
  update: async (id, data) => {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("User not found.");
    users[idx] = { ...users[idx], ...data };
    return delay(clone(users[idx]));
  },
};

// ---------- Doctors ----------
export const doctorsApi = {
  ...makeResource(doctors),
  create: async (data) => {
    const record = { id: nextId("d"), patientsSeen: 0, ...data };
    doctors.push(record);
    return delay(clone(record));
  },
  update: async (id, data) => {
    const idx = doctors.findIndex((d) => d.id === id);
    if (idx === -1) throw new Error("Doctor not found.");
    doctors[idx] = { ...doctors[idx], ...data };
    return delay(clone(doctors[idx]));
  },
};

// ---------- Patients ----------
export const patientsApi = {
  ...makeResource(patients),
  create: async (data) => {
    const record = { id: nextId("p"), registeredOn: new Date().toISOString().slice(0, 10), ...data };
    patients.push(record);
    return delay(clone(record));
  },
  update: async (id, data) => {
    const idx = patients.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Patient not found.");
    patients[idx] = { ...patients[idx], ...data };
    return delay(clone(patients[idx]));
  },
  getByUserId: async (userId) => delay(clone(patients.find((p) => p.userId === userId)) || null),
};

// ---------- Appointments ----------
export const appointmentsApi = {
  ...makeResource(appointments),
  create: async (data) => {
    const record = { id: nextId("a"), status: "Pending", ...data };
    appointments.push(record);
    return delay(clone(record));
  },
  update: async (id, data) => {
    const idx = appointments.findIndex((a) => a.id === id);
    if (idx === -1) throw new Error("Appointment not found.");
    appointments[idx] = { ...appointments[idx], ...data };
    return delay(clone(appointments[idx]));
  },
  getByPatientId: async (patientId) => delay(clone(appointments.filter((a) => a.patientId === patientId))),
};

// ---------- Medical Records ----------
export const medicalRecordsApi = {
  ...makeResource(medicalRecords),
  create: async (data) => {
    const record = { id: nextId("m"), date: new Date().toISOString().slice(0, 10), ...data };
    medicalRecords.push(record);
    return delay(clone(record));
  },
  getByPatientId: async (patientId) => delay(clone(medicalRecords.filter((m) => m.patientId === patientId))),
};

// ---------- Prescriptions ----------
export const prescriptionsApi = {
  ...makeResource(prescriptions),
  create: async (data) => {
    const record = { id: nextId("rx"), date: new Date().toISOString().slice(0, 10), status: "Active", ...data };
    prescriptions.push(record);
    return delay(clone(record));
  },
  update: async (id, data) => {
    const idx = prescriptions.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error("Prescription not found.");
    prescriptions[idx] = { ...prescriptions[idx], ...data };
    return delay(clone(prescriptions[idx]));
  },
  getByPatientId: async (patientId) => delay(clone(prescriptions.filter((p) => p.patientId === patientId))),
};

// ---------- Billing ----------
export const billingApi = {
  ...makeResource(billing),
  create: async (data) => {
    const record = { id: nextId("b"), date: new Date().toISOString().slice(0, 10), status: "Unpaid", ...data };
    billing.push(record);
    return delay(clone(record));
  },
  update: async (id, data) => {
    const idx = billing.findIndex((b) => b.id === id);
    if (idx === -1) throw new Error("Billing record not found.");
    billing[idx] = { ...billing[idx], ...data };
    return delay(clone(billing[idx]));
  },
  getByPatientId: async (patientId) => delay(clone(billing.filter((b) => b.patientId === patientId))),
};

// ---------- Reports ----------
export const reportsApi = {
  getSummary: async () => {
    const totalRevenue = billing.filter((b) => b.status === "Paid").reduce((sum, b) => sum + b.amount, 0);
    const outstanding = billing.filter((b) => b.status !== "Paid").reduce((sum, b) => sum + b.amount, 0);
    return delay({
      totalPatients: patients.length,
      totalDoctors: doctors.length,
      appointmentsToday: appointments.filter((a) => a.date === new Date().toISOString().slice(0, 10)).length,
      pendingAppointments: appointments.filter((a) => a.status === "Pending").length,
      totalRevenue,
      outstanding,
      monthlyVisits: clone(monthlyVisits),
      revenueByMonth: clone(revenueByMonth),
    });
  },
};