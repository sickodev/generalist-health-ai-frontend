import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-audit-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="new-audit-stub">
      <h2>Submit New Claim for Medprompt Audit</h2>
    </div>
  `
})
export class NewAuditPageComponent {}
