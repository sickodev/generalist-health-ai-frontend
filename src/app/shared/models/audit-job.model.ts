import { AuditReport } from './audit-report.model';

export type JobStatus = 'PENDING' | 'PROCESSING' | 'DONE' | 'FAILED';

export interface AuditJob {
  jobId: string;
  status: JobStatus;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
  payerId?: string;
  cptCodes?: string[];
  report?: AuditReport;
}
