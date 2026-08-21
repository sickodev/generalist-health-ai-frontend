import { Routes } from '@angular/router';

export const auditRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'new'
  },
  {
    path: 'new',
    loadComponent: () => import('./new-audit/new-audit-page.component').then(m => m.NewAuditPageComponent)
  },
  {
    path: 'jobs/:jobId',
    loadComponent: () => import('./job-status/job-status-page.component').then(m => m.JobStatusPageComponent)
  },
  {
    path: 'results/:jobId',
    loadComponent: () => import('./report/audit-report-page.component').then(m => m.AuditReportPageComponent)
  }
];
