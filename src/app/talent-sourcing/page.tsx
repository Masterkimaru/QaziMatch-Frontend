"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createHeadhuntRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

interface HeadhuntFormData {
  // Job Details
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
  
  // Headhunt Request Details
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  otherContacts: string;
  urgency: "LOW" | "MEDIUM" | "HIGH" | "ASAP";
  preferredContactMethod: "EMAIL" | "PHONE" | "OTHER";
  notes: string;
}

export default function TalentSourcingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<HeadhuntFormData>({
    // Job Details
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
    },
    
    // Headhunt Request Details
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    otherContacts: "",
    urgency: "MEDIUM",
    preferredContactMethod: "EMAIL",
    notes: ""
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (
    section: "requirements" | "meta",
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
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare the data for API
      const apiData = {
        // Job details
        title: formData.title,
        description: formData.description,
        salary: formData.salary ? Number(formData.salary) : undefined,
        duration: formData.duration || undefined,
        contractType: formData.contractType,
        requirements: formData.requirements,
        meta: formData.meta,
        
        // Headhunt request details
        companyName: formData.companyName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || undefined,
        otherContacts: formData.otherContacts ? { notes: formData.otherContacts } : undefined,
        urgency: formData.urgency,
        preferredContactMethod: formData.preferredContactMethod,
        notes: formData.notes || undefined
      };

      const result = await createHeadhuntRequest(apiData);
      
      setSuccess("Headhunt request created successfully! Our team will contact you soon.");
      
      // Reset form
      setFormData({
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
        },
        companyName: "",
        contactEmail: "",
        contactPhone: "",
        otherContacts: "",
        urgency: "MEDIUM",
        preferredContactMethod: "EMAIL",
        notes: ""
      });
    // optionally navigate to a success page or job list
       router.push("/jobs");

    } catch (err: any) {
      setError(err.message || "Failed to create headhunt request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-4 sm:py-6 lg:py-8 px-3 sm:px-4 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Talent Sourcing Service
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Let our expert recruiters find the perfect talent for your specialized roles. 
            We'll handle the search while you focus on what matters most.
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-red-700 dark:text-red-200 font-medium text-sm sm:text-base">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-3">
                <p className="text-green-700 dark:text-green-200 font-medium text-sm sm:text-base">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-background border border-border rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Job Details Section */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-border flex items-center gap-2 sm:gap-3">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-md sm:rounded-lg flex items-center justify-center text-primary text-sm sm:text-base">
                  📋
                </span>
                Job Details
              </h2>
              
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Job Title */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                             transition-all duration-200 ease-in-out
                             text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                             hover:border-primary/50
                             shadow-sm"
                    placeholder="e.g., Senior Full Stack Developer"
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Contract Type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Contract Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="contractType"
                      value={formData.contractType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                    >
                      <option value="">Select contract type</option>
                      <option value="PERMANENT">Permanent</option>
                      <option value="PART_TIME">Part Time</option>
                      <option value="CONTRACT">Contract</option>
                    </select>
                  </div>

                  {/* Salary */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Salary (KSH)
                    </label>
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                      placeholder="e.g., 150000"
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                      placeholder="e.g., 6 months, Permanent"
                      autoComplete="off"
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm resize-vertical"
                      placeholder="Describe the role, responsibilities..."
                    />
                  </div>
                </div>
              </div>

              {/* Requirements Subsection */}
              <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-accent/10 rounded-md flex items-center justify-center text-accent text-xs sm:text-sm">
                    ✓
                  </span>
                  Requirements
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Required Skills
                    </label>
                    <textarea
                      value={formData.requirements.skills}
                      onChange={(e) => handleNestedChange("requirements", "skills", e.target.value)}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm resize-vertical"
                      placeholder="e.g., React, Node.js, TypeScript..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Education
                    </label>
                    <textarea
                      value={formData.requirements.education}
                      onChange={(e) => handleNestedChange("requirements", "education", e.target.value)}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm resize-vertical"
                      placeholder="e.g., Bachelor's in Computer Science..."
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Experience
                    </label>
                    <textarea
                      value={formData.requirements.experience}
                      onChange={(e) => handleNestedChange("requirements", "experience", e.target.value)}
                      rows={3}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm resize-vertical"
                      placeholder="e.g., 5+ years in web development..."
                    />
                  </div>
                </div>
              </div>

              {/* Meta Subsection */}
              <div className="mt-6 sm:mt-8">
                <h3 className="text-base sm:text-lg font-medium text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-accent/10 rounded-md flex items-center justify-center text-accent text-xs sm:text-sm">
                    ℹ
                  </span>
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.meta.location}
                      onChange={(e) => handleNestedChange("meta", "location", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                      placeholder="e.g., Nairobi, Remote"
                      autoComplete="off"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Level
                    </label>
                    <input
                      type="text"
                      value={formData.meta.level}
                      onChange={(e) => handleNestedChange("meta", "level", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                      placeholder="e.g., Senior, Mid-level"
                      autoComplete="off"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.meta.department}
                      onChange={(e) => handleNestedChange("meta", "department", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                      placeholder="e.g., Engineering, Marketing"
                      autoComplete="off"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Headhunt Request Details Section */}
            <section>
              <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-border flex items-center gap-2 sm:gap-3">
                <span className="w-6 h-6 sm:w-8 sm:h-8 bg-primary/10 rounded-md sm:rounded-lg flex items-center justify-center text-primary text-sm sm:text-base">
                  🎯
                </span>
                Headhunt Request Details
              </h2>
              
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                             transition-all duration-200 ease-in-out
                             text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                             hover:border-primary/50
                             shadow-sm"
                    placeholder="Your company name"
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Contact Email */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Contact Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                      placeholder="contact@company.com"
                      autoComplete="email"
                    />
                  </div>

                  {/* Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                      placeholder="+254 700 000000"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Urgency */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Urgency
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="ASAP">ASAP</option>
                    </select>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                      Preferred Contact Method
                    </label>
                    <select
                      name="preferredContactMethod"
                      value={formData.preferredContactMethod}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                               focus:ring-2 focus:ring-primary/20 focus:border-primary 
                               transition-all duration-200 ease-in-out
                               text-foreground text-sm sm:text-base
                               hover:border-primary/50
                               shadow-sm"
                    >
                      <option value="EMAIL">Email</option>
                      <option value="PHONE">Phone</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                {/* Other Contacts */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                    Other Contact Methods
                  </label>
                  <input
                    type="text"
                    name="otherContacts"
                    value={formData.otherContacts}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                             transition-all duration-200 ease-in-out
                             text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                             hover:border-primary/50
                             shadow-sm"
                    placeholder="LinkedIn, WhatsApp, etc."
                    autoComplete="off"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2 sm:mb-3">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-background border border-border rounded-lg 
                             focus:ring-2 focus:ring-primary/20 focus:border-primary 
                             transition-all duration-200 ease-in-out
                             text-foreground placeholder:text-muted-foreground text-sm sm:text-base
                             hover:border-primary/50
                             shadow-sm resize-vertical"
                    placeholder="Any specific requirements, company culture notes..."
                  />
                </div>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-primary text-primary-foreground 
                         font-semibold rounded-lg shadow-lg text-sm sm:text-base
                         hover:bg-accent hover:shadow-xl hover:scale-105
                         focus:ring-4 focus:ring-primary/20 focus:outline-none 
                         transition-all duration-300 ease-out
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                         border border-primary/20 hover:border-accent/20 cursor-pointer"
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Headhunt Request...
                    </>
                  ) : (
                    <>
                      Submit Headhunt Request
                      <svg className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
                
                {/* Button background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-6 sm:mt-8 bg-background border border-border rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 
                            group-hover:bg-primary/20 transition-colors duration-300 
                            border border-primary/20 group-hover:border-primary/40">
                <span className="text-primary font-bold text-base sm:text-xl">1</span>
              </div>
              <h4 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">Submit Request</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Fill out this form with your job requirements and contact details.</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 
                            group-hover:bg-primary/20 transition-colors duration-300 
                            border border-primary/20 group-hover:border-primary/40">
                <span className="text-primary font-bold text-base sm:text-xl">2</span>
              </div>
              <h4 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">We Search</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">Our recruiters will actively search for qualified candidates.</p>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 
                            group-hover:bg-primary/20 transition-colors duration-300 
                            border border-primary/20 group-hover:border-primary/40">
                <span className="text-primary font-bold text-base sm:text-xl">3</span>
              </div>
              <h4 className="font-medium text-foreground mb-2 sm:mb-3 text-sm sm:text-base">You Interview</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">We present you with pre-vetted candidates for final interviews.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}