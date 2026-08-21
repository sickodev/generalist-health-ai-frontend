import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService, DEMO_AUDITOR } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-wrapper">
      <mat-card class="login-card">
        <!-- Logo & Header -->
        <div class="login-header">
          <div class="login-logo-icon">
            <mat-icon>local_hospital</mat-icon>
          </div>
          <h2 class="app-name">Generalist Health AI</h2>
          <p class="app-subtitle">Revenue Cycle Management · Medprompt Suite</p>
        </div>

        <mat-card-content>
          <!-- 1-Click Demo Quick Sign-in Section -->
          <div class="demo-box">
            <div class="demo-box-header">
              <div class="demo-title-group">
                <mat-icon class="lightning-icon">bolt</mat-icon>
                <strong>1-Click Instant Demo Sign In</strong>
              </div>
              <span class="demo-badge">Fast Access</span>
            </div>
            <p class="demo-desc">
              Sign in as <strong>{{ demoAuditor.displayName }}</strong> with pre-configured RCM operator & auditor permissions stored in IndexedDB.
            </p>
            <button
              mat-flat-button
              color="accent"
              type="button"
              class="demo-login-btn"
              (click)="onDemoLogin()"
              [disabled]="loading()"
            >
              <mat-icon>login</mat-icon> Sign In As Demo Auditor
            </button>
          </div>

          <div class="or-divider">
            <span>OR SIGN IN WITH CREDENTIALS</span>
          </div>

          <!-- Standard Credentials Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email / Operator ID</mat-label>
              <input
                matInput
                type="email"
                formControlName="username"
                placeholder="operator@generalisthealth.ai"
              />
              <mat-icon matSuffix>email</mat-icon>
              @if (loginForm.get('username')?.hasError('required') && loginForm.get('username')?.touched) {
                <mat-error>Username is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="password"
                placeholder="••••••••"
              />
              <button
                mat-icon-button
                matSuffix
                type="button"
                (click)="hidePassword.set(!hidePassword())"
                [attr.aria-label]="'Hide password'"
              >
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <button
              mat-flat-button
              color="primary"
              type="submit"
              class="submit-btn"
              [disabled]="loginForm.invalid || loading()"
            >
              @if (loading()) {
                <span>Signing in...</span>
              } @else {
                <span>Sign In</span>
              }
            </button>
          </form>
        </mat-card-content>

        <div class="login-footer">
          <mat-icon class="shield-icon">security</mat-icon>
          <span>Session secured in client-side IndexedDB with 24-hour token expiration</span>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-wrapper {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%);
    }
    .login-card {
      width: 100%;
      max-width: 460px;
      border-radius: 16px;
      padding: 1.5rem;
      background: #ffffff;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2);
    }
    .login-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .login-logo-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: linear-gradient(135deg, #303f9f 0%, #1a237e 100%);
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;

      mat-icon {
        font-size: 28px;
        width: 28px;
        height: 28px;
      }
    }
    .app-name {
      font-size: 1.375rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.25rem 0;
    }
    .app-subtitle {
      font-size: 0.8125rem;
      color: #64748b;
      margin: 0;
    }
    .demo-box {
      background: #f0fdfa;
      border: 1.5px solid #99f6e4;
      border-radius: 12px;
      padding: 1rem;
      margin-bottom: 1.25rem;
    }
    .demo-box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .demo-title-group {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      color: #0f766e;
      font-size: 0.875rem;
    }
    .lightning-icon {
      color: #f59e0b;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .demo-badge {
      font-size: 0.6875rem;
      background: #ccfbf1;
      color: #0f766e;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    .demo-desc {
      font-size: 0.75rem;
      color: #334155;
      margin: 0 0 0.75rem 0;
      line-height: 1.4;
    }
    .demo-login-btn {
      width: 100%;
      height: 40px;
      font-weight: 600;
      letter-spacing: 0.02em;
    }
    .or-divider {
      text-align: center;
      position: relative;
      margin: 1.25rem 0;

      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 1px;
        background: #e2e8f0;
      }

      span {
        position: relative;
        background: #ffffff;
        padding: 0 0.75rem;
        font-size: 0.6875rem;
        color: #94a3b8;
        font-weight: 600;
        letter-spacing: 0.05em;
      }
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .full-width {
      width: 100%;
    }
    .submit-btn {
      width: 100%;
      height: 44px;
      font-size: 0.9375rem;
      font-weight: 600;
      margin-top: 0.5rem;
    }
    .login-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      margin-top: 1.25rem;
      font-size: 0.6875rem;
      color: #94a3b8;
      text-align: center;
    }
    .shield-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #22c55e;
    }
  `]
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly demoAuditor = DEMO_AUDITOR;
  readonly loading = signal<boolean>(false);
  readonly hidePassword = signal<boolean>(true);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  async onDemoLogin(): Promise<void> {
    this.loading.set(true);
    try {
      await this.authService.loginAsDemoUser(this.demoAuditor);
      this.snackBar.open(`Welcome, ${this.demoAuditor.displayName}!`, 'OK', {
        duration: 3000,
        panelClass: ['snack-success']
      });
      this.router.navigate(['/dashboard']);
    } catch {
      this.snackBar.open('Demo sign-in failed. Please try again.', 'Close', {
        duration: 4000,
        panelClass: ['snack-error']
      });
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    const { username } = this.loginForm.value;

    try {
      await this.authService.login(username!);
      this.snackBar.open(`Welcome, ${username}!`, 'OK', {
        duration: 3000,
        panelClass: ['snack-success']
      });
      this.router.navigate(['/dashboard']);
    } catch {
      this.snackBar.open('Sign-in failed. Please check your credentials.', 'Close', {
        duration: 4000,
        panelClass: ['snack-error']
      });
    } finally {
      this.loading.set(false);
    }
  }
}
