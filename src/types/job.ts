export interface Employer {
  id?: string;
  name?: string;
  email?: string;
}

export interface JobMeta {
  location?: string;
  level?: string;
  department?: string;
}

export interface JobRequirements {
  skills?: string;
  education?: string;
  experience?: string;
}

export interface Job {
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