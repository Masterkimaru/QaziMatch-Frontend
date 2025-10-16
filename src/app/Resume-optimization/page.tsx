"use client";

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

export default function ResumeOptimizationPage() {
  const [fullName, setFullName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !file) return alert("Please provide your full name and upload your CV.");

    setLoading(true);
    setSubmitted(false);

    // Simulate upload (replace with real backend endpoint later)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFullName("");
      setFile(null);
      setNotes("");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 xs:p-4 sm:p-6 bg-[var(--background)] text-[var(--foreground)]">
      <div className="w-full max-w-2xl bg-[var(--secondary)] rounded-xl sm:rounded-2xl shadow-lg border border-[var(--border)] p-4 sm:p-6 md:p-8 lg:p-10 transition-all hover:shadow-xl">
        {/* Header Section */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] bg-clip-text text-transparent mb-2 sm:mb-3">
            Resume Optimization
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto px-1">
            Upload your CV and let us help you professionally revamp it.  
            You can also include any notes or preferences you'd like us to consider.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] outline-none transition-all duration-200"
              required
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Upload Your Current CV
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="cv-upload"
                className="flex flex-col items-center justify-center w-full p-4 sm:p-6 border-2 border-dashed rounded-lg sm:rounded-xl cursor-pointer bg-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--secondary)] transition-all duration-300 min-h-[120px] sm:min-h-[140px]"
              >
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--accent)] mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] text-center px-2">
                  {file ? (
                    <span className="font-medium text-[var(--foreground)] break-words max-w-full">
                      {file.name}
                    </span>
                  ) : (
                    <>
                      Click to upload or drag and drop
                      <br className="hidden xs:block" />
                      <span className="text-xs">(PDF, DOC, DOCX)</span>
                    </>
                  )}
                </p>
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setFile(e.target.files[0]);
                    }
                  }}
                  required
                />
              </label>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs sm:text-sm font-medium mb-1 sm:mb-2">
              Additional Notes <span className="text-[var(--muted-foreground)] text-xs">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific details, preferences, or career goals you'd like us to know..."
              rows={3}
              className="w-full p-2 sm:p-3 text-sm sm:text-base border rounded-lg bg-[var(--muted)] text-[var(--foreground)] border-[var(--border)] focus:ring-2 focus:ring-[var(--ring)] outline-none resize-none transition-all duration-200"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 sm:py-3 md:py-4 rounded-lg text-[var(--primary-foreground)] font-medium gradient-primary shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-sm sm:text-base md:text-lg active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm md:text-base">Submitting...</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm md:text-base">Submit CV for Optimization</span>
            )}
          </button>

          {/* Success Message */}
          {submitted && (
            <div className="text-center p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm sm:text-base font-medium">
                ✅ Your CV has been successfully submitted for optimization!
              </p>
              <p className="text-green-500 text-xs sm:text-sm mt-1">
                We'll review it and get back to you soon.
              </p>
            </div>
          )}
        </form>

        {/* Additional Information for Mobile */}
        <div className="mt-4 sm:mt-6 md:mt-8 p-3 sm:p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)]">
          <h3 className="text-xs sm:text-sm font-semibold text-[var(--foreground)] mb-2">
            📝 What to Expect:
          </h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1 list-disc list-inside">
            <li>Professional formatting and layout improvements</li>
            <li>Keyword optimization for ATS systems</li>
            <li>Content enhancement and proofreading</li>
            <li>24-48 hour turnaround time</li>
          </ul>
        </div>
      </div>
    </div>
  );
}