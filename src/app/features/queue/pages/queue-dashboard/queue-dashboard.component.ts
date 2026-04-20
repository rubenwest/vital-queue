import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
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
export class QueueDashboardComponent implements OnInit, OnDestroy {
  readonly queueService = inject(QueueService);

  readonly tick = signal(0);
  private _intervalId: ReturnType<typeof setInterval> | undefined;

  ngOnInit(): void {
    this._intervalId = setInterval(() => this.tick.update((n: number) => n + 1), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this._intervalId);
  }

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
