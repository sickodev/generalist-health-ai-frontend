import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CptDescriptionPipe } from '../../pipes/cpt-description.pipe';

@Component({
  selector: 'app-cpt-code-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CptDescriptionPipe
  ],
  template: `
    <div class="cpt-input-wrapper">
      <div class="cpt-header">
        <label class="cpt-label">CPT Procedure Codes</label>
        <span class="cpt-hint">Enter 5-digit CPT code and press Enter</span>
      </div>

      <div class="chips-container">
        @for (code of codes; track code) {
          <mat-chip-row (removed)="removeCode(code)" class="cpt-chip">
            <span class="code-badge">{{ code }}</span>
            <span class="code-title">{{ code | cptDescription }}</span>
            <button matChipRemove [attr.aria-label]="'remove ' + code">
              <mat-icon>cancel</mat-icon>
            </button>
          </mat-chip-row>
        }
      </div>

      <div class="input-actions-row">
        <mat-form-field appearance="outline" class="cpt-input-field" subscriptSizing="dynamic">
          <input
            matInput
            placeholder="e.g. 99214, 73721"
            [(ngModel)]="inputVal"
            (keydown.enter)="addCode($event)"
            maxlength="5"
          />
        </mat-form-field>
        <button mat-flat-button color="primary" type="button" (click)="addCode()" [disabled]="!inputVal.trim()">
          <mat-icon>add</mat-icon> Add Code
        </button>
      </div>

      <div class="quick-suggestions">
        <span class="suggestion-label">Quick Suggestions:</span>
        @for (preset of quickPresets; track preset.code) {
          <button
            type="button"
            class="preset-btn"
            [class.preset-active]="codes.includes(preset.code)"
            (click)="togglePreset(preset.code)"
          >
            + {{ preset.code }} ({{ preset.short }})
          </button>
        }
      </div>
    </div>
  `,
  styles: [`
    .cpt-input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .cpt-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .cpt-label {
      font-weight: 600;
      color: var(--rcm-text-primary, #0f172a);
      font-size: 0.875rem;
    }
    .cpt-hint {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
    }
    .chips-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      min-height: 38px;
    }
    .cpt-chip {
      background: #eef2ff !important;
      border: 1px solid #c7d2fe;
    }
    .code-badge {
      font-weight: 700;
      color: #3730a3;
      margin-right: 0.375rem;
    }
    .code-title {
      font-size: 0.8125rem;
      color: #475569;
    }
    .input-actions-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .cpt-input-field {
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
        background: #e0e7ff;
        border-color: #818cf8;
        color: #3730a3;
      }
    }
  `]
})
export class CptCodeInputComponent {
  @Input() codes: string[] = [];
  @Output() codesChange = new EventEmitter<string[]>();

  inputVal = '';

  readonly quickPresets = [
    { code: '99214', short: 'E&M Office' },
    { code: '73721', short: 'MRI Knee' },
    { code: '93000', short: 'EKG 12-lead' },
    { code: '72148', short: 'MRI Lumbar' },
    { code: '45378', short: 'Colonoscopy' }
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
