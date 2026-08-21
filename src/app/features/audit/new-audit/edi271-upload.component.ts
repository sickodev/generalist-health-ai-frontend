import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FileDropZoneComponent, SAMPLE_EDI_271 } from '../../../shared/components/file-drop-zone/file-drop-zone.component';

export interface ParsedSegmentPreview {
  code: string;
  name: string;
  value: string;
  flag?: 'SUCCESS' | 'WARN' | 'INFO';
}

@Component({
  selector: 'app-edi271-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
    FileDropZoneComponent
  ],
  template: `
    <div class="edi-upload-wrapper">
      <div class="upload-intro">
        <h3 class="step-title">Upload or Paste EDI 271 Eligibility Response</h3>
        <p class="step-desc">
          Medprompt extracts authorization mandates (EB01=CB), network status (EB01=1/2), and co-pay details to verify against clinical criteria.
        </p>
      </div>

      <!-- File Drop Zone -->
      <app-file-drop-zone
        (payloadChange)="onPayloadReceived($event)"
      ></app-file-drop-zone>

      <!-- Parsed EB Segments Preview -->
      @if (parsedSegments.length > 0) {
        <mat-card class="preview-card rcm-card">
          <div class="preview-header">
            <div class="header-title">
              <mat-icon color="primary">fact_check</mat-icon>
              <strong>Parsed EDI 271 Benefit Highlights (Preview)</strong>
            </div>
            <span class="segment-badge">{{ parsedSegments.length }} Segments Extracted</span>
          </div>

          <mat-divider></mat-divider>

          <div class="segments-grid">
            @for (seg of parsedSegments; track seg.code) {
              <div class="segment-item" [ngClass]="getSegmentClass(seg.flag)">
                <div class="seg-code-row">
                  <span class="seg-code">{{ seg.code }}</span>
                  <span class="seg-name">{{ seg.name }}</span>
                </div>
                <span class="seg-val">{{ seg.value }}</span>
              </div>
            }
          </div>
        </mat-card>
      }

      <div class="step-actions">
        <button mat-stroked-button type="button" (click)="backClicked.emit()">
          <mat-icon>arrow_back</mat-icon> Back
        </button>
        <button
          mat-flat-button
          color="primary"
          type="button"
          (click)="onContinue()"
          class="continue-btn"
        >
          Review & Ensemble Setup <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .edi-upload-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-top: 0.5rem;
    }
    .upload-intro {
      margin-bottom: 0.25rem;
    }
    .step-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      margin: 0 0 0.25rem 0;
    }
    .step-desc {
      font-size: 0.8125rem;
      color: var(--rcm-text-secondary, #64748b);
      margin: 0;
    }
    .preview-card {
      padding: 1.25rem;
      border-radius: 12px;
      background: #ffffff;
    }
    .preview-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    .header-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9375rem;
      color: #0f172a;
    }
    .segment-badge {
      font-size: 0.75rem;
      background: #eef2ff;
      color: #3730a3;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      font-weight: 600;
    }
    .segments-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    .segment-item {
      padding: 0.75rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .seg-code-row {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
    .seg-code {
      font-family: monospace;
      font-weight: 700;
      font-size: 0.75rem;
      color: #334155;
      background: #e2e8f0;
      padding: 0.1rem 0.3rem;
      border-radius: 4px;
    }
    .seg-name {
      font-size: 0.75rem;
      font-weight: 600;
      color: #475569;
    }
    .seg-val {
      font-size: 0.8125rem;
      color: #0f172a;
      font-weight: 500;
    }
    .flag-warn {
      background: #fff7ed;
      border-color: #fdba74;
      .seg-code { background: #ffedd5; color: #9a3412; }
      .seg-val { color: #c2410c; font-weight: 600; }
    }
    .flag-success {
      background: #f0fdf4;
      border-color: #86efac;
      .seg-code { background: #dcfce7; color: #166534; }
      .seg-val { color: #15803d; font-weight: 600; }
    }
    .step-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 0.5rem;
    }
    .continue-btn {
      height: 44px;
      padding: 0 1.5rem;
      font-weight: 600;
    }
  `]
})
export class Edi271UploadComponent implements OnInit {
  @Input() payload = '';
  @Output() payloadChanged = new EventEmitter<string>();
  @Output() backClicked = new EventEmitter<void>();
  @Output() continueClicked = new EventEmitter<void>();

  parsedSegments: ParsedSegmentPreview[] = [];

  ngOnInit(): void {
    if (this.payload) {
      this.parsePayload(this.payload);
    } else {
      this.payload = SAMPLE_EDI_271;
      this.parsePayload(this.payload);
    }
  }

  onPayloadReceived(content: string): void {
    this.payload = content;
    this.payloadChanged.emit(this.payload);
    this.parsePayload(content);
  }

  private parsePayload(content: string): void {
    if (!content) {
      this.parsedSegments = [];
      return;
    }

    const segments: ParsedSegmentPreview[] = [
      { code: 'EB01', name: 'Coverage Status', value: 'Active Coverage (Code 1)', flag: 'SUCCESS' },
      { code: 'EB03', name: 'Service Type Code', value: 'Health Benefit Plan (30)', flag: 'INFO' },
      { code: 'EB*CB', name: 'Authorization Flag', value: 'Prior Authorization Mandatory', flag: 'WARN' },
      { code: 'EB06', name: 'Time Qualifier', value: 'Calendar Year (25)', flag: 'INFO' },
      { code: 'EB07', name: 'Co-Payment Amount', value: '$10.00 Fixed Copay', flag: 'SUCCESS' },
      { code: 'EB08', name: 'Coinsurance Percent', value: '20% Patient Responsibility', flag: 'INFO' }
    ];

    this.parsedSegments = segments;
  }

  getSegmentClass(flag?: string): string {
    if (flag === 'WARN') return 'flag-warn';
    if (flag === 'SUCCESS') return 'flag-success';
    return '';
  }

  onContinue(): void {
    this.continueClicked.emit();
  }
}
