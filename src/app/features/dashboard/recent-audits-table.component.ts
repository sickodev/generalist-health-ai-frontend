import { Component, Input, ViewChild, AfterViewInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuditJob } from '../../shared/models';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { DenialCodeChipsComponent } from '../../shared/components/denial-code-chips/denial-code-chips.component';
import { RiskLabelPipe } from '../../shared/pipes/risk-label.pipe';

@Component({
  selector: 'app-recent-audits-table',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    StatusBadgeComponent,
    DenialCodeChipsComponent,
    RiskLabelPipe
  ],
  template: `
    <div class="table-container rcm-card">
      <div class="table-header">
        <div class="header-left">
          <mat-icon color="primary">history</mat-icon>
          <h3 class="table-title">Recent Medprompt Claim Audits</h3>
        </div>
        <span class="record-count">{{ dataSource.data.length }} claims audited</span>
      </div>

      <table mat-table [dataSource]="dataSource" class="audits-table">
        <!-- Job ID Column -->
        <ng-container matColumnDef="jobId">
          <th mat-header-cell *matHeaderCellDef>Job ID</th>
          <td mat-cell *matCellDef="let job">
            <span class="job-id-mono">{{ job.jobId }}</span>
          </td>
        </ng-container>

        <!-- Payer Column -->
        <ng-container matColumnDef="payer">
          <th mat-header-cell *matHeaderCellDef>Payer</th>
          <td mat-cell *matCellDef="let job">
            <span class="payer-badge">{{ job.payerId || 'COMMERCIAL' }}</span>
          </td>
        </ng-container>

        <!-- CPT Codes Column -->
        <ng-container matColumnDef="cpt">
          <th mat-header-cell *matHeaderCellDef>CPT Codes</th>
          <td mat-cell *matCellDef="let job">
            <div class="cpt-tag-list">
              @for (cpt of (job.cptCodes || []); track cpt) {
                <span class="cpt-mono-tag">{{ cpt }}</span>
              }
            </div>
          </td>
        </ng-container>

        <!-- Risk Score Column -->
        <ng-container matColumnDef="riskScore">
          <th mat-header-cell *matHeaderCellDef>Denial Risk</th>
          <td mat-cell *matCellDef="let job">
            @if (job.report) {
              <div class="risk-cell">
                <span
                  class="risk-percent-badge"
                  [ngClass]="getRiskColorClass(job.report.riskScore)"
                >
                  {{ (job.report.riskScore * 100) | number:'1.0-0' }}%
                </span>
                <span class="risk-label-micro">{{ job.report.riskScore | riskLabel:'short' }}</span>
              </div>
            } @else {
              <span class="evaluating-text">Evaluating...</span>
            }
          </td>
        </ng-container>

        <!-- Denial Codes Column -->
        <ng-container matColumnDef="denialCodes">
          <th mat-header-cell *matHeaderCellDef>CARC Flag</th>
          <td mat-cell *matCellDef="let job">
            <app-denial-code-chips [codes]="job.report?.denialCodes || []"></app-denial-code-chips>
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let job">
            <app-status-badge [status]="job.status"></app-status-badge>
          </td>
        </ng-container>

        <!-- Time Column -->
        <ng-container matColumnDef="time">
          <th mat-header-cell *matHeaderCellDef>Audited</th>
          <td mat-cell *matCellDef="let job">
            <span class="time-text">{{ job.createdAt | date:'shortTime' }}</span>
          </td>
        </ng-container>

        <!-- Action Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Action</th>
          <td mat-cell *matCellDef="let job">
            @if (job.status === 'DONE') {
              <a mat-stroked-button color="primary" [routerLink]="['/audit/results', job.jobId]" class="action-btn">
                <mat-icon>assessment</mat-icon> Report
              </a>
            } @else {
              <a mat-stroked-button color="accent" [routerLink]="['/audit/jobs', job.jobId]" class="action-btn">
                <mat-icon>hourglass_top</mat-icon> Status
              </a>
            }
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="table-row"></tr>
      </table>

      <mat-paginator [pageSize]="5" [pageSizeOptions]="[5, 10, 20]" showFirstLastButtons></mat-paginator>
    </div>
  `,
  styles: [`
    .table-container {
      padding: 1.25rem;
      border-radius: 14px;
      background: var(--rcm-surface, #ffffff);
      margin-top: 1.5rem;
    }
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .table-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      margin: 0;
    }
    .record-count {
      font-size: 0.8125rem;
      color: var(--rcm-text-secondary, #64748b);
      font-weight: 500;
    }
    .audits-table {
      width: 100%;
      background: transparent;
    }
    .table-row {
      transition: background-color 0.15s ease;
      &:hover {
        background: #f8fafc;
      }
    }
    .job-id-mono {
      font-family: monospace;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #334155;
    }
    .payer-badge {
      font-size: 0.75rem;
      font-weight: 600;
      background: #f1f5f9;
      color: #334155;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .cpt-tag-list {
      display: flex;
      gap: 0.25rem;
    }
    .cpt-mono-tag {
      font-family: monospace;
      font-weight: 700;
      background: #eef2ff;
      color: #3730a3;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .risk-cell {
      display: flex;
      align-items: center;
      gap: 0.375rem;
    }
    .risk-percent-badge {
      font-size: 0.8125rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 6px;
    }
    .risk-clean { background: #dcfce7; color: #166534; }
    .risk-moderate { background: #fef3c7; color: #92400e; }
    .risk-denied { background: #fee2e2; color: #991b1b; }
    .risk-label-micro {
      font-size: 0.6875rem;
      color: #64748b;
      font-weight: 600;
    }
    .time-text {
      font-size: 0.75rem;
      color: #64748b;
    }
    .evaluating-text {
      font-size: 0.75rem;
      font-style: italic;
      color: #f59e0b;
    }
    .action-btn {
      font-size: 0.75rem;
      height: 32px;
      line-height: 32px;
      padding: 0 0.75rem;
    }
  `]
})
export class RecentAuditsTableComponent implements AfterViewInit, OnChanges {
  @Input() jobs: AuditJob[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  readonly displayedColumns: string[] = [
    'jobId',
    'payer',
    'cpt',
    'riskScore',
    'denialCodes',
    'status',
    'time',
    'actions'
  ];

  dataSource = new MatTableDataSource<AuditJob>([]);

  ngOnChanges(): void {
    this.dataSource.data = this.jobs;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  getRiskColorClass(score: number): string {
    if (score >= 0.7) return 'risk-denied';
    if (score >= 0.4) return 'risk-moderate';
    return 'risk-clean';
  }
}
