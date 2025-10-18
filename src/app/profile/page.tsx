"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/lib/api";

// Define a clear type for the user profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber: string | null;
  createdAt: string; // ISO string from backend
}

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false); // prevents the refresh loop

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user, router]);

  // Fetch profile once after user becomes available
  useEffect(() => {
    if (!user || fetchedRef.current) return;
    fetchedRef.current = true;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        // Seed UI with cached local user data (if any)
        const initialProfile: UserProfile = {
          id: user.id,
          name: user.name ??"Anonymous",
          email: user.email,
          role: user.role,
          phoneNumber: user.phoneNumber ?? null,
          createdAt: user.createdAt ?? "",
        };
        setProfile(initialProfile);

        // Fetch fresh server profile via context helper
        const updated = await refreshUser();
        if (updated) {
          setProfile(updated as UserProfile);
        }
      } catch (fetchError: unknown) {
        // Fallback: direct API call
        try {
          const response = await api.getProfile();
          setProfile(response.user || null);
        } catch (apiError: unknown) {
          if (apiError instanceof Error) {
            setError(apiError.message || "Failed to load profile");
          } else {
            setError("Failed to load profile");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const updated = await refreshUser();
      if (updated) {
        setProfile(updated as UserProfile);
      }
    } catch (refreshError: unknown) {
      if (refreshError instanceof Error) {
        setError(refreshError.message || "Failed to refresh profile");
      } else {
        setError("Failed to refresh profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const ok = confirm(
      "Are you sure you want to permanently delete your account? This cannot be undone."
    );
    if (!ok) return;

    setLoading(true);
    setError(null);
    try {
      await api.deleteProfile();
      await logout(); // clears client state and redirects
    } catch (deleteError: unknown) {
      if (deleteError instanceof Error) {
        setError(deleteError.message || "Failed to delete account");
      } else {
        setError("Failed to delete account");
      }
      setLoading(false);
    }
  };

  if (!user) return null; // redirecting

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-md p-5 sm:p-8 border border-gray-100 dark:border-[#334155]">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-semibold mb-1"
              style={{ color: "var(--color-foreground)" }}
            >
              Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your account details and settings.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="px-3 py-2 rounded-md text-sm font-medium border border-transparent hover:shadow-md transition cursor-pointer"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-gradient-subtle flex items-center justify-center text-xl font-semibold text-muted-foreground">
              {profile?.name
                ? profile.name
                    .split(" ")
                    .map((s: string) => s[0])
                    .slice(0, 2)
                    .join("")
                : profile?.email?.[0]?.toUpperCase() || "U"}
            </div>
          </div>

          <div className="sm:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-gray-100 dark:border-[#334155]">
                <h3 className="text-xs text-muted-foreground uppercase font-medium">Full name</h3>
                <p className="mt-1 text-base font-semibold">{profile?.name || "—"}</p>
              </div>

              <div className="p-4 rounded-lg border border-gray-100 dark:border-[#334155]">
                <h3 className="text-xs text-muted-foreground uppercase font-medium">Email</h3>
                <p className="mt-1 text-base font-semibold">{profile?.email || "—"}</p>
              </div>

              <div className="p-4 rounded-lg border border-gray-100 dark:border-[#334155]">
                <h3 className="text-xs text-muted-foreground uppercase font-medium">Phone</h3>
                <p className="mt-1 text-base font-semibold">{profile?.phoneNumber || "—"}</p>
              </div>

              <div className="p-4 rounded-lg border border-gray-100 dark:border-[#334155]">
                <h3 className="text-xs text-muted-foreground uppercase font-medium">Role</h3>
                <p className="mt-1 text-base font-semibold">{profile?.role || "—"}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                <div>Member since:</div>
                <div className="font-medium">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="px-3 py-2 rounded-md text-sm font-medium border border-red-300 text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  Delete account
                </button>
              </div>
            </div>

            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}
          </div>
        </section>
      </div>
    </main>
  );
}