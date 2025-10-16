"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getJobById, getApplicationsForJob } from "@/lib/api";

interface JobRequirements {
  skills: string[] | string;
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

interface Application {
  id: string;
  applicantId: string;
  jobId: string;
  resumeUrl: string;
  appliedAt: string;
  status: string;
  coverLetter?: string;
  extras?: Record<string, unknown>;
  isHeadhunted?: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export default function JobViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [applicationsError, setApplicationsError] = useState<string>("");
  const [showApplications, setShowApplications] = useState(false);

  const jobId = params.id as string;

  useEffect(() => {
    if (!jobId) return;

    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");
        const jobData = await getJobById(jobId);
        setJob(jobData);
      } catch (err) {
        // err is 'unknown' — safely handle it
        if (err instanceof Error) {
          setError(err.message || "Failed to load job");
        } else {
          setError("Failed to load job");
        }
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  const loadApplications = async () => {
    if (!job || !user || user.role !== "EMPLOYER") return;
    
    try {
      setApplicationsLoading(true);
      setApplicationsError("");
      const applicationsData = await getApplicationsForJob(jobId);
      
      // Ensure applicationsData is an array
      if (Array.isArray(applicationsData)) {
        setApplications(applicationsData);
        setShowApplications(true);
      } else {
        throw new Error("Invalid applications data format");
      }
    } catch (err) {
      if (err instanceof Error) {
        setApplicationsError(err.message || "Failed to load applications");
      } else {
        setApplicationsError("Failed to load applications");
      }
      console.error("Error fetching applications:", err);
    } finally {
      setApplicationsLoading(false);
    }
  };

  // Helper function to ensure skills is always an array
  const getSkillsArray = (skills: string[] | string | undefined): string[] => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string") {
      return skills
        .split(/[,|\n]/)
        .map(s => s.trim())
        .filter(Boolean);
    }
    return [];
  };

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

  // Get applicant display name
  const getApplicantName = (application: Application) => {
    return application.user?.name || "Applicant";
  };

  // Get applicant email
  const getApplicantEmail = (application: Application) => {
    return application.user?.email || "Email not available";
  };

  // Check if current user is the job owner
  const isJobOwner = user && job && user.id === job.employerId;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <p className="font-semibold text-sm sm:text-base">Job not found</p>
            <p className="text-xs sm:text-sm mt-1">{error || "The job you're looking for doesn't exist or has been removed."}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get skills array safely
  const skillsArray = getSkillsArray(job.requirements.skills);

  return (
    <div className="container mx-auto px-3 xs:px-4 sm:px-6 py-4 sm:py-6 md:py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-foreground mb-3 sm:mb-4 transition-colors cursor-pointer text-sm sm:text-base"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground flex-1 pr-2">
                {job.title}
              </h1>
              <span className={`px-2 py-1 text-xs sm:text-sm rounded-full ${
                job.status === 'OPEN' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {job.status}
              </span>
            </div>

            {/* Job Meta Information - Optimized for Mobile */}
            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              {/* First Row - Location and Contract Type */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate max-w-[100px] xs:max-w-[120px]">{job.meta?.location || "Location not specified"}</span>
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 002 2h2a2 2 0 002-2V8a2 2 0 00-2-2h-2zm-8 0V8a2 2 0 00-2 2H4a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2z" />
                </svg>
                <span className="truncate max-w-[80px] xs:max-w-[100px]">{formatContractType(job.contractType)}</span>
              </div>

              {/* Second Row - Duration and Salary */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="truncate max-w-[80px] xs:max-w-[100px]">{job.duration}</span>
              </div>

              {job.salary && (
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="truncate max-w-[100px] xs:max-w-[120px]">KSH {job.salary.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
            {isJobOwner ? (
              <>
                <button
                  onClick={loadApplications}
                  disabled={applicationsLoading}
                  className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  {applicationsLoading ? (
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                  ) : (
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  <span className="whitespace-nowrap">View Applications</span>
                </button>
                <button
                  onClick={() => router.push(`/jobs/${job.id}/edit`)}
                  className="bg-muted text-foreground hover:bg-muted/80 px-3 sm:px-4 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="whitespace-nowrap">Edit Job</span>
                </button>
              </>
            ) : user?.role === "EMPLOYEE" ? (
              <button
                onClick={() => router.push(`/jobs/${job.id}/apply`)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 sm:px-6 py-2 rounded-lg transition-colors font-medium flex items-center justify-center gap-1 sm:gap-2 cursor-pointer text-xs sm:text-sm md:text-base"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="whitespace-nowrap">Apply Now</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
          {/* Job Description */}
          <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Job Description</h2>
            <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
              {job.description}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-3 sm:mb-4">Requirements</h2>
              
              {skillsArray.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Skills Required</h3>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {skillsArray.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {job.requirements.education && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-medium text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Education</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">{job.requirements.education}</p>
                </div>
              )}

              {job.requirements.experience && (
                <div>
                  <h3 className="font-medium text-foreground mb-1 sm:mb-2 text-sm sm:text-base">Experience</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">{job.requirements.experience}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Job Overview */}
          <div className="bg-background border border-border rounded-lg p-4 sm:p-6">
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4 text-base sm:text-lg">Job Overview</h3>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Department</div>
                <div className="font-medium text-sm sm:text-base">{job.meta?.department || "Not specified"}</div>
              </div>
              
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Experience Level</div>
                <div className="font-medium text-sm sm:text-base">{job.meta?.level || "Not specified"}</div>
              </div>
              
              <div>
                <div className="text-xs sm:text-sm text-muted-foreground mb-1">Posted Date</div>
                <div className="font-medium text-sm sm:text-base">{formatDate(job.createdAt)}</div>
              </div>
              
              {job.updatedAt !== job.createdAt && (
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">Last Updated</div>
                  <div className="font-medium text-sm sm:text-base">{formatDate(job.updatedAt)}</div>
                </div>
              )}

              {job.isHeadhunted && (
                <div>
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-blue-600">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Headhunted Position
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Applications Section */}
      {showApplications && (
        <div className="mt-6 sm:mt-8 bg-background border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">
            Applications ({applications.length})
          </h2>
          
          {applicationsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
              <p className="font-semibold text-sm sm:text-base">Error loading applications</p>
              <p className="text-xs sm:text-sm mt-1">{applicationsError}</p>
            </div>
          )}
          
          {applications.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <div className="text-muted-foreground text-sm sm:text-base">No applications received yet.</div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors gap-2 sm:gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground text-sm sm:text-base truncate">
                      {getApplicantName(application)}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground truncate">
                      {getApplicantEmail(application)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Applied: {formatDate(application.appliedAt)}
                    </div>
                    {application.coverLetter && (
                      <div className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3 mt-2 sm:mt-0">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      application.status === 'PENDING' 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : application.status === 'ACCEPTED'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {application.status}
                    </span>
                    
                    {application.resumeUrl && (
                      <button
                        onClick={() => {
                          const url = application.resumeUrl.startsWith('http') 
                            ? application.resumeUrl 
                            : `${process.env.NEXT_PUBLIC_API_URL || ''}${application.resumeUrl}`;
                          window.open(url, '_blank');
                        }}
                        className="text-primary hover:text-primary/80 text-xs sm:text-sm font-medium whitespace-nowrap"
                      >
                        View Resume
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}