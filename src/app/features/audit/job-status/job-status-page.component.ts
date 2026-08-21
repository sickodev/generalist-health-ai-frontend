import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-status-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="job-status-stub">
      <h2>Audit Pipeline Status</h2>
    </div>
  `
})
export class JobStatusPageComponent {}
