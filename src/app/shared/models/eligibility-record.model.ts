export interface EligibilityBenefitSegment {
  segmentId: string;
  code: string; // e.g. EB01, EB02, EB03
  description: string;
  coverageLevel?: string;
  serviceTypeCode?: string;
  timePeriodQualifier?: string;
  amount?: number;
  inPlanNetwork?: 'YES' | 'NO' | 'UNKNOWN';
  authOrCertRequired?: boolean;
}

export interface EligibilityVerificationRequest {
  patientId: string;
  payerId: string;
  dateOfService: string;
  edi270Payload?: string;
  edi271Payload?: string;
}

export interface EligibilityVerificationResponse {
  verificationId: string;
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'REQUIRES_PRIOR_AUTH';
  payerId: string;
  patientId: string;
  verifiedAt: string;
  benefits: EligibilityBenefitSegment[];
}
