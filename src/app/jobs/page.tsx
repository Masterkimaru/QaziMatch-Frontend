import { fetchJobs } from "@/lib/api";
import JobCard from "@/components/JobCard";
import JobSearchFilters from "@/components/JobSearchFilters";
import { Job } from "@/types/job";

interface SearchParams {
  search?: string;
  location?: string;
  contractType?: string;
  minSalary?: string;
  maxSalary?: string;
}

interface JobsPageProps {
  searchParams: Promise<SearchParams>;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const jobs: Job[] = await fetchJobs();

  // Filter jobs based on search parameters
  const filteredJobs = jobs.filter((job) => {
    const searchTerm = params.search?.toLowerCase() || '';
    const locationFilter = params.location?.toLowerCase() || '';
    const contractTypeFilter = params.contractType || '';
    const minSalary = params.minSalary ? parseInt(params.minSalary) : 0;
    const maxSalary = params.maxSalary ? parseInt(params.maxSalary) : Number.MAX_SAFE_INTEGER;

    // Search term filter
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm) && 
        !job.description?.toLowerCase().includes(searchTerm) &&
        !job.employer?.name?.toLowerCase().includes(searchTerm)) {
      return false;
    }

    // Location filter
    if (locationFilter && !job.meta?.location?.toLowerCase().includes(locationFilter)) {
      return false;
    }

    // Contract type filter
    if (contractTypeFilter && job.contractType !== contractTypeFilter) {
      return false;
    }

    // Salary range filter
    if (job.salary && (job.salary < minSalary || job.salary > maxSalary)) {
      return false;
    }

    return true;
  });

  // Get unique values for filter dropdowns
  const locations = [...new Set(jobs.map(job => job.meta?.location).filter(Boolean))] as string[];
  const contractTypes = [...new Set(jobs.map(job => job.contractType).filter(Boolean))] as string[];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Available Jobs</h1>
        <p className="text-muted-foreground">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <JobSearchFilters 
        locations={locations}
        contractTypes={contractTypes}
        searchParams={params}
      />

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">
            No jobs found matching your criteria
          </div>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search filters or search terms
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}