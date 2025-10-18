const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

// Define types for structured job data
export interface JobRequirements {
  skills: string[];
  education: string;
  experience: string;
}

export interface JobMeta {
  location: string;
  level: string;
  department: string;
}

// Define type for otherContacts (assumed to be string key-value pairs)
export interface HeadhuntOtherContacts {
  [key: string]: string;
}

// Helper: get token from localStorage 'user' object (keeps parity with AuthContext)
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.token ?? null;
  } catch {
    return null;
  }
}

// Helper: create headers with Authorization when token exists
function createAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/* AUTH ROUTES (/api/auth) */

// Signup: returns { token, user }
export async function signup(userData: {
  name?: string;
  email: string;
  password: string;
  role: "EMPLOYEE" | "EMPLOYER";
  phoneNumber?: string;
}) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to signup");
  return body; // expect { token, user }
}

// Login: returns { token, user }
export async function login(credentials: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to login");
  return body; // expect { token, user }
}

// Logout: calls backend and returns response (client should also clear localStorage)
export async function logout() {
  const res = await fetch(`${API_BASE}/auth/logout`, {
    method: "POST",
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to logout");
  return body;
}

// Get profile: GET /auth/profile (protected)
export async function getProfile() {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: "GET",
    headers: createAuthHeaders(),
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fetch profile");
  return body; // expect { user: {...} }
}

// JOBS ROUTES (/api/jobs)

export async function fetchJobs() {
  const res = await fetch(`${API_BASE}/jobs`, {
    cache: "no-store",
    headers: createAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
}

// Accept structured requirements & meta, stringify before sending
export async function createJob(jobData: {
  title: string;
  description: string;
  salary?: number;
  duration?: string;
  contractType?: string;
  requirements?: JobRequirements;
  meta?: JobMeta;
}) {
  // Stringify nested objects to match backend expectations
  const payload = {
    ...jobData,
    requirements: jobData.requirements ? JSON.stringify(jobData.requirements) : undefined,
    meta: jobData.meta ? JSON.stringify(jobData.meta) : undefined,
  };

  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to create job");
  return body;
}

export async function getJobById(id: string) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fetch job");
  return body;
}

export async function getMyJobs() {
  const res = await fetch(`${API_BASE}/jobs/my`, {
    method: "GET",
    headers: createAuthHeaders(),
    cache: "no-store",
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fetch your jobs");
  return body;
}

// Update job details (partial update) - PATCH
export async function updateJobDetails(
  id: string,
  jobData: {
    title?: string;
    description?: string;
    salary?: number;
    duration?: string;
    contractType?: string;
    requirements?: string; // already stringified
    meta?: string;         // already stringified
  }
) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "PATCH",
    headers: createAuthHeaders(),
    body: JSON.stringify(jobData),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to update job details");
  return body; // expect { message: 'Job updated successfully', job: {...} }
}

// Update job status
export async function updateJobStatus(id: string, status: string) {
  const res = await fetch(`${API_BASE}/jobs/${id}/status`, {
    method: "PUT",
    headers: createAuthHeaders(),
    body: JSON.stringify({ status }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to update job status");
  return body;
}

export async function deleteJob(id: string) {
  const res = await fetch(`${API_BASE}/jobs/${id}`, {
    method: "DELETE",
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to delete job");
  return body; // expect { message: 'Job deleted successfully' }
}

// APPLICATION ROUTES (/api/applications)
export async function applyToJob(jobId: string, resumeFile: File, coverLetter?: string) {
  const formData = new FormData();
  formData.append("resume", resumeFile);
  if (coverLetter) {
    formData.append("coverLetter", coverLetter);
  }

  const token = getAuthToken();
  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Changed to match backend route: /:id/apply instead of /:jobId/apply
  const res = await fetch(`${API_BASE}/applications/${jobId}/apply`, {
    method: "POST",
    headers,
    body: formData,
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to apply to job");
  return body;
}

export async function getApplicationsForJob(jobId: string) {
  const res = await fetch(`${API_BASE}/applications/job/${jobId}`, {
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fetch applications");
  return body;
}

export async function selectApplicant(jobId: string, applicationId: string) {
  const res = await fetch(`${API_BASE}/applications/job/${jobId}/select/${applicationId}`, {
    method: "POST",
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to select applicant");
  return body;
}

export async function rejectApplicant(jobId: string, applicationId: string) {
  const res = await fetch(`${API_BASE}/applications/job/${jobId}/reject/${applicationId}`, {
    method: "POST",
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to reject applicant");
  return body;
}

export async function reviewApplicant(jobId: string, applicationId: string) {
  const res = await fetch(`${API_BASE}/applications/job/${jobId}/review/${applicationId}`, {
    method: "POST",
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to mark applicant as reviewed");
  return body;
}

// HEADHUNT ROUTES (/api/headhunt)
export async function createHeadhuntRequest(headhuntData: {
  // Job details (required for creating the private job)
  title: string;
  description: string;
  salary?: number;
  duration?: string;
  contractType: string;
  requirements?: JobRequirements;
  meta?: JobMeta;
  // Headhunt request details
  companyName: string;
  contactEmail?: string;
  contactPhone?: string;
  otherContacts?: HeadhuntOtherContacts;
  urgency?: string;
  preferredContactMethod?: string;
  notes?: string;
}) {
  // Stringify nested objects to match backend expectations
  const payload = {
    ...headhuntData,
    requirements: headhuntData.requirements ? JSON.stringify(headhuntData.requirements) : undefined,
    meta: headhuntData.meta ? JSON.stringify(headhuntData.meta) : undefined,
    otherContacts: headhuntData.otherContacts ? JSON.stringify(headhuntData.otherContacts) : undefined,
  };

  const res = await fetch(`${API_BASE}/headhunt`, {
    method: "POST",
    headers: createAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to create headhunt request");
  return body;
}

// Get employer's headhunt requests
export async function getMyHeadhuntRequests() {
  const res = await fetch(`${API_BASE}/headhunt/my`, {
    headers: createAuthHeaders(),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fetch headhunt requests");
  return body;
}

// Assign a recruiter to headhunt request
export async function assignRecruiterToHeadhunt(requestId: string, assignedTo: string) {
  const res = await fetch(`${API_BASE}/headhunt/${requestId}/assign`, {
    method: "PUT",
    headers: createAuthHeaders(),
    body: JSON.stringify({ assignedTo }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to assign recruiter");
  return body;
}

// Fulfill headhunt request (mark as completed with candidate)
export async function fulfillHeadhuntRequest(
  requestId: string,
  fulfillmentData: {
    applicationId?: string;
    candidateName?: string;
    notes?: string;
  }
) {
  const res = await fetch(`${API_BASE}/headhunt/${requestId}/fulfill`, {
    method: "PUT",
    headers: createAuthHeaders(),
    body: JSON.stringify(fulfillmentData),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fulfill headhunt request");
  return body;
}

// USER PROFILE FUNCTIONS
export async function getUserProfile() {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    headers: createAuthHeaders(),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fetch user profile");
  return body;
}

// Get employee's own job applications
export async function getMyApplications() {
  const res = await fetch(`${API_BASE}/applications/my`, {
    method: "GET",
    headers: createAuthHeaders(),
    cache: "no-store", // ensures fresh data
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to fetch your applications");
  return body; // expect { count: number, applications: [...] }
}

// Employer: Get all OPEN jobs and their corresponding applications
export async function getOpenJobsWithApplications() {
  const res = await fetch(`${API_BASE}/applications/employer/open`, {
    method: "GET",
    headers: createAuthHeaders(),
    cache: "no-store", // always fetch fresh data
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(body?.message || "Failed to fetch open jobs with applications");
  }

  return body;
}

// delete user profile either EMPLOYEE or EMPLOYER
export async function deleteProfile() {
  const res = await fetch(`${API_BASE}/auth/delete`, {
    method: "DELETE",
    headers: createAuthHeaders(),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.message || "Failed to delete profile");
  return body;
}