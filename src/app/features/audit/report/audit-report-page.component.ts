import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-report-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="audit-report-stub">
      <h2>Medprompt Audit Report</h2>
    </div>
  `
})
export class AuditReportPageComponent {}
