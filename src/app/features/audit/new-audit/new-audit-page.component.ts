import { Component, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClaimMetadata, AuditRequest, EnsembleConfig } from '../../../shared/models';
import { AuditService } from '../services/audit.service';
import { ClaimMetadataFormComponent } from './claim-metadata-form.component';
import { Edi271UploadComponent } from './edi271-upload.component';
import { ReviewSubmitComponent } from './review-submit.component';
import { SAMPLE_EDI_271 } from '../../../shared/components/file-drop-zone/file-drop-zone.component';

@Component({
  selector: 'app-new-audit-page',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    ClaimMetadataFormComponent,
    Edi271UploadComponent,
    ReviewSubmitComponent
  ],
  template: `
    <div class="new-audit-container">
      <div class="page-header">
        <div class="title-group">
          <mat-icon class="header-icon" color="primary">post_add</mat-icon>
          <div>
            <h1 class="page-title">Submit Claim for Medprompt Audit</h1>
            <p class="page-sub">
              Dynamic Few-Shot Matching · Automated Chain-of-Thought Rationale · Input-Shuffle Consensus
            </p>
          </div>
        </div>
      </div>

      <mat-card class="stepper-card rcm-card">
        <mat-stepper [linear]="true" #stepper class="audit-stepper">
          <!-- Step 1: Claim Administrative Metadata -->
          <mat-step [completed]="isStep1Completed()">
            <ng-template matStepLabel>Claim Metadata</ng-template>
            <app-claim-metadata-form
              [initialData]="claimData()"
              [initialIncludeEdi]="includeEdi()"
              (dataSubmitted)="onStep1Completed($event)"
            ></app-claim-metadata-form>
          </mat-step>

          <!-- Step 2: EDI 271 Benefit Upload (if toggle on) -->
          @if (includeEdi()) {
            <mat-step [completed]="isStep2Completed()">
              <ng-template matStepLabel>EDI 271 Eligibility Data</ng-template>
              <app-edi271-upload
                [payload]="ediPayload()"
                (payloadChanged)="onEdiPayloadChanged($event)"
                (backClicked)="stepper.previous()"
                (continueClicked)="stepper.next()"
              ></app-edi271-upload>
            </mat-step>
          }

          <!-- Step 3: Review & Medprompt Ensemble Configuration -->
          <mat-step>
            <ng-template matStepLabel>Review & Ensemble</ng-template>
            <app-review-submit
              [claim]="claimData()"
              [hasEdi]="includeEdi() && !!ediPayload()"
              [isSubmitting]="isSubmitting()"
              (backClicked)="stepper.previous()"
              (submitAuditClicked)="onSubmitAudit($event)"
            ></app-review-submit>
          </mat-step>
        </mat-stepper>
      </mat-card>
    </div>
  `,
  styles: [`
    .new-audit-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .header-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      margin: 0 0 0.25rem 0;
    }
    .page-sub {
      font-size: 0.875rem;
      color: var(--rcm-text-secondary, #64748b);
      margin: 0;
    }
    .stepper-card {
      padding: 1.5rem;
      border-radius: 16px;
      background: #ffffff;
    }
    .audit-stepper {
      background: transparent;
    }
  `]
})
export class NewAuditPageComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  private readonly auditService = inject(AuditService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly claimData = signal<ClaimMetadata>({
    payerId: 'AETNA',
    cptCodes: ['73721'],
    icd10Codes: ['M25.561', 'M54.5'],
    placeOfService: '11',
    dateOfService: new Date().toISOString(),
    billedAmount: 1250,
    inNetwork: true
  });

  readonly includeEdi = signal<boolean>(true);
  readonly ediPayload = signal<string>(SAMPLE_EDI_271);
  readonly isStep1Completed = signal<boolean>(false);
  readonly isStep2Completed = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  onStep1Completed(data: { claim: ClaimMetadata; includeEdi271: boolean }): void {
    this.claimData.set(data.claim);
    this.includeEdi.set(data.includeEdi271);
    this.isStep1Completed.set(true);
    setTimeout(() => this.stepper.next(), 50);
  }

  onEdiPayloadChanged(payload: string): void {
    this.ediPayload.set(payload);
    this.isStep2Completed.set(!!payload.trim());
  }

  onSubmitAudit(config: EnsembleConfig): void {
    this.isSubmitting.set(true);

    const request: AuditRequest = {
      claim: this.claimData(),
      edi271Payload: this.includeEdi() ? this.ediPayload() : undefined,
      config
    };

    this.auditService.submitAudit(request).subscribe({
      next: ({ jobId }) => {
        this.snackBar.open(`Audit Job ${jobId} initiated successfully.`, 'View Job', {
          duration: 3000,
          panelClass: ['snack-success']
        });
        this.router.navigate(['/audit/jobs', jobId]);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.snackBar.open('Failed to submit audit job. Please try again.', 'Close', {
          duration: 4000,
          panelClass: ['snack-error']
        });
      }
    });
  }
}
