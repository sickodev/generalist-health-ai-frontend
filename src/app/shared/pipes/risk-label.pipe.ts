import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'riskLabel',
  standalone: true
})
export class RiskLabelPipe implements PipeTransform {
  transform(score: number | undefined | null, format: 'full' | 'short' = 'full'): string {
    if (score === undefined || score === null) {
      return format === 'short' ? 'UNKNOWN' : 'UNKNOWN RISK';
    }

    if (score >= 0.7) {
      return format === 'short' ? 'HIGH RISK' : 'HIGH RISK — LIKELY DENIED';
    }
    if (score >= 0.4) {
      return format === 'short' ? 'MODERATE' : 'MODERATE RISK — REVIEW';
    }
    return format === 'short' ? 'LOW RISK' : 'LOW RISK — LIKELY CLEAN';
  }
}
