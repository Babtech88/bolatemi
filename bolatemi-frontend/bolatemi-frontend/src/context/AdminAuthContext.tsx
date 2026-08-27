import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "SALES";
}

interface AdminAuthValue {
  admin: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("bgs_admin_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get<{ success: boolean; data: AdminUser }>("/auth/me", true)
      .then((res) => setAdmin(res.data))
      .catch(() => localStorage.removeItem("bgs_admin_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const res = await api.post<{ success: boolean; data: { admin: AdminUser; token: string } }>("/auth/login", { email, password });
    localStorage.setItem("bgs_admin_token", res.data.token);
    setAdmin(res.data.admin);
  }

  function logout() {
    localStorage.removeItem("bgs_admin_token");
    setAdmin(null);
  }

  return <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
