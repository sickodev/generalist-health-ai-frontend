import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-stub">
      <h2>RCM Executive Dashboard</h2>
      <p>Loading analytics & KPI overview...</p>
    </div>
  `
})
export class DashboardPageComponent {}
