import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="status-badge" [ngClass]="badgeClass">
      <span class="status-dot"></span>
      {{ displayText }}
    </span>
  `,
  styles: [`
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      padding: 0.25rem 0.625rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .status-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }

    .status-pending { background: #e0e7ff; color: #3730a3; }
    .status-processing { background: #fef3c7; color: #92400e; }
    .status-done { background: #d1fae5; color: #065f46; }
    .status-failed { background: #fee2e2; color: #991b1b; }
    .status-likely-clean { background: #d1fae5; color: #065f46; }
    .status-likely-denied { background: #fee2e2; color: #991b1b; }
    .status-uncertain { background: #fef3c7; color: #92400e; }
    .status-eligible { background: #d1fae5; color: #065f46; }
    .status-ineligible { background: #fee2e2; color: #991b1b; }
    .status-prior-auth { background: #fff7ed; color: #c2410c; }
  `]
})
export class StatusBadgeComponent {
  @Input() status: string = 'PENDING';

  get displayText(): string {
    return this.status.replace(/_/g, ' ');
  }

  get badgeClass(): string {
    const s = this.status.toUpperCase();
    switch (s) {
      case 'DONE': return 'status-done';
      case 'PROCESSING': return 'status-processing';
      case 'PENDING': return 'status-pending';
      case 'FAILED': return 'status-failed';
      case 'LIKELY_CLEAN': return 'status-likely-clean';
      case 'LIKELY_DENIED': return 'status-likely-denied';
      case 'UNCERTAIN': return 'status-uncertain';
      case 'ELIGIBLE': return 'status-eligible';
      case 'INELIGIBLE': return 'status-ineligible';
      case 'REQUIRES_PRIOR_AUTH': return 'status-prior-auth';
      default: return 'status-pending';
    }
  }
}
