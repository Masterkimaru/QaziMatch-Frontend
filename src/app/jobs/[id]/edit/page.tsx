"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getJobById, updateJobDetails } from "@/lib/api";

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

interface FormData {
  title: string;
  description: string;
  salary: string;
  duration: string;
  contractType: string;
  requirements: {
    skills: string;
    education: string;
    experience: string;
  };
  meta: {
    location: string;
    level: string;
    department: string;
  };
}

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    salary: "",
    duration: "",
    contractType: "",
    requirements: {
      skills: "",
      education: "",
      experience: ""
    },
    meta: {
      location: "",
      level: "",
      department: ""
    }
  });

  const jobId = params.id as string;

  useEffect(() => {
    if (!jobId) return;

    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");
        const jobData = await getJobById(jobId);
        setJob(jobData);

        // Populate form with existing job data
        setFormData({
          title: jobData.title || "",
          description: jobData.description || "",
          salary: jobData.salary?.toString() || "",
          duration: jobData.duration || "",
          contractType: jobData.contractType || "",
          requirements: {
            skills: Array.isArray(jobData.requirements?.skills) 
              ? jobData.requirements.skills.join(", ") 
              : "",
            education: jobData.requirements?.education || "",
            experience: jobData.requirements?.experience || ""
          },
          meta: {
            location: jobData.meta?.location || "",
            level: jobData.meta?.level || "",
            department: jobData.meta?.department || ""
          }
        });
      } catch (err) {
        if (err instanceof Error && err.message === "Job not found"){
            setError("The job you're looking for does not exist or has been removed");
        } else{
            setError("failed to load job details");
        }       
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [jobId]);

  // Check if current user is the job owner
  const isJobOwner = user && job && user.id === job.employerId;

  // Redirect if not the job owner
  useEffect(() => {
    if (!loading && job && !isJobOwner) {
      router.push(`/jobs/${jobId}`);
    }
  }, [loading, job, isJobOwner, router, jobId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedInputChange = (
    section: 'requirements' | 'meta',
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!job) return;

    try {
      setSubmitting(true);
      setError("");

      // Prepare data for API
    const updateData = {
      title: formData.title,
      description: formData.description,
      salary: formData.salary ? parseFloat(formData.salary) : undefined,
      duration: formData.duration,
      contractType: formData.contractType,
      requirements: JSON.stringify({
        skills: formData.requirements.skills.split(',').map(skill => skill.trim()).filter(Boolean),
        education: formData.requirements.education,
        experience: formData.requirements.experience
      }),
      meta: JSON.stringify({
        location: formData.meta.location,
        level: formData.meta.level,
        department: formData.meta.department
      })
    };

      await updateJobDetails(jobId, updateData);
      
      // Redirect to job page after successful update
      router.push(`/jobs/${jobId}`);
    } catch (err) {
      if (err instanceof Error && err.message){
        setError(err.message || "Failed to update job");
      }else{
        setError("failed to update job");
      }
      console.error("Error updating job:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
            <p className="font-semibold">Job not found</p>
            <p className="text-sm mt-1">{error || "The job you're looking for doesn't exist or has been removed."}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!isJobOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200 p-4 rounded-lg mb-6">
            <p className="font-semibold">Access Denied</p>
            <p className="text-sm mt-1">You can only edit jobs that you created.</p>
          </div>
          <button
            onClick={() => router.push(`/jobs/${jobId}`)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors font-medium"
          >
            View Job
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-2">Edit Job</h1>
        <p className="text-muted-foreground">Update your job posting details</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Basic Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Job Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Senior Frontend Developer"
              />
            </div>

            <div>
              <label htmlFor="contractType" className="block text-sm font-medium text-foreground mb-2">
                Contract Type *
              </label>
              <select
                id="contractType"
                name="contractType"
                value={formData.contractType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
              >
                <option value="">Select contract type</option>
                <option value="PERMANENT">Permanent</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-2">
                Duration *
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Permanent, 6 months"
              />
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-foreground mb-2">
                Salary (KSH)
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., 150000"
              />
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Job Description</h2>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-vertical"
              placeholder="Describe the role, responsibilities, and what makes this job exciting..."
            />
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Requirements</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-foreground mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                id="skills"
                value={formData.requirements.skills}
                onChange={(e) => handleNestedInputChange('requirements', 'skills', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., JavaScript, React, Node.js, TypeScript"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple skills with commas
              </p>
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-foreground mb-2">
                Education
              </label>
              <input
                type="text"
                id="education"
                value={formData.requirements.education}
                onChange={(e) => handleNestedInputChange('requirements', 'education', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Bachelor's degree in Computer Science or related field"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-foreground mb-2">
                Experience
              </label>
              <input
                type="text"
                id="experience"
                value={formData.requirements.experience}
                onChange={(e) => handleNestedInputChange('requirements', 'experience', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., 3+ years of professional experience"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Additional Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={formData.meta.location}
                onChange={(e) => handleNestedInputChange('meta', 'location', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Nairobi, Kenya"
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-foreground mb-2">
                Experience Level
              </label>
              <input
                type="text"
                id="level"
                value={formData.meta.level}
                onChange={(e) => handleNestedInputChange('meta', 'level', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Mid-level, Senior"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="department" className="block text-sm font-medium text-foreground mb-2">
                Department
              </label>
              <input
                type="text"
                id="department"
                value={formData.meta.department}
                onChange={(e) => handleNestedInputChange('meta', 'department', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                placeholder="e.g., Engineering, Marketing, Sales"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => router.push(`/jobs/${jobId}`)}
            disabled={submitting}
            className="px-6 py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              "Update Job"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}