import { fetchJobs } from "@/lib/api";
import JobCard from "@/components/JobCard";
import { Job } from "@/types/job";

export default async function JobsPage() {
  const jobs: Job[] = await fetchJobs();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Available Jobs</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
