import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuditService } from '../audit/services/audit.service';
import { AuditJob } from '../../shared/models';
import { KpiCardComponent } from './kpi-card.component';
import { DenialTrendChartComponent } from './denial-trend-chart.component';
import { RecentAuditsTableComponent } from './recent-audits-table.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    KpiCardComponent,
    DenialTrendChartComponent,
    RecentAuditsTableComponent
  ],
  template: `
    <div class="dashboard-page">
      <!-- Page Header & Fast Actions -->
      <div class="dashboard-header">
        <div>
          <h1 class="page-title">RCM Executive Dashboard</h1>
          <p class="page-sub">Medprompt Few-Shot Denial Prediction & Insurance Verification Engine</p>
        </div>
        <div class="header-actions">
          <a mat-stroked-button color="primary" routerLink="/verify" class="action-btn">
            <mat-icon>verified</mat-icon> PA Eligibility
          </a>
          <a mat-flat-button color="primary" routerLink="/audit/new" class="action-btn">
            <mat-icon>add_chart</mat-icon> New Claim Audit
          </a>
        </div>
      </div>

      <!-- KPI Metric Cards Grid -->
      <div class="kpi-grid">
        <app-kpi-card
          title="Audits Processed Today"
          [value]="totalAudits()"
          subtitle="Real-time claims audited"
          icon="fact_check"
          colorScheme="scheme-primary"
          [badgeText]="'+14% vs avg'"
          badgeClass="badge-neutral"
        ></app-kpi-card>

        <app-kpi-card
          title="Likely Denied Flags"
          [value]="deniedCount()"
          subtitle="Pre-submission risk identified"
          icon="warning"
          colorScheme="scheme-danger"
          [badgeText]="deniedPercent() + '% denial risk'"
          badgeClass="badge-danger"
        ></app-kpi-card>

        <app-kpi-card
          title="Likely Clean Claims"
          [value]="cleanCount()"
          subtitle="High confidence direct submission"
          icon="check_circle"
          colorScheme="scheme-success"
          [badgeText]="(100 - deniedPercent()) + '% clean'"
          badgeClass="badge-success"
        ></app-kpi-card>

        <app-kpi-card
          title="Avg Predicted Denial Risk"
          [value]="(avgRiskScore() * 100 | number:'1.0-0') + '%'"
          subtitle="Consensus Medprompt score"
          icon="speed"
          colorScheme="scheme-accent"
          [badgeText]="'k=4 Ensemble'"
          badgeClass="badge-neutral"
        ></app-kpi-card>
      </div>

      <!-- Denial Trend Analytics Chart -->
      <app-denial-trend-chart></app-denial-trend-chart>

      <!-- Recent Audits Table Feed -->
      <app-recent-audits-table [jobs]="recentJobs()"></app-recent-audits-table>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      margin: 0 0 0.25rem 0;
    }
    .page-sub {
      font-size: 0.875rem;
      color: var(--rcm-text-secondary, #64748b);
      margin: 0;
    }
    .header-actions {
      display: flex;
      gap: 0.75rem;
    }
    .action-btn {
      font-weight: 600;
      border-radius: 8px;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  private readonly auditService = inject(AuditService);

  readonly recentJobs = signal<AuditJob[]>([]);

  readonly totalAudits = computed(() => this.recentJobs().length);

  readonly deniedCount = computed(() =>
    this.recentJobs().filter(j => j.report?.denialRisk === 'LIKELY_DENIED').length
  );

  readonly cleanCount = computed(() =>
    this.recentJobs().filter(j => j.report?.denialRisk === 'LIKELY_CLEAN').length
  );

  readonly deniedPercent = computed(() => {
    const total = this.totalAudits();
    return total > 0 ? Math.round((this.deniedCount() / total) * 100) : 0;
  });

  readonly avgRiskScore = computed(() => {
    const jobs = this.recentJobs();
    const scored = jobs.filter(j => j.report && j.report.riskScore !== undefined);
    if (!scored.length) return 0;
    const sum = scored.reduce((acc, curr) => acc + (curr.report?.riskScore ?? 0), 0);
    return sum / scored.length;
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.auditService.getRecentJobs(20).subscribe({
      next: (jobs) => this.recentJobs.set(jobs),
      error: () => this.recentJobs.set([])
    });
  }
}
