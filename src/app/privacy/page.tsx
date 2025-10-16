export default function PrivacyPolicy() {
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
            Privacy Policy
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
                title: 'Introduction',
                content: (
                  <p>
                    Welcome to QaziMatch. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our job matching platform.
                  </p>
                ),
              },
              {
                id: 2,
                title: 'Information We Collect',
                content: (
                  <>
                    <h3 className="text-lg font-medium mt-4 mb-2">Personal Information</h3>
                    <ul className="list-disc pl-5 space-y-1 mb-4">
                      <li><strong>Job Seekers:</strong> Name, email, phone number, resume, work experience, education, skills, location, and profile picture</li>
                      <li><strong>Employers:</strong> Company name, email, phone number, company details, job postings, and hiring preferences</li>
                      <li><strong>All Users:</strong> Account credentials, usage data, and communication preferences</li>
                    </ul>
                    <h3 className="text-lg font-medium mt-4 mb-2">Automatically Collected Information</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>IP address and device information</li>
                      <li>Browser type and version</li>
                      <li>Pages visited and time spent on platform</li>
                      <li>Job search and application history</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 3,
                title: 'How We Use Your Information',
                content: (
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Match job seekers with relevant job opportunities</li>
                    <li>Connect employers with qualified candidates</li>
                    <li>Process job applications and manage hiring processes</li>
                    <li>Send job alerts and platform notifications</li>
                    <li>Improve our platform and user experience</li>
                    <li>Provide customer support and communicate updates</li>
                    <li>Ensure platform security and prevent fraud</li>
                  </ul>
                ),
              },
              {
                id: 4,
                title: 'Information Sharing',
                content: (
                  <>
                    <p className="mb-2">
                      We respect your privacy and only share information as necessary:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Job Applications:</strong> Your application materials are shared with employers you apply to</li>
                      <li><strong>Employer Profiles:</strong> Company information is visible to job seekers</li>
                      <li><strong>Service Providers:</strong> With trusted partners who help us operate our platform</li>
                      <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 5,
                title: 'Data Security',
                content: (
                  <>
                    <p className="mb-2">
                      We implement industry-standard security measures to protect your data:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Encryption of sensitive data in transit and at rest</li>
                      <li>Regular security assessments and updates</li>
                      <li>Access controls and authentication protocols</li>
                      <li>Secure data storage and backup procedures</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 6,
                title: 'Your Rights',
                content: (
                  <>
                    <p className="mb-2">
                      You have the right to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Access and download your personal data</li>
                      <li>Update or correct your information</li>
                      <li>Delete your account and personal data</li>
                      <li>Opt-out of marketing communications</li>
                      <li>Restrict certain data processing activities</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 7,
                title: 'Cookies and Tracking',
                content: (
                  <>
                    <p className="mb-2">
                      We use cookies and similar technologies to:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Remember your preferences and login sessions</li>
                      <li>Analyze platform usage and improve performance</li>
                      <li>Personalize your job recommendations</li>
                      <li>Measure advertising effectiveness</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 8,
                title: 'Data Retention',
                content: (
                  <>
                    <p className="mb-2">
                      We retain your personal data only as long as necessary:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><strong>Active Accounts:</strong> Until account deletion</li>
                      <li><strong>Job Applications:</strong> As required by employment laws</li>
                      <li><strong>Inactive Accounts:</strong> 2 years of inactivity</li>
                      <li><strong>Legal Requirements:</strong> As required by applicable laws</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 9,
                title: 'International Data Transfers',
                content: (
                  <p>
                    Your data may be processed in countries outside your residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
                  </p>
                ),
              },
              {
                id: 10,
                title: 'Contact Us',
                content: (
                  <>
                    <p className="mb-2">
                      If you have any questions about this Privacy Policy or your data, please contact us:
                    </p>
                    <ul className="space-y-1">
                      <li>
                        Email:{' '}
                        <a
                          href="mailto:privacy@qazimatch.com"
                          className="hover:underline"
                          style={{ color: 'var(--accent)' }}
                        >
                          privacy@qazimatch.com
                        </a>
                      </li>
                      <li>Address: [Your Company Address]</li>
                      <li>Phone: [Your Company Phone]</li>
                    </ul>
                  </>
                ),
              },
              {
                id: 11,
                title: 'Changes to This Policy',
                content: (
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
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