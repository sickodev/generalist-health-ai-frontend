import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../core/auth/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-toolbar class="topbar-toolbar">
      <button
        mat-icon-button
        (click)="toggleMenu.emit()"
        aria-label="Toggle navigation menu"
        class="menu-toggle-btn"
      >
        <mat-icon>menu</mat-icon>
      </button>

      <span class="app-title-tag">RCM Audit & Verification Suite</span>

      <span class="toolbar-spacer"></span>

      <!-- System Health Indicator -->
      <div class="system-status-pill">
        <span class="status-indicator-dot"></span>
        <span class="status-text">Medprompt Pipeline Active</span>
      </div>

      <!-- Quick Session Badge -->
      <div class="operator-badge">
        <mat-icon>verified</mat-icon>
        <span>{{ authService.displayName() }}</span>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .topbar-toolbar {
      background: #ffffff;
      color: var(--rcm-text-primary, #0f172a);
      border-bottom: 1px solid var(--rcm-border, #e2e8f0);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
      height: 64px;
      padding: 0 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .app-title-tag {
      font-size: 0.9375rem;
      font-weight: 600;
      color: #334155;
    }
    .toolbar-spacer {
      flex: 1;
    }
    .system-status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      color: #166534;
      font-weight: 500;
    }
    .status-indicator-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
    }
    .operator-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: #303f9f;
      background: #eef2ff;
      padding: 0.3rem 0.75rem;
      border-radius: 8px;

      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }
    @media (max-width: 768px) {
      .app-title-tag, .system-status-pill {
        display: none;
      }
    }
  `]
})
export class TopbarComponent {
  readonly authService = inject(AuthService);
  @Output() toggleMenu = new EventEmitter<void>();
}
