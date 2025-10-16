"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyJobs } from "@/lib/api";
import { useRouter } from "next/navigation";


function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

interface JobRequirements {
  skills: string[];
  education: string;
  experience: string;
}

interface JobMeta {
  location: string;
  level: string;
  department: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  salary?: number;
  duration: string;
  contractType: string;
  requirements: JobRequirements;
  meta: JobMeta;
  createdAt: string;
  updatedAt: string;
  status: string;
  employerId: string;
  isHeadhunted: boolean;
}

export default function MyJobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Redirect if not authenticated
    if (!user) {
      router.push("/login");
      return;
    }

    // Redirect if authenticated but not an employer
    if (user.role !== "EMPLOYER") {
      router.push("/jobs"); // Send employees to public job board
      return;
    }

    // Fetch employer's own jobs using the secure /jobs/my endpoint
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError("");
        const jobsData = await getMyJobs();
        setJobs(jobsData);
      } catch (err) {
        setError(getErrorMessage(err) || "Failed to load your jobs");
        console.error("Error fetching employer jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [user, router]);

  // Format contract type for display
  const formatContractType = (type: string) => {
    return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
            <p className="font-semibold">Unable to load your jobs</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Posted Jobs</h1>
        <p className="text-muted-foreground">Manage and track your job postings</p>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-muted rounded-lg p-8 max-w-md mx-auto">
            <svg
              className="w-16 h-16 text-muted-foreground mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2zm-8 0V8a2 2 0 00-2 2H4a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-foreground mb-2">No jobs posted yet</h2>
            <p className="text-muted-foreground mb-6">
              Start by creating your first job posting to find great candidates.
            </p>
            <button
              onClick={() => router.push("/jobs/create")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-lg transition-colors font-medium cursor-pointer"
            >
              Post Your First Job
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <p className="text-muted-foreground">
              {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted
            </p>
            <button
              onClick={() => router.push("/jobs/create")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Post New Job</span>
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-background border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h2 className="font-semibold text-lg text-foreground line-clamp-2 flex-1">
                      {job.title}
                    </h2>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      job.status === 'OPEN' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {job.description.length > 120
                      ? job.description.slice(0, 120) + "..."
                      : job.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.meta?.location || "Location not specified"}
                  </div>

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2zm-8 0V8a2 2 0 00-2 2H4a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2z" />
                    </svg>
                    {formatContractType(job.contractType)} • {job.duration}
                  </div>

                  {job.salary && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      KSH{job.salary.toLocaleString()}
                    </div>
                  )}

                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
                    </svg>
                    {job.meta?.level || "Level not specified"}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Posted: {formatDate(job.createdAt)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/jobs/${job.id}`)}
                    className="flex-1 bg-primary text-primary-foreground text-sm py-2 px-3 rounded-lg hover:bg-primary/90 transition-colors font-medium cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => router.push(`/jobs/${job.id}/edit`)}
                    className="flex-1 bg-muted text-foreground text-sm py-2 px-3 rounded-lg hover:bg-muted/80 transition-colors font-medium cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}