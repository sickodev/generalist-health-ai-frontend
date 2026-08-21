import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClaimMetadata } from '../../../shared/models';
import { CptCodeInputComponent } from '../../../shared/components/cpt-code-input/cpt-code-input.component';
import { Icd10CodeInputComponent } from '../../../shared/components/icd10-code-input/icd10-code-input.component';

export interface PayerOption {
  id: string;
  name: string;
  category: 'COMMERCIAL' | 'MEDICARE' | 'MEDICAID';
}

@Component({
  selector: 'app-claim-metadata-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    CptCodeInputComponent,
    Icd10CodeInputComponent
  ],
  template: `
    <form [formGroup]="form" class="metadata-form">
      <div class="form-grid">
        <!-- Payer Selection -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Insurance Payer</mat-label>
          <mat-select formControlName="payerId" required>
            @for (payer of payers; track payer.id) {
              <mat-option [value]="payer.id">
                {{ payer.name }} ({{ payer.category }})
              </mat-option>
            }
          </mat-select>
          <mat-icon matPrefix color="primary">business</mat-icon>
        </mat-form-field>

        <!-- Place of Service -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Place of Service (PoS)</mat-label>
          <mat-select formControlName="placeOfService" required>
            @for (pos of placeOfServiceOptions; track pos.code) {
              <mat-option [value]="pos.code">
                {{ pos.code }} - {{ pos.label }}
              </mat-option>
            }
          </mat-select>
          <mat-icon matPrefix color="primary">place</mat-icon>
        </mat-form-field>

        <!-- Date of Service -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Date of Service</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="dateOfService" required />
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <!-- Billed Amount -->
        <mat-form-field appearance="outline" class="form-field">
          <mat-label>Total Billed Amount ($)</mat-label>
          <input matInput type="number" formControlName="billedAmount" placeholder="e.g. 1450" />
          <span matPrefix>$&nbsp;</span>
        </mat-form-field>
      </div>

      <!-- CPT Codes Component -->
      <app-cpt-code-input
        [codes]="selectedCptCodes"
        (codesChange)="onCptCodesChanged($event)"
      ></app-cpt-code-input>

      <!-- ICD-10 Diagnoses Component -->
      <app-icd10-code-input
        [codes]="selectedIcd10Codes"
        (codesChange)="onIcd10CodesChanged($event)"
      ></app-icd10-code-input>

      <!-- Include EDI 271 Toggle -->
      <div class="toggle-section rcm-card">
        <mat-slide-toggle
          formControlName="includeEdi271"
          color="primary"
        >
          <span class="toggle-label">Attach EDI 271 Benefit & Eligibility Payload</span>
        </mat-slide-toggle>
        <span class="toggle-hint">Recommended: enables Medprompt to cross-check authorization requirements directly with parsed EB segments</span>
      </div>

      <div class="form-actions">
        <button
          mat-flat-button
          color="primary"
          type="button"
          (click)="onContinue()"
          [disabled]="isFormInvalid()"
          class="continue-btn"
        >
          Continue to {{ form.get('includeEdi271')?.value ? 'EDI 271 Upload' : 'Review & Submit' }}
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </form>
  `,
  styles: [`
    .metadata-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-top: 0.5rem;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1rem;
    }
    .form-field {
      width: 100%;
    }
    .toggle-section {
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      background: #f8fafc;
      border: 1px solid var(--rcm-border, #e2e8f0);
    }
    .toggle-label {
      font-weight: 600;
      color: var(--rcm-text-primary, #0f172a);
    }
    .toggle-hint {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
      margin-left: 2.75rem;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
    .continue-btn {
      height: 44px;
      padding: 0 1.5rem;
      font-weight: 600;
    }
  `]
})
export class ClaimMetadataFormComponent implements OnInit {
  @Input() initialData?: Partial<ClaimMetadata>;
  @Input() initialIncludeEdi = true;
  @Output() dataSubmitted = new EventEmitter<{ claim: ClaimMetadata; includeEdi271: boolean }>();

  selectedCptCodes: string[] = ['73721'];
  selectedIcd10Codes: string[] = ['M25.561', 'M54.5'];

  readonly payers: PayerOption[] = [
    { id: 'AETNA', name: 'Aetna Health (60054)', category: 'COMMERCIAL' },
    { id: 'BCBS', name: 'Blue Cross Blue Shield (00020)', category: 'COMMERCIAL' },
    { id: 'UHC', name: 'UnitedHealthcare (87726)', category: 'COMMERCIAL' },
    { id: 'CIGNA', name: 'Cigna Healthcare (62308)', category: 'COMMERCIAL' },
    { id: 'HUMANA', name: 'Humana Health Plan (61101)', category: 'COMMERCIAL' },
    { id: 'MEDICARE', name: 'Medicare Part B CMS (00101)', category: 'MEDICARE' }
  ];

  readonly placeOfServiceOptions = [
    { code: '11', label: 'Office / Clinic' },
    { code: '22', label: 'On-Campus Outpatient Hospital' },
    { code: '21', label: 'Inpatient Hospital' },
    { code: '23', label: 'Emergency Room - Hospital' },
    { code: '24', label: 'Ambulatory Surgical Center (ASC)' }
  ];

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      payerId: [this.initialData?.payerId || 'AETNA', Validators.required],
      placeOfService: [this.initialData?.placeOfService || '11', Validators.required],
      dateOfService: [this.initialData?.dateOfService ? new Date(this.initialData.dateOfService) : new Date(), Validators.required],
      billedAmount: [this.initialData?.billedAmount || 1250, [Validators.required, Validators.min(1)]],
      includeEdi271: [this.initialIncludeEdi]
    });

    if (this.initialData?.cptCodes?.length) {
      this.selectedCptCodes = [...this.initialData.cptCodes];
    }
    if (this.initialData?.icd10Codes?.length) {
      this.selectedIcd10Codes = [...this.initialData.icd10Codes];
    }
  }

  onCptCodesChanged(codes: string[]): void {
    this.selectedCptCodes = codes;
  }

  onIcd10CodesChanged(codes: string[]): void {
    this.selectedIcd10Codes = codes;
  }

  isFormInvalid(): boolean {
    return this.form.invalid || this.selectedCptCodes.length === 0 || this.selectedIcd10Codes.length === 0;
  }

  onContinue(): void {
    if (this.isFormInvalid()) return;

    const val = this.form.value;
    const claim: ClaimMetadata = {
      payerId: val.payerId,
      placeOfService: val.placeOfService,
      dateOfService: val.dateOfService ? new Date(val.dateOfService).toISOString() : new Date().toISOString(),
      billedAmount: Number(val.billedAmount),
      cptCodes: this.selectedCptCodes,
      icd10Codes: this.selectedIcd10Codes,
      inNetwork: true
    };

    this.dataSubmitted.emit({
      claim,
      includeEdi271: val.includeEdi271
    });
  }
}
