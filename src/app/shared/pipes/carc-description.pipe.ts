import { Pipe, PipeTransform } from '@angular/core';

export const CARC_DESCRIPTIONS: Record<string, string> = {
  'CO-197': 'Precertification/authorization/notification/prior-auth absent',
  'CARC-27': 'Expenses incurred after coverage was terminated',
  'CO-16': 'Claim lacks information or has billing submission errors',
  'CO-18': 'Exact duplicate claim/service previously adjudicated',
  'CO-29': 'Time limit for filing has expired',
  'CO-50': 'Non-covered services because not deemed medical necessity',
  'CO-96': 'Non-covered charge(s) under payer policy',
  'CO-97': 'The benefit for this service is included in the payment/allowance for another service',
  'CO-252': 'An attachment or other documentation is required to adjudicate this claim',
  'CARC-1': 'Deductible amount',
  'CARC-2': 'Coinsurance amount',
  'CARC-3': 'Co-payment amount'
};

@Pipe({
  name: 'carcDescription',
  standalone: true
})
export class CarcDescriptionPipe implements PipeTransform {
  transform(code: string | undefined | null): string {
    if (!code) return '';
    const normalized = code.trim().toUpperCase();
    return CARC_DESCRIPTIONS[normalized] ?? 'Claim adjustment / denial reason';
  }
}
