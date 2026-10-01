import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, patientsApi } from "../api/mockApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "wellpoint_session";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      if (parsed.role === "patient") {
        patientsApi.getByUserId(parsed.id).then(setPatientProfile);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const loggedInUser = await authApi.login(email, password);
    setUser(loggedInUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
    if (loggedInUser.role === "patient") {
      const profile = await patientsApi.getByUserId(loggedInUser.id);
      setPatientProfile(profile);
    }
    return loggedInUser;
  };

  const register = async (formData) => {
    const newUser = await authApi.registerPatient(formData);
    setUser(newUser);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    const profile = await patientsApi.getByUserId(newUser.id);
    setPatientProfile(profile);
    return newUser;
  };

  const logout = () => {
    setUser(null);
    setPatientProfile(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, patientProfile, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}