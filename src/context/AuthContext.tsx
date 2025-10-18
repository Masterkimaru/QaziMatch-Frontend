"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api"; // expects login, logout, getProfile exported from lib/api.ts

type User = {
  id: string;
  email: string;
  role: "EMPLOYEE" | "EMPLOYER";
  name?: string;
  token: string;
  phoneNumber?: string;
  createdAt?: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        setUser(JSON.parse(raw));
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
      localStorage.removeItem("user");
    }
  }, []);

  const persistUser = useCallback((u: User | null) => {
    if (typeof window === "undefined") return;
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    persistUser(userData);
    if (userData.role === "EMPLOYER") {
      router.push("/jobs/my");
    } else {
      router.push("/jobs");
    }
  };

  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const data = await api.login({ email, password }); // expects { token, user }
      const loggedInUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        token: data.token,
        phoneNumber: data.user.phoneNumber,     // <--- include phone
        createdAt: data.user.createdAt,         // <--- include createdAt
      };
      login(loggedInUser);
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.logout().catch(() => {});
    } catch (err) {
      console.error("Error during logout", err);
    } finally {
      setUser(null);
      persistUser(null);
      router.push("/");
    }
  };

  const refreshUser = async () => {
    if (!user) throw new Error("No logged in user");
    try {
      const body = await api.getProfile(); // { user: {...} }
      const updated: User = {
        id: body.user.id,
        email: body.user.email,
        name: body.user.name,
        role: body.user.role,
        phoneNumber: body.user.phoneNumber,   // <--- copy phoneNumber
        createdAt: body.user.createdAt,       // <--- copy createdAt
        token: user.token, // keep existing token
      };
      setUser(updated);
      persistUser(updated);
      return updated;
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithCredentials, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};