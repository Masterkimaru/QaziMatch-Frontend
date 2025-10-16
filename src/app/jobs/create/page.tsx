"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createJob } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function CreateJobPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salary: "",
    duration: "",
    contractType: "PERMANENT",
    requirements: {
      skills: [] as string[],
      education: "",
      experience: ""
    },
    meta: {
      location: "",
      level: "",
      department: ""
    }
  });

  // Redirect if not authenticated or not employer
  if (user && user.role !== "EMPLOYER") {
    router.push("/jobs");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith("requirements.")) {
      const requirementField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [requirementField]: value
        }
      }));
    } else if (name.startsWith("meta.")) {
      const metaField = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        meta: {
          ...prev.meta,
          [metaField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skillsArray = e.target.value.split(",").map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        skills: skillsArray
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const jobData = {
        title: formData.title,
        description: formData.description,
        salary: formData.salary ? Number(formData.salary) : undefined,
        duration: formData.duration,
        contractType: formData.contractType,
        requirements: formData.requirements,
        meta: formData.meta
      };

      await createJob(jobData);
      router.push("/jobs/my");
    } catch (err: any) {
      setError(err.message || "Failed to create job");
      console.error("Error creating job:", err);
    } finally {
      setLoading(false);
    }
  };

  const contractTypes = [
    { value: "PERMANENT", label: "Permanent" },
    { value: "PART_TIME", label: "Part Time" },
    { value: "CONTRACT", label: "Contract" },
  ];

  const experienceLevels = [
    { value: "ENTRY", label: "Entry Level" },
    { value: "JUNIOR", label: "Junior" },
    { value: "MID", label: "Mid Level" },
    { value: "SENIOR", label: "Senior" },
    { value: "LEAD", label: "Lead" },
    { value: "EXECUTIVE", label: "Executive" }
  ];

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-4xl">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Post a New Job</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Create a job posting to attract qualified candidates
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-3 sm:p-4 rounded-lg mb-6">
          <p className="font-semibold">Error</p>
          <p className="text-xs sm:text-sm mt-1">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Basic Information</h2>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
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
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Senior Frontend Developer"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical text-sm sm:text-base"
                  placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
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
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., 150000"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-foreground mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., 6 months, Permanent"
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
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                >
                  {contractTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="meta.location" className="block text-sm font-medium text-foreground mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="meta.location"
                  name="meta.location"
                  value={formData.meta.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Nairobi, Remote"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Requirements</h2>
            <div className="grid gap-4 sm:gap-5">
              <div>
                <label htmlFor="requirements.skills" className="block text-sm font-medium text-foreground mb-2">
                  Required Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="requirements.skills"
                  name="requirements.skills"
                  onChange={handleSkillsChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., JavaScript, React, Node.js, TypeScript"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple skills with commas
                </p>
              </div>

              <div>
                <label htmlFor="requirements.education" className="block text-sm font-medium text-foreground mb-2">
                  Education Requirements
                </label>
                <input
                  type="text"
                  id="requirements.education"
                  name="requirements.education"
                  value={formData.requirements.education}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Bachelor's degree in Computer Science or related field"
                />
              </div>

              <div>
                <label htmlFor="requirements.experience" className="block text-sm font-medium text-foreground mb-2">
                  Experience Requirements
                </label>
                <input
                  type="text"
                  id="requirements.experience"
                  name="requirements.experience"
                  value={formData.requirements.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., 3+ years of professional experience"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Additional Information</h2>
            <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="meta.level" className="block text-sm font-medium text-foreground mb-2">
                  Experience Level
                </label>
                <select
                  id="meta.level"
                  name="meta.level"
                  value={formData.meta.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                >
                  <option value="">Select level</option>
                  {experienceLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="meta.department" className="block text-sm font-medium text-foreground mb-2">
                  Department
                </label>
                <input
                  type="text"
                  id="meta.department"
                  name="meta.department"
                  value={formData.meta.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
                  placeholder="e.g., Engineering, Marketing, Sales"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-4 py-2.5 sm:px-6 sm:py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium text-sm sm:text-base disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-primary-foreground py-2.5 px-4 sm:px-6 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  <span>Creating Job...</span>
                </>
              ) : (
                <span>Create Job Posting</span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}