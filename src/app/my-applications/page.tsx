"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getMyApplications } from "@/lib/api";

interface JobApplication {
  id: string;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  resumeUrl: string;
  coverLetter: string;
  extras: Record<string, unknown>; // Replaced `any` with `unknown`
  job: {
    id: string;
    title: string;
    status: "OPEN" | "CLOSED" | "DRAFT";
    postedAt: string;
    employer: {
      id: string;
      name: string;
    };
  };
}

interface ApplicationsResponse {
  count: number;
  applications: JobApplication[];
}

export default function MyApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const data: ApplicationsResponse = await getMyApplications();
      setApplications(data.applications || []);
    } catch (err) {
      // Proper error typing: `err` is `unknown`
      if (err instanceof Error) {
        setError(err.message || "Failed to load your applications");
      } else {
        setError("Failed to load your applications");
      }
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "PENDING":
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground text-sm sm:text-base">Loading your applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">My Job Applications</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track the status of all your job applications in one place.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold text-sm sm:text-base">Error Loading Applications</p>
          </div>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchApplications}
            className="mt-3 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Applications List */}
      {applications.length === 0 && !loading && !error ? (
        <div className="bg-background border border-border rounded-lg p-6 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No Applications Yet</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            You haven&apos;t applied to any jobs yet. Start browsing available positions to apply.
          </p>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{applications.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {applications.filter((app) => app.status === "PENDING").length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Pending</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {applications.filter((app) => app.status === "REVIEWED").length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Reviewed</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {applications.filter((app) => app.status === "ACCEPTED").length}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Accepted</div>
            </div>
          </div>

          {/* Applications List */}
          {applications.map((application) => (
            <div
              key={application.id}
              className="bg-background border border-border rounded-lg p-4 sm:p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                      {application.job.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{application.job.employer.name}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Applied on {formatDate(application.appliedAt)}</span>
                    </div>

                    {application.coverLetter && (
                      <div className="mt-3">
                        <p className="text-xs sm:text-sm font-medium text-foreground mb-1">Cover Letter:</p>
                        <p className="text-xs sm:text-sm text-muted-foreground bg-muted/30 p-2.5 sm:p-3 rounded-lg line-clamp-2">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 w-full lg:w-auto lg:items-end">
                  <Link
                    href={`/jobs/${application.job.id}`}
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition-colors w-full lg:w-auto"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>View Job</span>
                  </Link>

                  {application.resumeUrl && (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center sm:justify-start gap-1.5 bg-muted text-foreground hover:bg-muted/80 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition-colors w-full lg:w-auto"
                    >
                      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>View Resume</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}