import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 gradient-subtle border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About <span className="text-primary">QaziMatch</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Revolutionizing the way job-seekers find their perfect roles and employers 
              discover exceptional talent through intelligent matching and dedicated 
              recruitment services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/jobs"
                className="px-8 py-3 gradient-primary text-primary-foreground font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                Browse Jobs
              </Link>
              <Link 
                href="/contact"
                className="px-8 py-3 border border-primary text-primary font-medium rounded-lg hover:bg-primary/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, var(--primary) 2%, transparent 0%), radial-gradient(circle at 75px 75px, var(--accent) 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }} />
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Bridging Talent with Opportunity
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                At QaziMatch, we believe that everyone deserves to find work that not only 
                pays the bills but also fulfills their passions and utilizes their unique 
                talents. Our mission is to create meaningful connections between job-seekers 
                and employers through intelligent technology and personalized service.
              </p>
              <div className="p-6 bg-muted rounded-lg border border-border">
                <p className="text-foreground italic">
                  &ldquo;We&apos;re not just matching resumes to job descriptions&mdash;we&apos;re matching 
                  people to purpose and companies to their future leaders.&rdquo;
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                Our Vision
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                The Future of Recruitment
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a world where the job search process is efficient, transparent, 
                and rewarding for both candidates and employers. By leveraging cutting-edge 
                technology and human expertise, we&apos;re building the most trusted platform 
                for career advancement and talent acquisition in the region.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">1000+</div>
                  <div className="text-sm text-muted-foreground">Successful Matches</div>
                </div>
                <div className="text-center p-4 bg-secondary rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Partner Companies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How QaziMatch Works</h2>
            <p className="text-lg text-muted-foreground">
              Our platform uses a sophisticated matching algorithm combined with human 
              expertise to ensure perfect fits between talent and opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* For Job Seekers */}
            <div className="bg-background rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">For Job Seekers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Create your personalized profile with skills and preferences
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Get matched with jobs that align with your career goals
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Receive personalized job recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Connect directly with top employers
                </li>
              </ul>
            </div>

            {/* For Employers */}
            <div className="bg-background rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">For Employers</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Post job openings and reach qualified candidates
                </li>
                
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Manage applications through our intuitive dashboard
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Access our talent sourcing service for urgent needs
                </li>
              </ul>
            </div>

            {/* Talent Sourcing */}
            <div className="bg-background rounded-xl p-8 border border-border shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">Talent Sourcing</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Dedicated recruiters for urgent hiring needs
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Specialized search for hard-to-fill positions
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Premium candidate screening and vetting
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  Faster time-to-hire with guaranteed quality
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Sourcing Feature Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  Premium Service
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Talent Sourcing for Urgent Hiring Needs
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  When you need the right talent fast, our Talent Sourcing service provides 
                  dedicated recruitment experts who specialize in finding and vetting 
                  top-tier candidates for your specific requirements.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Dedicated Recruiter</h4>
                      <p className="text-muted-foreground">Your personal recruitment expert focused solely on your needs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Active Headhunting</h4>
                      <p className="text-muted-foreground">We proactively search for and approach passive candidates</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-3 mt-1">
                      <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Comprehensive Vetting</h4>
                      <p className="text-muted-foreground">Thorough screening including technical assessments and cultural fit</p>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 gradient-primary text-primary-foreground font-medium rounded-lg hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  Learn More About Talent Sourcing
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              
              <div className="bg-gradient-subtle rounded-2xl p-8 border border-border">
                <div className="bg-background rounded-lg p-6 border border-border shadow-sm">
                  <h3 className="text-xl font-bold text-foreground mb-4">Why Choose Talent Sourcing?</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-foreground">Average Time Savings</span>
                      <span className="font-bold text-primary">60%</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-foreground">Candidate Quality</span>
                      <span className="font-bold text-primary">95% Match Rate</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-border">
                      <span className="text-foreground">Retention Rate</span>
                      <span className="font-bold text-primary">85% 1st Year</span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-foreground">Client Satisfaction</span>
                      <span className="font-bold text-primary">98%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to Find Your Perfect Match?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re looking for your dream job or your next star employee, 
            QaziMatch is here to make it happen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/jobs"
              className="px-8 py-3 bg-background text-foreground font-medium rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-background/30"
            >
              Start Job Search
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
}