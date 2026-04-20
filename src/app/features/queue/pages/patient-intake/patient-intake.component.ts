import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-patient-intake',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p>Patient intake — coming soon</p>`,
})
export class PatientIntakeComponent {}
