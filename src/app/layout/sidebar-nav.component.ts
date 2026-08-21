import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule
  ],
  template: `
    <div class="sidebar-container">
      <!-- Brand Header -->
      <div class="brand-header">
        <div class="brand-logo-icon">
          <mat-icon>local_hospital</mat-icon>
        </div>
        <div class="brand-text">
          <span class="brand-title">Health AI</span>
          <span class="brand-sub">RCM Medprompt</span>
        </div>
      </div>

      <mat-divider></mat-divider>

      <!-- Navigation Links -->
      <mat-nav-list class="nav-list">
        <a
          mat-list-item
          routerLink="/dashboard"
          routerLinkActive="active-nav-link"
          (click)="onNavigate()"
        >
          <mat-icon matListItemIcon>dashboard</mat-icon>
          <span matListItemTitle>Dashboard</span>
          <span matListItemLine class="nav-desc">Audits & KPI Trends</span>
        </a>

        <a
          mat-list-item
          routerLink="/audit/new"
          routerLinkActive="active-nav-link"
          (click)="onNavigate()"
        >
          <mat-icon matListItemIcon>post_add</mat-icon>
          <span matListItemTitle>New Claim Audit</span>
          <span matListItemLine class="nav-desc">Medprompt Denial Check</span>
        </a>

        <a
          mat-list-item
          routerLink="/verify"
          routerLinkActive="active-nav-link"
          (click)="onNavigate()"
        >
          <mat-icon matListItemIcon>verified_user</mat-icon>
          <span matListItemTitle>PA Verification</span>
          <span matListItemLine class="nav-desc">EDI 271 Eligibility</span>
        </a>

        <a
          mat-list-item
          routerLink="/exemplars"
          routerLinkActive="active-nav-link"
          (click)="onNavigate()"
        >
          <mat-icon matListItemIcon>dataset</mat-icon>
          <span matListItemTitle>Exemplar Store</span>
          <span matListItemLine class="nav-desc">Vector Knowledge Base</span>
        </a>
      </mat-nav-list>

      <div class="sidebar-spacer"></div>

      <mat-divider></mat-divider>

      <!-- Operator Profile Footer -->
      <div class="user-footer">
        <div class="user-avatar">
          <mat-icon>account_circle</mat-icon>
        </div>
        <div class="user-info">
          <span class="user-name">{{ authService.displayName() }}</span>
          <span class="user-role">{{ authService.userRole() || 'OPERATOR' }}</span>
        </div>
        <button
          mat-icon-button
          color="warn"
          (click)="authService.logout()"
          title="Sign out"
          class="logout-btn"
        >
          <mat-icon>logout</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 260px;
      background: #ffffff;
      border-right: 1px solid var(--rcm-border, #e2e8f0);
    }
    .brand-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1rem;
    }
    .brand-logo-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, #303f9f 0%, #1a237e 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;

      mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-title {
      font-size: 1.0625rem;
      font-weight: 700;
      color: var(--rcm-text-primary, #0f172a);
      line-height: 1.2;
    }
    .brand-sub {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--rcm-primary-color, #303f9f);
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .nav-list {
      padding: 0.75rem 0.5rem;
    }
    .mat-mdc-list-item {
      border-radius: 8px;
      margin-bottom: 0.25rem;
      transition: background-color 0.15s ease;

      &:hover {
        background: #f1f5f9;
      }
    }
    .active-nav-link {
      background: #eef2ff !important;
      mat-icon {
        color: var(--rcm-primary-color, #303f9f) !important;
      }
      .mdc-list-item__primary-text {
        color: var(--rcm-primary-color, #303f9f) !important;
        font-weight: 600;
      }
    }
    .nav-desc {
      font-size: 0.75rem;
      color: var(--rcm-text-secondary, #64748b);
    }
    .sidebar-spacer {
      flex: 1;
    }
    .user-footer {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      background: #f8fafc;
    }
    .user-avatar mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #64748b;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;
    }
    .user-name {
      font-size: 0.8125rem;
      font-weight: 600;
      color: #0f172a;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role {
      font-size: 0.6875rem;
      font-weight: 500;
      color: #64748b;
    }
    .logout-btn {
      width: 32px;
      height: 32px;
      line-height: 32px;
    }
  `]
})
export class SidebarNavComponent {
  readonly authService = inject(AuthService);
  @Output() navItemClicked = new EventEmitter<void>();

  onNavigate(): void {
    this.navItemClicked.emit();
  }
}
