import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { RouterLink } from '@angular/router';
import { QueueService } from '../../services/queue.service';
import { PatientRowComponent } from '../../components/patient-row/patient-row.component';
import { TriageLevel } from '../../models/patient.model';

@Component({
  selector: 'app-queue-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PatientRowComponent],
  templateUrl: './queue-dashboard.component.html',
  styleUrl: './queue-dashboard.component.scss',
})
export class QueueDashboardComponent {
  protected readonly queueService = inject(QueueService);

  readonly tick = toSignal(interval(1000), { initialValue: 0 });

  onTriageLevelChanged(patientId: string, level: TriageLevel): void {
    this.queueService.updateTriageLevel(patientId, level);
  }

  onAdmit(patientId: string): void {
    this.queueService.admit(patientId);
  }

  onDischarge(patientId: string): void {
    this.queueService.discharge(patientId);
  }
}
