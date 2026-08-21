import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verification-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verify-stub">
      <h2>Prior Authorization & EDI 271 Verification</h2>
    </div>
  `
})
export class VerificationPageComponent {}
