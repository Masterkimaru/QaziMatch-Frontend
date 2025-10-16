export interface Employer {
  name: string;
}

export interface JobMeta {
  location?: string;
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  salary?: number;
  employer?: Employer;
  meta?: JobMeta;
  contractType?: string;
  duration?: string;
}
