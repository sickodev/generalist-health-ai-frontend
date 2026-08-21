import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exemplar-manager-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="exemplars-stub">
      <h2>Exemplar Knowledge Base & Ingestion Manager</h2>
    </div>
  `
})
export class ExemplarManagerPageComponent {}
