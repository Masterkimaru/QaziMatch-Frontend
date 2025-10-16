export default function TermsOfService() {
  return (
    <div
      className="min-h-screen py-6 sm:py-8"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Terms of Service
          </h1>
          <p
            className="text-base sm:text-lg"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Content */}
        <div
          className="rounded-lg p-6 sm:p-8 shadow-md"
          style={{
            backgroundColor: 'var(--background)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="prose prose-lg max-w-none w-full">
            {[
              {
                id: 1,
                title: 'Acceptance of Terms',
                content: (
                  <p>
                    By accessing or using QaziMatch (&quot;the Platform&quot;), you agree to be bound by these Terms of Service and our Privacy Policy. If you disagree with any part of these terms, you may not access the Platform.
                  </p>
                ),
              },
              {
                id: 2,
                title: 'Definitions',
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong>&quot;Job Seeker&quot;</strong> refers to individuals seeking employment opportunities</li>
                    <li><strong>&quot;Employer&quot;</strong> refers to companies or individuals posting job opportunities</li>
                    <li><strong>&quot;Content&quot;</strong> includes job postings, resumes, profiles, and all other materials</li>
                    <li><strong>&quot;Services&quot;</strong> refers to all features and functionality of the QaziMatch platform</li>
                  </ul>
                ),
              },
              {
                id: 3,
                title: 'User Accounts',
                content: (
                  <>
                    <h3 className="text-lg font-medium mt-4 mb-2">Eligibility</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You must be at least 18 years old to use the Platform</li>
                      <li>You must provide accurate and complete registration information</li>
                      <li>You are responsible for maintaining account security and confidentiality</li>
                      <li>You may not create multiple accounts without authorization</li>
                    </ul>
                    <h3 className="text-lg font-medium mt-4 mb-2">Account Types</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Job Seekers:</strong> May apply to jobs, create profiles, and receive job recommendations</li>
                      <li><strong>Employers:</strong> May post jobs, review applications, and contact candidates</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 4,
                title: 'Job Seeker Responsibilities',
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Provide accurate and truthful information in your profile and applications</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Only apply to jobs for which you are qualified and genuinely interested</li>
                    <li>Respond professionally to employer communications</li>
                    <li>Notify employers if you are no longer available for a position</li>
                    <li>Respect employer confidentiality and proprietary information</li>
                  </ul>
                ),
              },
              {
                id: 5,
                title: 'Employer Responsibilities',
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Post accurate and non-discriminatory job descriptions</li>
                    <li>Respond to applications in a timely manner</li>
                    <li>Maintain confidentiality of applicant information</li>
                    <li>Comply with all applicable employment laws and regulations</li>
                    <li>Do not post fake jobs or engage in deceptive hiring practices</li>
                    <li>Provide clear job requirements and compensation information</li>
                    <li>Respect applicant privacy and data protection rights</li>
                  </ul>
                ),
              },
              {
                id: 6,
                title: 'Prohibited Activities',
                content: (
                  <>
                    <p className="mb-2">Users may not:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Post false, misleading, or fraudulent information</li>
                      <li>Harass, discriminate, or engage in unlawful behavior</li>
                      <li>Reverse engineer or attempt to extract source code</li>
                      <li>Use the Platform for any illegal or unauthorized purpose</li>
                      <li>Impersonate any person or entity</li>
                      <li>Upload viruses or malicious code</li>
                      <li>Spam other users or send unsolicited communications</li>
                      <li>Violate intellectual property rights of others</li>
                      <li>Collect user information without consent</li>
                      <li>Interfere with Platform security or performance</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 7,
                title: 'Job Application Process',
                content: (
                  <>
                    <h3 className="text-lg font-medium mt-4 mb-2">Application Submission</h3>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li>Job seekers may apply to relevant job postings</li>
                      <li>Applications typically include resume, cover letter, and profile information</li>
                      <li>Employers receive applications through the Platform</li>
                      <li>Application status may be tracked within the Platform</li>
                    </ul>
                    <h3 className="text-lg font-medium mt-4 mb-2">Hiring Decisions</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>QaziMatch is not involved in hiring decisions</li>
                      <li>Employers are solely responsible for candidate selection</li>
                      <li>Job seekers are responsible for due diligence on employers</li>
                      <li>All employment terms are negotiated directly between parties</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 8,
                title: 'Intellectual Property',
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>QaziMatch owns all Platform intellectual property</li>
                    <li>Users retain ownership of their content but grant us license to use it</li>
                    <li>Job postings and profiles may be displayed on the Platform</li>
                    <li>Users may not copy, modify, or distribute Platform content without permission</li>
                  </ul>
                ),
              },
              {
                id: 9,
                title: 'Fees and Payments',
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Job seeker accounts are typically free</li>
                    <li>Employers may be charged for premium services or job postings</li>
                    <li>All fees are clearly disclosed before purchase</li>
                    <li>Refund policies are outlined in separate payment terms</li>
                    <li>Prices and features are subject to change with notice</li>
                  </ul>
                ),
              },
              {
                id: 10,
                title: 'Limitation of Liability',
                content: (
                  <>
                    <p className="mb-2">
                      QaziMatch provides a platform for job matching but does not guarantee:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Employment or hiring outcomes</li>
                      <li>Accuracy of job postings or applicant information</li>
                      <li>Availability or uninterrupted service</li>
                      <li>Compatibility with all devices or browsers</li>
                      <li>Success in job search or candidate finding</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 11,
                title: 'Termination',
                content: (
                  <>
                    <p className="mb-2">
                      We may suspend or terminate accounts for:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Violation of these Terms of Service</li>
                      <li>Fraudulent or illegal activity</li>
                      <li>Extended account inactivity</li>
                      <li>Requests from legal authorities</li>
                      <li>Platform abuse or security concerns</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 12,
                title: 'Dispute Resolution',
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Users must attempt to resolve disputes directly</li>
                    <li>Legal claims must be filed within one year of arising</li>
                    <li>Arbitration may be required for certain disputes</li>
                    <li>Governing law is based on platform jurisdiction</li>
                  </ul>
                ),
              },
              {
                id: 13,
                title: 'Changes to Terms',
                content: (
                  <p>
                    We reserve the right to modify these terms at any time. Continued use of the Platform after changes constitutes acceptance of the modified terms.
                  </p>
                ),
              },
              {
                id: 14,
                title: 'Contact Information',
                content: (
                  <>
                    <p className="mb-2">
                      For questions about these Terms of Service, contact us at:
                    </p>
                    <ul className="space-y-1">
                      <li>
                        Email:{' '}
                        <a
                          href="mailto:legal@qazimatch.com"
                          className="hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          legal@qazimatch.com
                        </a>
                      </li>
                      <li>Address: [Your Company Address]</li>
                      <li>Phone: [Your Company Phone]</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 15,
                title: 'Severability',
                content: (
                  <p>
                    If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
                  </p>
                ),
              },
            ].map((section) => (
              <section key={section.id} className="mb-8">
                <h2
                  className="text-xl sm:text-2xl font-semibold mb-4"
                  style={{ color: 'var(--foreground)' }}
                >
                  {section.id}. {section.title}
                </h2>
                <div style={{ color: 'var(--muted-foreground)' }}>{section.content}</div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}