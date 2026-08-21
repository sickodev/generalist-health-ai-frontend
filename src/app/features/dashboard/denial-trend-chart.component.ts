import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

export interface TrendDataPoint {
  day: string;
  total: number;
  denied: number;
  clean: number;
  rate: number; // percentage e.g. 18.5
}

@Component({
  selector: 'app-denial-trend-chart',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="chart-card">
      <div class="chart-header">
        <div class="title-group">
          <mat-icon color="primary">trending_up</mat-icon>
          <div>
            <h3 class="chart-title">7-Day Claim Denial Rate & Audit Volume</h3>
            <span class="chart-sub">Rolling daily trend across all monitored payers</span>
          </div>
        </div>
        <div class="legend-group">
          <span class="legend-item"><span class="legend-dot dot-total"></span> Audited</span>
          <span class="legend-item"><span class="legend-dot dot-denied"></span> Denied Risk</span>
          <span class="legend-item"><span class="legend-dot dot-clean"></span> Clean</span>
        </div>
      </div>

      <!-- Responsive SVG Trend Line & Bar Visualization -->
      <div class="svg-chart-container">
        <div class="bars-container">
          @for (point of data; track point.day) {
            <div class="bar-column">
              <div class="bar-track">
                <div
                  class="bar-segment bar-clean"
                  [style.height.%]="(point.clean / maxVolume) * 100"
                  [title]="point.clean + ' Clean claims'"
                ></div>
                <div
                  class="bar-segment bar-denied"
                  [style.height.%]="(point.denied / maxVolume) * 100"
                  [title]="point.denied + ' Denied claims (' + point.rate + '%)'"
                ></div>
              </div>
              <span class="day-label">{{ point.day }}</span>
              <span class="rate-label">{{ point.rate }}%</span>
            </div>
          }
        </div>
      </div>
    </mat-card>
  `,
  styles: [`
    .chart-card {
      border-radius: 14px;
      padding: 1.25rem;
      border: 1px solid var(--rcm-border, #e2e8f0);
      background: var(--rcm-surface, #ffffff);
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .chart-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      margin: 0;
    }
    .chart-sub {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
    }
    .legend-group {
      display: flex;
      gap: 1rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: #475569;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 2px;
    }
    .dot-total { background: #cbd5e1; }
    .dot-denied { background: #ef4444; }
    .dot-clean { background: #22c55e; }

    .svg-chart-container {
      height: 200px;
      display: flex;
      align-items: flex-end;
      padding-top: 1rem;
    }
    .bars-container {
      display: flex;
      justify-content: space-around;
      width: 100%;
      height: 100%;
      align-items: flex-end;
      gap: 0.75rem;
    }
    .bar-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      flex: 1;
    }
    .bar-track {
      flex: 1;
      width: 32px;
      background: #f1f5f9;
      border-radius: 6px 6px 0 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      overflow: hidden;
    }
    .bar-segment {
      width: 100%;
      transition: height 0.6s ease;
    }
    .bar-clean {
      background: #4ade80;
    }
    .bar-denied {
      background: #f87171;
    }
    .day-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      margin-top: 0.5rem;
    }
    .rate-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: #b91c1c;
    }
  `]
})
export class DenialTrendChartComponent {
  @Input() data: TrendDataPoint[] = [
    { day: 'Mon', total: 64, denied: 12, clean: 52, rate: 18.8 },
    { day: 'Tue', total: 78, denied: 14, clean: 64, rate: 17.9 },
    { day: 'Wed', total: 85, denied: 21, clean: 64, rate: 24.7 },
    { day: 'Thu', total: 92, denied: 18, clean: 74, rate: 19.5 },
    { day: 'Fri', total: 110, denied: 25, clean: 85, rate: 22.7 },
    { day: 'Sat', total: 34, denied: 5, clean: 29, rate: 14.7 },
    { day: 'Sun', total: 28, denied: 4, clean: 24, rate: 14.3 }
  ];

  get maxVolume(): number {
    return Math.max(...this.data.map(d => d.total), 120);
  }
}
