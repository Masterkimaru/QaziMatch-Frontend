"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getOpenJobsWithApplications, selectApplicant, rejectApplicant, reviewApplicant } from "@/lib/api";
import toast from 'react-hot-toast';
import Link from 'next/link'; // Import Link

interface Applicant {
  id: string;
  name: string;
  email: string;
}

interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  resumeUrl: string;
  coverLetter: string;
  extras: Record<string, unknown>;
  status: "PENDING" | "REVIEWED" | "ACCEPTED" | "REJECTED";
  appliedAt: string;
  updatedAt: string;
  isHeadhunted: boolean;
  applicant: Applicant;
}

interface JobWithApplications {
  id: string;
  title: string;
  status: "OPEN" | "CLOSED" | "FILLED";
  createdAt: string;
  applicationsCount: number;
  applications: Application[];
}

//  Helper to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export default function EmployerApplicationsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [processingApplicationId, setProcessingApplicationId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role === "EMPLOYER") {
      fetchJobsWithApplications();
    }
    // Removed unnecessary eslint-disable — deps are correct
  }, [user]);

  const fetchJobsWithApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOpenJobsWithApplications();
      const allJobs: JobWithApplications[] = Array.isArray(data) ? data : data?.jobs || [];
      const jobsWithApplicants = allJobs.filter(
        (job) => Array.isArray(job.applications) && job.applications.length > 0
      );

      setJobs(jobsWithApplicants);
    } catch (err) {
      console.error("Failed to fetch jobs with applications:", err);
      setError(getErrorMessage(err) || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptApplicant = async (jobId: string, applicationId: string) => {
    if (processingApplicationId) return;

    try {
      setProcessingApplicationId(applicationId);
      await selectApplicant(jobId, applicationId);
      
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.id === jobId) {
            return {
              ...job,
              status: "FILLED",
              applications: job.applications.map(app => ({
                ...app,
                status: app.id === applicationId ? "ACCEPTED" : "REJECTED"
              }))
            };
          }
          return job;
        })
      );
      toast.success("Applicant accepted successfully!");
    } catch (err) {
      console.error("Failed to accept applicant:", err);
      toast.error(getErrorMessage(err) || "Failed to accept applicant. Please try again.");
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const handleRejectApplicant = async (jobId: string, applicationId: string) => {
    if (processingApplicationId) return;

    try {
      setProcessingApplicationId(applicationId);
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.id === jobId) {
            return {
              ...job,
              applications: job.applications.map(app => 
                app.id === applicationId 
                  ? { ...app, status: "REJECTED" as const }
                  : app
              )
            };
          }
          return job;
        })
      );

      await rejectApplicant(jobId, applicationId);
      toast.success("Applicant rejected successfully!");
    } catch (err) {
      console.error("Failed to reject applicant:", err);
      toast.error(getErrorMessage(err) || "Failed to reject applicant. Please try again.");
      fetchJobsWithApplications();
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const handleReviewApplicant = async (jobId: string, applicationId: string) => {
    if (processingApplicationId) return;

    try {
      setProcessingApplicationId(applicationId);
      setJobs(prevJobs => 
        prevJobs.map(job => {
          if (job.id === jobId) {
            return {
              ...job,
              applications: job.applications.map(app => 
                app.id === applicationId 
                  ? { ...app, status: "REVIEWED" as const }
                  : app
              )
            };
          }
          return job;
        })
      );

      await reviewApplicant(jobId, applicationId);
      toast.success("Applicant marked as reviewed successfully!");
    } catch (err) {
      console.error("Failed to mark applicant as reviewed:", err);
      toast.error(getErrorMessage(err) || "Failed to update applicant status. Please try again.");
      fetchJobsWithApplications();
    } finally {
      setProcessingApplicationId(null);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  if (user && user.role !== "EMPLOYER") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p>This page is only accessible to employers.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Job Applications</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Manage applications for your open job positions.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-semibold">Error Loading Applications</p>
          </div>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchJobsWithApplications}
            className="mt-3 bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {jobs.length === 0 && !loading && !error ? (
        <div className="bg-background border border-border rounded-lg p-6 sm:p-8 text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2">No Jobs with Applicants</h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            None of your job postings have received applications yet.
          </p>
          {/* Replaced <a> with <Link> */}
          <Link
            href="/jobs/my"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Manage Your Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">{jobs.length}</div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Open Jobs (with applicants)</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {jobs.reduce((total, job) => total + (job.applicationsCount || job.applications.length), 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Total Applications</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {jobs.reduce((total, job) => total + job.applications.filter(app => app.status === "PENDING").length, 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Pending Reviews</div>
            </div>
            <div className="bg-background border border-border rounded-lg p-3 sm:p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {jobs.reduce((total, job) => total + job.applications.filter(app => app.status === "ACCEPTED").length, 0)}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">Accepted</div>
            </div>
          </div>

          {/* Jobs with Applications */}
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-background border border-border rounded-lg overflow-hidden"
            >
              <div 
                className="p-4 sm:p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleJobExpansion(job.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground truncate">
                        {job.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'FILLED' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Posted {formatDate(job.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{job.applicationsCount} application{job.applicationsCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center ml-2">
                    <svg 
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-transform ${
                        expandedJob === job.id ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {expandedJob === job.id && (
                <div className="border-t border-border">
                  {job.applications.length === 0 ? (
                    <div className="p-4 sm:p-6 text-center text-muted-foreground text-sm">
                      No applications received for this job yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {job.applications.map((application) => (
                        <div key={application.id} className="p-4 sm:p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            {/* Applicant Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                <div className="min-w-0">
                                  <h4 className="text-base sm:text-lg font-semibold text-foreground truncate">
                                    {application.applicant.name}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                    {application.applicant.email}
                                  </p>
                                </div>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                                    application.status
                                  )}`}
                                >
                                  {application.status.charAt(0) + application.status.slice(1).toLowerCase()}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>Applied {formatDate(application.appliedAt)}</span>
                                </div>

                                {application.coverLetter && (
                                  <div>
                                    <p className="text-xs sm:text-sm font-medium text-foreground mb-1">Cover Letter:</p>
                                    <p className="text-xs sm:text-sm text-muted-foreground bg-muted/30 p-2.5 sm:p-3 rounded-lg">
                                      {application.coverLetter}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 w-full lg:w-auto lg:items-end">
                              {application.resumeUrl && (
                                <a
                                  href={application.resumeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 sm:px-4 sm:py-2 rounded text-xs sm:text-sm transition-colors w-full lg:w-auto"
                                >
                                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span>View Resume</span>
                                </a>
                              )}
                              
                              {job.status !== "FILLED" && (
                                <div className="flex flex-wrap gap-1.5 justify-center lg:justify-start">
                                  <button 
                                    onClick={() => handleAcceptApplicant(job.id, application.id)}
                                    disabled={processingApplicationId === application.id || application.status === "ACCEPTED"}
                                    className="flex-1 sm:flex-none min-w-[100px] inline-flex items-center justify-center gap-1.5 bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-2.5 py-1.5 rounded text-xs sm:text-sm transition-colors"
                                  >
                                    {processingApplicationId === application.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                      </>
                                    ) : (
                                      "Accept"
                                    )}
                                  </button>
                                  <button 
                                    onClick={() => handleRejectApplicant(job.id, application.id)}
                                    disabled={processingApplicationId === application.id || application.status === "REJECTED"}
                                    className="flex-1 sm:flex-none min-w-[100px] inline-flex items-center justify-center gap-1.5 bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-2.5 py-1.5 rounded text-xs sm:text-sm transition-colors"
                                  >
                                    {processingApplicationId === application.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                      </>
                                    ) : (
                                      "Reject"
                                    )}
                                  </button>
                                  <button 
                                    onClick={() => handleReviewApplicant(job.id, application.id)}
                                    disabled={processingApplicationId === application.id || application.status === "REVIEWED"}
                                    className="flex-1 sm:flex-none min-w-[100px] inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-2.5 py-1.5 rounded text-xs sm:text-sm transition-colors"
                                  >
                                    {processingApplicationId === application.id ? (
                                      <>
                                        <div className="animate-spin rounded-full h-2.5 w-2.5 border-b-2 border-white"></div>
                                        <span>Processing...</span>
                                      </>
                                    ) : (
                                      "Review"
                                    )}
                                  </button>
                                </div>
                              )}
                              
                              {job.status === "FILLED" && (
                                <div className="text-xs sm:text-sm text-muted-foreground italic text-center lg:text-left">
                                  Position has been filled
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}