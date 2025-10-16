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
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void; // set user directly (used by login page)
  loginWithCredentials: (email: string, password: string) => Promise<void>; // convenience: calls API then login()
  logout: () => Promise<void>;
  refreshUser: () => Promise<User>; // refresh profile from server
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // load user from localStorage on mount
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

  // keep user in localStorage (single source of truth)
  const persistUser = useCallback((u: User | null) => {
    if (typeof window === "undefined") return;
    if (u) {
      localStorage.setItem("user", JSON.stringify(u));
    } else {
      localStorage.removeItem("user");
    }
  }, []);

  // basic login by providing the final user object (id,email,role,name,token)
  const login = (userData: User) => {
    setUser(userData);
    persistUser(userData);

    // redirect based on role
    if (userData.role === "EMPLOYER") {
      router.push("/jobs/my");
    } else {
      router.push("/jobs");
    }
  };

  // convenience: call backend login endpoint, then call login()
  const loginWithCredentials = async (email: string, password: string) => {
    try {
      const data = await api.login({ email, password }); // expects { token, user }
      const loggedInUser: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        token: data.token,
      };
      login(loggedInUser);
    } catch (err) {
      // rethrow so callers can show messages
      throw err;
    }
  };

  // logout: call backend (optional) then clear client state
  const logout = async () => {
    try {
      // attempt server logout (your server just replies 200)
      await api.logout().catch(() => {
        /* swallow network errors, we'll still clear client state */
      });
    } catch (err) {
      // ignore — we still clear client session
      console.error("Error during logout", err);
    } finally {
      setUser(null);
      persistUser(null);
      router.push("/");
    }
  };

  // refresh user profile from server (protected route)
  const refreshUser = async () => {
    if (!user) throw new Error("No logged in user");
    try {
      const body = await api.getProfile(); // expects { user: {...} }
      const updated = {
        id: body.user.id,
        email: body.user.email,
        name: body.user.name,
        role: body.user.role,
        token: user.token, // keep existing token
      } as User;
      setUser(updated);
      persistUser(updated);
      return updated;
    } catch (err) {
      // if token invalid / expired, optionally logout
      // console.error("Failed to refresh profile", err);
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
