import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-icd10-code-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="icd10-input-wrapper">
      <div class="icd10-header">
        <label class="icd10-label">ICD-10 Diagnosis Codes</label>
        <span class="icd10-hint">Primary and secondary diagnoses</span>
      </div>

      <div class="chips-container">
        @for (code of codes; track code) {
          <mat-chip-row (removed)="removeCode(code)" class="icd-chip">
            <span class="icd-badge">{{ code }}</span>
            <button matChipRemove [attr.aria-label]="'remove ' + code">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
      </div>

      <div class="input-actions-row">
        <mat-form-field appearance="outline" class="icd-input-field" subscriptSizing="dynamic">
          <input
            matInput
            placeholder="e.g. M54.5, R07.9, I10"
            [(ngModel)]="inputVal"
            (keydown.enter)="addCode($event)"
          />
        </mat-form-field>
        <button mat-flat-button color="accent" type="button" (click)="addCode()" [disabled]="!inputVal.trim()">
          <mat-icon>add</mat-icon> Add Diagnosis
        </button>
      </div>

      <div class="quick-suggestions">
        <span class="suggestion-label">Common Diagnoses:</span>
        @for (preset of presets; track preset.code) {
          <button
            type="button"
            class="preset-btn"
            [class.preset-active]="codes.includes(preset.code)"
            (click)="togglePreset(preset.code)"
          >
            + {{ preset.code }} ({{ preset.desc }})
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .icd10-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .icd10-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .icd10-label {
      font-weight: 600;
      color: var(--rcm-text-primary, #0f172a);
      font-size: 0.875rem;
    }
    .icd10-hint {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
    }
    .chips-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      min-height: 38px;
    }
    .icd-chip {
      background: #f0fdf4 !important;
      border: 1px solid #bbf7d0;
    }
    .icd-badge {
      font-weight: 700;
      color: #166534;
      margin-right: 0.375rem;
    }
    .input-actions-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .icd-input-field {
      flex: 1;
    }
    .quick-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      align-items: center;
      margin-top: 0.25rem;
    }
    .suggestion-label {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
      font-weight: 500;
    }
    .preset-btn {
      font-size: 0.75rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 0.2rem 0.5rem;
      cursor: pointer;
      color: #475569;
      transition: all 0.15s ease;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }
      &.preset-active {
        background: #dcfce7;
        border-color: #86efac;
        color: #166534;
      }
    }
  `]
})
export class Icd10CodeInputComponent {
  @Input() codes: string[] = [];
  @Output() codesChange = new EventEmitter<string[]>();

  inputVal = '';

  readonly presets = [
    { code: 'M54.5', desc: 'Low Back Pain' },
    { code: 'R07.9', desc: 'Chest Pain Unsp' },
    { code: 'I10', desc: 'Essential HTN' },
    { code: 'M25.561', desc: 'Pain in Right Knee' },
    { code: 'E11.9', desc: 'Type 2 Diabetes' }
  ];

  addCode(event?: Event): void {
    if (event) event.preventDefault();
    const clean = this.inputVal.trim().toUpperCase();
    if (clean && !this.codes.includes(clean)) {
      this.codes = [...this.codes, clean];
      this.codesChange.emit(this.codes);
    }
    this.inputVal = '';
  }

  removeCode(code: string): void {
    this.codes = this.codes.filter(c => c !== code);
    this.codesChange.emit(this.codes);
  }

  togglePreset(code: string): void {
    if (this.codes.includes(code)) {
      this.removeCode(code);
    } else {
      this.codes = [...this.codes, code];
      this.codesChange.emit(this.codes);
    }
  }
}
