import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AppShellComponent } from './layout/app-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard-page.component').then(m => m.DashboardPageComponent)
      },
      {
        path: 'audit',
        loadChildren: () => import('./features/audit/audit.routes').then(m => m.auditRoutes)
      },
      {
        path: 'verify',
        loadComponent: () => import('./features/verification/verification-page.component').then(m => m.VerificationPageComponent)
      },
      {
        path: 'exemplars',
        loadComponent: () => import('./features/exemplars/exemplar-manager-page.component').then(m => m.ExemplarManagerPageComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
