export interface ClaimMetadata {
  payerId: string;
  cptCodes: string[];
  icd10Codes: string[];
  placeOfService: string;
  dateOfService: string;
  billedAmount?: number;
  inNetwork?: boolean;
}

export interface EnsembleConfig {
  kNearestNeighbors: number; // e.g. 3..5
  ensembleSize: number; // e.g. 3..5
}

export interface AuditRequest {
  claim: ClaimMetadata;
  edi271Payload?: string;
  config?: EnsembleConfig;
}
