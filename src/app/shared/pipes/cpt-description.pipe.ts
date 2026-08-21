import { Pipe, PipeTransform } from '@angular/core';

export const CPT_MAP: Record<string, string> = {
  '99213': 'Office O/P Est Low-Mod (20-29 min)',
  '99214': 'Office O/P Est Mod-High (30-39 min)',
  '99215': 'Office O/P Est High (40-54 min)',
  '99203': 'Office O/P New Low-Mod (30-44 min)',
  '99204': 'Office O/P New Mod-High (45-59 min)',
  '73721': 'MRI Knee Joint without Contrast',
  '72148': 'MRI Lumbar Spine without Contrast',
  '70450': 'CT Head/Brain without Contrast',
  '93000': 'Electrocardiogram (ECG/EKG) 12-lead',
  '93306': 'Echocardiography Complete TTE with Doppler',
  '43239': 'Upper GI Endoscopy Diagnostic/Biopsy',
  '45378': 'Diagnostic Colonoscopy'
};

@Pipe({
  name: 'cptDescription',
  standalone: true
})
export class CptDescriptionPipe implements PipeTransform {
  transform(code: string | undefined | null): string {
    if (!code) return '';
    const clean = code.trim();
    return CPT_MAP[clean] ?? `CPT ${clean}`;
  }
}
