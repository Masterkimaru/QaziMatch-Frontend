import Link from "next/link";

interface Employer {
  id?: string;
  name?: string;
  email?: string;
}

interface JobMeta {
  location?: string;
  level?: string;
  department?: string;
}

interface JobRequirements {
  skills?: string;
  education?: string;
  experience?: string;
}

interface Job {
  id: string;
  title: string;
  description?: string;
  salary?: number;
  contractType?: string;
  duration?: string;
  employer?: Employer;
  meta?: JobMeta;
  requirements?: JobRequirements;
  createdAt?: string;
  updatedAt?: string;
}

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const companyName = job.employer?.name || "Unknown Company";
  const location = job.meta?.location || "Location not specified";
  const salary = job.salary ? `KSH ${job.salary.toLocaleString()}` : "Salary not disclosed";
  const contractType = job.contractType || "Not specified";
  const duration = job.duration || "";

  const shortDesc = job.description
    ? job.description.length > 120
      ? job.description.substring(0, 120) + '...'
      : job.description
    : "No description available.";

  return (
    <div className="group border border-border rounded-xl p-5 bg-background shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 overflow-hidden relative">
      {/* Subtle hover glow effect */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl pointer-events-none" />

      <div className="relative z-10">
        <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
          {job.title}
        </h2>

        <p className="text-sm font-medium text-muted-foreground mb-3">
          {companyName}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2.5 py-1 bg-muted text-muted-foreground text-xs rounded-full border border-border">
            {location}
          </span>
          <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {contractType}
          </span>
          {duration && (
            <span className="px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full">
              {duration}
            </span>
          )}
        </div>

        <p className="text-sm text-foreground/80 mb-5 line-clamp-3">
          {shortDesc}
        </p>

        <div className="mb-5">
          <span className="text-sm font-semibold text-foreground">Salary:</span>
          <span className="ml-2 text-sm text-muted-foreground">{salary}</span>
        </div>

        <Link href={`/jobs/${job.id}`} className="block">
          <button 
            className="w-full py-2.5 px-4 gradient-primary text-primary-foreground font-medium rounded-lg border border-transparent hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
            aria-label={`View details for ${job.title}`}
          >
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}