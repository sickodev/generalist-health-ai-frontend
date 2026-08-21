import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="kpi-card" [ngClass]="colorScheme">
      <div class="kpi-body">
        <div class="kpi-icon-wrapper">
          <mat-icon>{{ icon }}</mat-icon>
        </div>
        <div class="kpi-details">
          <span class="kpi-title">{{ title }}</span>
          <div class="kpi-value-row">
            <span class="kpi-value">{{ value }}</span>
            @if (badgeText) {
              <span class="kpi-badge" [ngClass]="badgeClass">{{ badgeText }}</span>
            }
          </div>
          <span class="kpi-subtitle">{{ subtitle }}</span>
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .kpi-card {
      border-radius: 14px;
      padding: 1.25rem;
      border: 1px solid var(--rcm-border, #e2e8f0);
      background: var(--rcm-surface, #ffffff);
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04);
      transition: transform 0.15s ease, box-shadow 0.15s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.07);
      }
    }
    .kpi-body {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .kpi-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
    .kpi-details {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .kpi-title {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--rcm-text-secondary, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .kpi-value-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
      margin: 0.25rem 0;
    }
    .kpi-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      line-height: 1.1;
    }
    .kpi-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
    }
    .kpi-subtitle {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #94a3b8);
    }

    // Color Scheme Variants
    .scheme-primary {
      .kpi-icon-wrapper { background: #eef2ff; color: #303f9f; }
    }
    .scheme-danger {
      .kpi-icon-wrapper { background: #ffebee; color: #c62828; }
    }
    .scheme-success {
      .kpi-icon-wrapper { background: #e8f5e9; color: #2e7d32; }
    }
    .scheme-accent {
      .kpi-icon-wrapper { background: #e0f2f1; color: #00897b; }
    }

    // Badge styling
    .badge-danger { background: #fee2e2; color: #991b1b; }
    .badge-success { background: #dcfce7; color: #166534; }
    .badge-neutral { background: #f1f5f9; color: #475569; }
  `]
})
export class KpiCardComponent {
  @Input() title = '';
  @Input() value: string | number = '';
  @Input() subtitle = '';
  @Input() icon = 'analytics';
  @Input() colorScheme: 'scheme-primary' | 'scheme-danger' | 'scheme-success' | 'scheme-accent' = 'scheme-primary';
  @Input() badgeText?: string;
  @Input() badgeClass = 'badge-neutral';
}
