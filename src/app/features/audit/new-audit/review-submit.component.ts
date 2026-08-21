import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { ClaimMetadata, EnsembleConfig } from '../../../shared/models';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { CptDescriptionPipe } from '../../../shared/pipes/cpt-description.pipe';

@Component({
  selector: 'app-review-submit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSliderModule,
    MatDividerModule,
    CurrencyFormatPipe,
    CptDescriptionPipe
  ],
  template: `
    <div class="review-wrapper">
      <!-- Target Claim Summary Card -->
      <mat-card class="summary-card rcm-card">
        <div class="card-header-row">
          <div class="title-group">
            <mat-icon color="primary">receipt_long</mat-icon>
            <h3 class="section-title">Claim Audit Review</h3>
          </div>
          <span class="payer-badge">{{ claim.payerId }}</span>
        </div>

        <mat-divider></mat-divider>

        <div class="summary-grid">
          <div class="summary-item">
            <span class="item-label">Place of Service</span>
            <span class="item-value">Code {{ claim.placeOfService }}</span>
          </div>

          <div class="summary-item">
            <span class="item-label">Date of Service</span>
            <span class="item-value">{{ claim.dateOfService | date:'mediumDate' }}</span>
          </div>

          <div class="summary-item">
            <span class="item-label">Billed Amount</span>
            <span class="item-value highlight-amount">{{ claim.billedAmount | currencyFormat }}</span>
          </div>

          <div class="summary-item">
            <span class="item-label">EDI 271 Attached</span>
            <span class="item-value">
              <span class="edi-status-badge" [class.badge-attached]="hasEdi" [class.badge-none]="!hasEdi">
                {{ hasEdi ? 'Yes (X12 Parsed)' : 'None (Metadata Only)' }}
              </span>
            </span>
          </div>
        </div>

        <!-- CPT Codes List -->
        <div class="code-block">
          <span class="block-label">CPT Procedure Codes:</span>
          <div class="chips-row">
            @for (cpt of claim.cptCodes; track cpt) {
              <span class="cpt-chip">
                <strong>{{ cpt }}</strong> ({{ cpt | cptDescription }})
              </span>
            }
          </div>
        </div>

        <!-- ICD-10 List -->
        <div class="code-block">
          <span class="block-label">ICD-10 Diagnoses:</span>
          <div class="chips-row">
            @for (icd of claim.icd10Codes; track icd) {
              <span class="icd-chip">
                <strong>{{ icd }}</strong>
              </span>
            }
          </div>
        </div>
      </mat-card>

      <!-- Medprompt Ensemble Configuration Card -->
      <mat-card class="config-card rcm-card">
        <div class="card-header-row">
          <div class="title-group">
            <mat-icon color="accent">tune</mat-icon>
            <h3 class="section-title">Medprompt Pipeline Parameters</h3>
          </div>
          <span class="config-badge">Zero-Shot vs Medprompt Ensemble</span>
        </div>

        <mat-divider></mat-divider>

        <div class="sliders-container">
          <!-- Dynamic Few-Shot Slider (k) -->
          <div class="slider-row">
            <div class="slider-info">
              <strong>Dynamic Few-Shot Exemplars (k-NN Retrieval)</strong>
              <span class="slider-desc">Number of semantically similar historical claims retrieved from pgvector</span>
            </div>
            <div class="slider-control">
              <mat-slider min="3" max="5" step="1" discrete>
                <input matSliderThumb [(ngModel)]="config.kNearestNeighbors" />
              </mat-slider>
              <span class="slider-val-pill">k = {{ config.kNearestNeighbors }}</span>
            </div>
          </div>

          <!-- Input-Shuffle Ensemble Size Slider (N) -->
          <div class="slider-row">
            <div class="slider-info">
              <strong>Input-Shuffle Ensemble Size (N Parallel Runs)</strong>
              <span class="slider-desc">Number of randomized prompt permutations submitted to Gemini via virtual threads</span>
            </div>
            <div class="slider-control">
              <mat-slider min="3" max="5" step="1" discrete>
                <input matSliderThumb [(ngModel)]="config.ensembleSize" />
              </mat-slider>
              <span class="slider-val-pill">N = {{ config.ensembleSize }}</span>
            </div>
          </div>
        </div>
      </mat-card>

      <!-- Navigation & Submit Controls -->
      <div class="submit-actions">
        <button mat-stroked-button type="button" (click)="backClicked.emit()">
          <mat-icon>arrow_back</mat-icon> Back
        </button>
        <button
          mat-flat-button
          color="primary"
          type="button"
          (click)="onSubmit()"
          [disabled]="isSubmitting"
          class="submit-audit-btn"
        >
          @if (isSubmitting) {
            <span>Submitting Audit Pipeline...</span>
          } @else {
            <mat-icon>rocket_launch</mat-icon>
            <span>Submit for Medprompt Audit</span>
          }
        </button>
      </div>
    </div>
  `,
  styles: [`
    .review-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-top: 0.5rem;
    }
    .summary-card, .config-card {
      padding: 1.25rem;
      border-radius: 14px;
      background: #ffffff;
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .section-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      margin: 0;
    }
    .payer-badge {
      font-size: 0.75rem;
      font-weight: 700;
      background: #eef2ff;
      color: #3730a3;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
    }
    .config-badge {
      font-size: 0.6875rem;
      font-weight: 600;
      background: #f1f5f9;
      color: #475569;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin: 1rem 0;
    }
    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .item-label {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
      text-transform: uppercase;
      font-weight: 600;
    }
    .item-value {
      font-size: 0.9375rem;
      color: #0f172a;
      font-weight: 600;
    }
    .highlight-amount {
      color: #0f766e;
      font-size: 1.125rem;
    }
    .edi-status-badge {
      font-size: 0.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .badge-attached {
      background: #dcfce7;
      color: #166534;
    }
    .badge-none {
      background: #f1f5f9;
      color: #64748b;
    }
    .code-block {
      margin-top: 0.75rem;
    }
    .block-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 0.375rem;
      display: block;
    }
    .chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .cpt-chip {
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #3730a3;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.8125rem;
    }
    .icd-chip {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.8125rem;
    }
    .sliders-container {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-top: 1rem;
    }
    .slider-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .slider-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 260px;
    }
    .slider-desc {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
    }
    .slider-control {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 240px;
    }
    .slider-val-pill {
      font-family: monospace;
      font-weight: 700;
      background: #e0f2f1;
      color: #00796b;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.8125rem;
    }
    .submit-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    .submit-audit-btn {
      height: 48px;
      padding: 0 2rem;
      font-weight: 700;
      font-size: 0.9375rem;
      border-radius: 10px;
    }
  `]
})
export class ReviewSubmitComponent {
  @Input() claim: ClaimMetadata = {
    payerId: 'AETNA',
    cptCodes: ['73721'],
    icd10Codes: ['M25.561'],
    placeOfService: '11',
    dateOfService: new Date().toISOString(),
    billedAmount: 1250
  };

  @Input() hasEdi = false;
  @Input() isSubmitting = false;

  @Output() backClicked = new EventEmitter<void>();
  @Output() submitAuditClicked = new EventEmitter<EnsembleConfig>();

  config: EnsembleConfig = {
    kNearestNeighbors: 4,
    ensembleSize: 4
  };

  onSubmit(): void {
    this.submitAuditClicked.emit(this.config);
  }
}
