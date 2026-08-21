import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiskLabelPipe } from '../../pipes/risk-label.pipe';

@Component({
  selector: 'app-risk-gauge',
  standalone: true,
  imports: [CommonModule, RiskLabelPipe],
  template: `
    <div class="risk-gauge-card" [ngClass]="riskClass">
      <div class="svg-container">
        <svg viewBox="0 0 120 120" class="gauge-svg">
          <!-- Background track circle -->
          <circle
            cx="60"
            cy="60"
            r="48"
            class="gauge-track"
          />
          <!-- Value arc -->
          <circle
            cx="60"
            cy="60"
            r="48"
            class="gauge-value"
            [style.stroke-dasharray]="circumference"
            [style.stroke-dashoffset]="dashOffset"
            [style.stroke]="strokeColor"
          />
        </svg>
        <div class="gauge-center-content">
          <span class="percentage-number">{{ (score * 100) | number:'1.0-0' }}%</span>
          <span class="score-fraction">{{ score | number:'1.2-2' }}</span>
        </div>
      </div>
      <div class="gauge-footer">
        <span class="verdict-badge">{{ score | riskLabel }}</span>
      </div>
    </div>
  `,
  styles: [`
    .risk-gauge-card {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-radius: 16px;
      background: var(--rcm-surface, #ffffff);
      border: 1px solid var(--rcm-border, #e2e8f0);
      box-shadow: 0 2px 4px rgba(0,0,0,0.04);
      min-width: 180px;
    }

    .svg-container {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .gauge-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .gauge-track {
      fill: none;
      stroke: #f1f5f9;
      stroke-width: 10;
    }

    .gauge-value {
      fill: none;
      stroke-width: 10;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.8s ease-in-out, stroke 0.4s ease;
    }

    .gauge-center-content {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    .percentage-number {
      font-size: 1.5rem;
      font-weight: 700;
      line-height: 1.1;
      color: var(--rcm-text-primary, #0f172a);
    }

    .score-fraction {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
      font-weight: 500;
    }

    .gauge-footer {
      margin-top: 0.75rem;
    }

    .verdict-badge {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
    }

    .risk-clean {
      .verdict-badge { background: #e8f5e9; color: #2e7d32; }
    }
    .risk-moderate {
      .verdict-badge { background: #fff8e1; color: #f57f17; }
    }
    .risk-denied {
      .verdict-badge { background: #ffebee; color: #c62828; }
    }
  `]
})
export class RiskGaugeComponent {
  @Input() score: number = 0;

  readonly radius = 48;
  readonly circumference = 2 * Math.PI * 48; // ~301.59

  get dashOffset(): number {
    const clamped = Math.max(0, Math.min(1, this.score));
    return this.circumference * (1 - clamped);
  }

  get strokeColor(): string {
    if (this.score >= 0.7) return '#c62828'; // Red
    if (this.score >= 0.4) return '#f57f17'; // Amber
    return '#2e7d32'; // Green
  }

  get riskClass(): string {
    if (this.score >= 0.7) return 'risk-denied';
    if (this.score >= 0.4) return 'risk-moderate';
    return 'risk-clean';
  }
}
