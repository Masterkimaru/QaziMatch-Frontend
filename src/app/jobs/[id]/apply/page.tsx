"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { applyToJob } from "@/lib/api";

//  Helper to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unknown error occurred";
}

export default function JobApplicationPage() {
  const params = useParams();
  const router = useRouter();
  // Removed unused `user` from AuthContext since it's commented out and not used
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const jobId = params.id as string;

  // Countdown effect for auto-redirect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (showSuccessPopup && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (showSuccessPopup && countdown === 0) {
      router.push(`/jobs/${jobId}?application=success`);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessPopup, countdown, router, jobId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Check file type (PDF, DOC, DOCX)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, DOC, or DOCX file");
        setResumeFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        setResumeFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }

      setError("");
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setError("Please upload your resume");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await applyToJob(jobId, resumeFile, coverLetter);
      
      // Show success popup instead of immediate redirect
      setShowSuccessPopup(true);
      setCountdown(5); // Reset countdown to 5 seconds
      
    } catch (err) {
      console.error("Application error:", err);
      setError(getErrorMessage(err) || "Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessPopupClose = () => {
    // Redirect to job details page immediately when user clicks the button
    router.push(`/jobs/${jobId}?application=success`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-6 max-w-md w-full animate-in fade-in-90 zoom-in-90">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Application Submitted!</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Your application has been successfully submitted. The employer will review your resume and cover letter and contact you if you{`'`}re a good fit for the position.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleSuccessPopupClose}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                View Job Details Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Job
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-2">Apply for Job</h1>
        <p className="text-muted-foreground">
          Submit your application by uploading your resume and adding a cover letter (optional).
        </p>
      </div>

      {/* Application Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resume Upload */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Resume</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Upload Resume *
              </label>
              <p className="text-sm text-muted-foreground mb-3">
                Supported formats: PDF, DOC, DOCX (Max 5MB)
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="block w-full text-sm text-muted-foreground
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-primary file:text-primary-foreground
                  hover:file:bg-primary/90
                  cursor-pointer
                  border border-border rounded-lg bg-background"
                required
              />
            </div>

            {resumeFile && (
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{resumeFile.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setResumeFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-red-600 hover:text-red-800 p-1 rounded"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Cover Letter</h2>
          
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-foreground mb-2">
              Cover Letter (Optional)
            </label>
            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the employer why you're a good fit for this position..."
              rows={6}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {coverLetter.length}/2000 characters
            </p>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200 p-4 rounded-lg">
            <p className="font-semibold">Application Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-muted text-foreground hover:bg-muted/80 px-6 py-3 rounded-lg transition-colors font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !resumeFile}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                Submitting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>

      {/* Application Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Application Tips</h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Ensure your resume is up-to-date and relevant to the position</li>
          <li>• Tailor your cover letter to highlight why you{`'`}re a good fit</li>
          <li>• Double-check for any spelling or grammatical errors</li>
          <li>• Make sure your contact information is current</li>
        </ul>
      </div>
    </div>
  );
}