import { Injectable, computed, signal } from '@angular/core';
import { Patient, PatientIntakeForm, PatientStatus, TriageLevel } from '../models/patient.model';

@Injectable()
export class QueueService {
  private readonly _patients = signal<Patient[]>([]);

  /** Active queue sorted by triage level (asc) then arrival time (asc). */
  readonly sortedQueue = computed(() =>
    this._patients()
      .filter((p) => p.status === 'waiting')
      .sort((a, b) => a.triageLevel - b.triageLevel || a.arrivalTime.getTime() - b.arrivalTime.getTime())
  );

  /** All patients, including admitted/discharged (for audit trail if needed). */
  readonly allPatients = this._patients.asReadonly();

  admit(id: string): void {
    this._updateStatus(id, 'admitted');
  }

  discharge(id: string): void {
    this._updateStatus(id, 'discharged');
  }

  addPatient(form: PatientIntakeForm): void {
    const patient: Patient = {
      id: crypto.randomUUID(),
      name: form.name,
      age: form.age,
      chiefComplaint: form.chiefComplaint,
      triageLevel: form.triageLevel,
      arrivalTime: new Date(),
      status: 'waiting',
    };
    this._patients.update((list) => [...list, patient]);
  }

  updateTriageLevel(id: string, level: TriageLevel): void {
    this._patients.update((list) =>
      list.map((p) => (p.id === id ? { ...p, triageLevel: level } : p))
    );
  }

  private _updateStatus(id: string, status: PatientStatus): void {
    this._patients.update((list) =>
      list.map((p) => (p.id === id ? { ...p, status } : p))
    );
  }
}
