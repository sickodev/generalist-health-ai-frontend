import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuditJob, AuditRequest, AuditReport } from '../../../shared/models';

export const SEED_AUDIT_JOBS: AuditJob[] = [
  {
    jobId: 'job-98214-aetna',
    status: 'DONE',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 17).toISOString(),
    payerId: 'AETNA (60054)',
    cptCodes: ['73721'],
    report: {
      riskScore: 0.88,
      denialRisk: 'LIKELY_DENIED',
      denialCodes: ['CO-197'],
      rationale: [
        'Patient presents with chronic right knee pain (ICD-10 M25.561).',
        'CPT 73721 (MRI Knee without contrast) was billed.',
        'Aetna Clinical Policy Bulletin #0236 mandates documented failure of conservative therapy or pre-authorization approval.',
        'No prior authorization number or certification flag (EB01=CB) was attached in the claim record.',
        'High probability of denial under CARC CO-197 (Precertification absent).'
      ],
      exemplarsUsed: [
        {
          exemplarId: 'ex-aetna-mri-04',
          payerId: 'AETNA',
          cptCodes: ['73721'],
          outcome: 'DENIED',
          similarityScore: 0.94,
          rationaleExcerpt: 'Denied CO-197 due to missing pre-authorization.'
        },
        {
          exemplarId: 'ex-uhc-mri-12',
          payerId: 'UHC',
          cptCodes: ['73721'],
          outcome: 'DENIED',
          similarityScore: 0.89,
          rationaleExcerpt: 'Prior auth missing on advanced imaging.'
        }
      ],
      appealDraft: 'To Aetna Claims Review Department:\n\nRe: Appeal for Claim - CPT 73721\nPatient ID: DOE, JOHN (Member #W123456789)\n\nPlease reconsider the denial for CPT 73721. The patient underwent 8 weeks of supervised physical therapy without clinical improvement prior to MRI order, satisfying CPB #0236 criteria.',
      ensembleVotes: [
        { callIndex: 1, verdict: 'LIKELY_DENIED', confidence: 0.92 },
        { callIndex: 2, verdict: 'LIKELY_DENIED', confidence: 0.86 },
        { callIndex: 3, verdict: 'LIKELY_DENIED', confidence: 0.89 },
        { callIndex: 4, verdict: 'LIKELY_DENIED', confidence: 0.85 }
      ]
    }
  },
  {
    jobId: 'job-93000-bcbs',
    status: 'DONE',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
    payerId: 'BCBS (00020)',
    cptCodes: ['93000'],
    report: {
      riskScore: 0.12,
      denialRisk: 'LIKELY_CLEAN',
      denialCodes: [],
      rationale: [
        'Target claim lists CPT 93000 (12-Lead EKG) with diagnosis R07.9 (Chest pain, unspecified).',
        'Place of Service is 23 (Emergency Room).',
        'BCBS Medical Policy #104 explicitly establishes medical necessity for acute cardiac evaluation in emergency settings.',
        'No prior authorization required for emergent diagnostic evaluation.',
        'High consensus for clean claim adjudication and full reimbursement.'
      ],
      exemplarsUsed: [
        {
          exemplarId: 'ex-bcbs-ekg-01',
          payerId: 'BCBS',
          cptCodes: ['93000'],
          outcome: 'PAID',
          similarityScore: 0.96,
          rationaleExcerpt: 'Paid in full under emergency chest pain protocol.'
        }
      ],
      ensembleVotes: [
        { callIndex: 1, verdict: 'LIKELY_CLEAN', confidence: 0.95 },
        { callIndex: 2, verdict: 'LIKELY_CLEAN', confidence: 0.91 },
        { callIndex: 3, verdict: 'LIKELY_CLEAN', confidence: 0.94 },
        { callIndex: 4, verdict: 'LIKELY_CLEAN', confidence: 0.92 }
      ]
    }
  },
  {
    jobId: 'job-99214-uhc',
    status: 'DONE',
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 89).toISOString(),
    payerId: 'UNITEDHEALTHCARE (87726)',
    cptCodes: ['99214'],
    report: {
      riskScore: 0.22,
      denialRisk: 'LIKELY_CLEAN',
      denialCodes: [],
      rationale: [
        'Outpatient E&M code 99214 billed with chronic stable condition ICD-10 I10 and E11.9.',
        'Documented medical decision making aligns with Moderate Complexity criteria.',
        'In-network benefit verified via EDI 271 active coverage.',
        'Low denial probability.'
      ],
      exemplarsUsed: [
        {
          exemplarId: 'ex-uhc-em-09',
          payerId: 'UHC',
          cptCodes: ['99214'],
          outcome: 'PAID',
          similarityScore: 0.91
        }
      ],
      ensembleVotes: [
        { callIndex: 1, verdict: 'LIKELY_CLEAN', confidence: 0.88 },
        { callIndex: 2, verdict: 'LIKELY_CLEAN', confidence: 0.90 },
        { callIndex: 3, verdict: 'LIKELY_CLEAN', confidence: 0.85 },
        { callIndex: 4, verdict: 'LIKELY_CLEAN', confidence: 0.87 }
      ]
    }
  },
  {
    jobId: 'job-72148-cigna',
    status: 'DONE',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    completedAt: new Date(Date.now() - 1000 * 60 * 139).toISOString(),
    payerId: 'CIGNA (62308)',
    cptCodes: ['72148'],
    report: {
      riskScore: 0.74,
      denialRisk: 'LIKELY_DENIED',
      denialCodes: ['CO-50'],
      rationale: [
        'CPT 72148 (MRI Lumbar Spine) billed for uncomplicated low back pain (M54.5) without red flag symptoms.',
        'Cigna Coverage Policy #0152 requires documentation of neurological deficit or 6 weeks conservative therapy prior to advanced imaging.',
        'Risk of denial for lack of demonstrated medical necessity under CO-50.'
      ],
      exemplarsUsed: [
        {
          exemplarId: 'ex-cigna-spine-02',
          payerId: 'CIGNA',
          cptCodes: ['72148'],
          outcome: 'DENIED',
          similarityScore: 0.92,
          rationaleExcerpt: 'Denied for lack of prior conservative care documentation.'
        }
      ],
      appealDraft: 'To Cigna Appeals Committee:\n\nRe: Claim for Lumbar Spine MRI (CPT 72148)\n\nWe hereby request reconsideration. Clinical chart notes documenting radiculopathy and failed conservative therapy are attached.',
      ensembleVotes: [
        { callIndex: 1, verdict: 'LIKELY_DENIED', confidence: 0.81 },
        { callIndex: 2, verdict: 'LIKELY_DENIED', confidence: 0.76 },
        { callIndex: 3, verdict: 'LIKELY_DENIED', confidence: 0.83 },
        { callIndex: 4, verdict: 'LIKELY_DENIED', confidence: 0.79 }
      ]
    }
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private readonly http = inject(HttpClient);
  private readonly apiBase = environment.apiBaseUrl;

  private mockJobs: AuditJob[] = [...SEED_AUDIT_JOBS];

  submitAudit(request: AuditRequest): Observable<{ jobId: string }> {
    return this.http.post<{ jobId: string }>(`${this.apiBase}/api/v1/audit`, request).pipe(
      catchError(() => {
        // Fallback for standalone frontend demonstration
        const jobId = `job-${Date.now().toString(36)}`;
        const mockJob: AuditJob = {
          jobId,
          status: 'PROCESSING',
          createdAt: new Date().toISOString(),
          payerId: request.claim.payerId,
          cptCodes: request.claim.cptCodes
        };
        this.mockJobs.unshift(mockJob);

        // Simulate async background processing after 4 seconds
        setTimeout(() => {
          const isDenied = request.claim.cptCodes.includes('73721') || !request.edi271Payload;
          mockJob.status = 'DONE';
          mockJob.completedAt = new Date().toISOString();
          mockJob.report = {
            riskScore: isDenied ? 0.82 : 0.15,
            denialRisk: isDenied ? 'LIKELY_DENIED' : 'LIKELY_CLEAN',
            denialCodes: isDenied ? ['CO-197'] : [],
            rationale: isDenied
              ? [
                  `Claim audited for Payer ${request.claim.payerId} and CPT ${request.claim.cptCodes.join(', ')}.`,
                  'Prior authorization verification flag absent in submitted claim data.',
                  'Medprompt consensus predicts denial under CARC CO-197.'
                ]
              : [
                  `Claim audited for Payer ${request.claim.payerId} and CPT ${request.claim.cptCodes.join(', ')}.`,
                  'Clinical necessity and benefit coverage criteria satisfied.',
                  'Medprompt consensus predicts clean adjudication.'
                ],
            exemplarsUsed: [
              {
                exemplarId: 'ex-dynamic-01',
                payerId: request.claim.payerId,
                cptCodes: request.claim.cptCodes,
                outcome: isDenied ? 'DENIED' : 'PAID',
                similarityScore: 0.93,
                rationaleExcerpt: isDenied ? 'Denied for missing authorization.' : 'Paid clean in full.'
              }
            ],
            appealDraft: isDenied ? 'Appeal Letter: The service was medically necessary and urgent...' : undefined,
            ensembleVotes: [
              { callIndex: 1, verdict: isDenied ? 'LIKELY_DENIED' : 'LIKELY_CLEAN', confidence: 0.89 },
              { callIndex: 2, verdict: isDenied ? 'LIKELY_DENIED' : 'LIKELY_CLEAN', confidence: 0.85 },
              { callIndex: 3, verdict: isDenied ? 'LIKELY_DENIED' : 'LIKELY_CLEAN', confidence: 0.91 },
              { callIndex: 4, verdict: isDenied ? 'LIKELY_DENIED' : 'LIKELY_CLEAN', confidence: 0.87 }
            ]
          };
        }, 4000);

        return of({ jobId });
      })
    );
  }

  getJobStatus(jobId: string): Observable<AuditJob> {
    return this.http.get<AuditJob>(`${this.apiBase}/api/v1/jobs/${jobId}`).pipe(
      catchError(() => {
        const found = this.mockJobs.find(j => j.jobId === jobId);
        if (found) {
          return of(found);
        }
        return of(SEED_AUDIT_JOBS[0]);
      })
    );
  }

  getRecentJobs(limit = 20): Observable<AuditJob[]> {
    return this.http.get<AuditJob[]>(`${this.apiBase}/api/v1/jobs`, { params: { limit } }).pipe(
      catchError(() => {
        return of(this.mockJobs.slice(0, limit));
      })
    );
  }
}
