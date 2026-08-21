export type DenialRisk = 'LIKELY_DENIED' | 'LIKELY_CLEAN' | 'UNCERTAIN';

export interface EnsembleVote {
  callIndex: number;
  verdict: DenialRisk;
  confidence: number;
}

export interface RcmExemplarSummary {
  exemplarId: string;
  payerId: string;
  cptCodes: string[];
  outcome: string;
  similarityScore: number;
  rationaleExcerpt?: string;
}

export interface AuditReport {
  riskScore: number; // 0.0 – 1.0
  denialRisk: DenialRisk;
  denialCodes: string[]; // e.g. ["CO-197", "CARC-27"]
  rationale: string[]; // Ordered Chain-of-Thought reasoning steps
  exemplarsUsed: RcmExemplarSummary[]; // k-NN retrieved historical cases
  appealDraft?: string;
  ensembleVotes: EnsembleVote[]; // Individual LLM call results
}
