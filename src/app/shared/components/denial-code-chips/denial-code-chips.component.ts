import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CarcDescriptionPipe } from '../../pipes/carc-description.pipe';

@Component({
  selector: 'app-denial-code-chips',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatTooltipModule, CarcDescriptionPipe],
  template: `
    <div class="denial-chips-wrapper">
      @if (codes && codes.length > 0) {
        <mat-chip-set class="chips-set">
          @for (code of codes; track code) {
            <mat-chip
              class="denial-chip"
              [matTooltip]="code | carcDescription"
              matTooltipPosition="above"
            >
              <span class="code-text">{{ code }}</span>
              <span class="info-dot">ℹ</span>
            </mat-chip>
          }
        </mat-chip-set>
      } @else {
        <span class="no-codes-text">None (Clean Claim)</span>
      }
    </div>
  `,
  styles: [`
    .denial-chips-wrapper {
      display: inline-flex;
      align-items: center;
    }
    .chips-set {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }
    .denial-chip {
      background: #fee2e2 !important;
      border: 1px solid #fca5a5 !important;
      color: #991b1b !important;
      font-weight: 600;
      font-size: 0.8125rem;
      cursor: help;
    }
    .code-text {
      margin-right: 0.25rem;
    }
    .info-dot {
      font-size: 0.6875rem;
      opacity: 0.75;
    }
    .no-codes-text {
      font-size: 0.875rem;
      color: #15803d;
      font-weight: 500;
    }
  `]
})
export class DenialCodeChipsComponent {
  @Input() codes: string[] = [];
}
