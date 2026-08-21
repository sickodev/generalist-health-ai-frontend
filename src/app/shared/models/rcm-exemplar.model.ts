export interface RcmExemplar {
  id: string;
  payerId: string;
  cptCodes: string[];
  icd10Codes: string[];
  denialCode?: string;
  outcome: 'PAID' | 'DENIED' | 'APPEALED_OVERTURNED';
  rationale: string;
  appealLetterTemplate?: string;
  similarityThreshold?: number;
  createdAt: string;
}

export interface IngestionJobStatus {
  jobId: string;
  status: 'STARTING' | 'STARTED' | 'COMPLETED' | 'FAILED';
  totalRecords: number;
  processedRecords: number;
  startTime: string;
  endTime?: string;
  errorMessage?: string;
}

export interface VectorStoreStats {
  totalExemplars: number;
  embeddingModel: string;
  lastIngestedAt?: string;
  dimension: number;
}
