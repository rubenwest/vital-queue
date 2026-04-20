import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Patient, TRIAGE_LABELS, TRIAGE_LEVELS, TriageLevel } from '../../models/patient.model';
import { WaitingTimePipe } from '@shared/pipes/waiting-time.pipe';

@Component({
  selector: 'app-patient-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, WaitingTimePipe],
  templateUrl: './patient-row.component.html',
  styleUrl: './patient-row.component.scss',
})
export class PatientRowComponent {
  readonly patient = input.required<Patient>();
  readonly tick = input<number>(0);

  readonly triageLevelChanged = output<TriageLevel>();
  readonly admit = output<void>();
  readonly discharge = output<void>();

  readonly triageLevels = TRIAGE_LEVELS;
  readonly triageLabels = TRIAGE_LABELS;

  onTriageChange(value: string): void {
    this.triageLevelChanged.emit(Number(value) as TriageLevel);
  }
}
