export enum TriageLevel {
  Immediate = 1,
  VeryUrgent = 2,
  Urgent = 3,
  Standard = 4,
  NonUrgent = 5,
}

export const TRIAGE_LABELS: Record<TriageLevel, string> = {
  [TriageLevel.Immediate]: 'Level 1 — Immediate',
  [TriageLevel.VeryUrgent]: 'Level 2 — Very Urgent',
  [TriageLevel.Urgent]: 'Level 3 — Urgent',
  [TriageLevel.Standard]: 'Level 4 — Standard',
  [TriageLevel.NonUrgent]: 'Level 5 — Non-Urgent',
};

export type PatientStatus = 'waiting' | 'admitted' | 'discharged';

export interface Patient {
  readonly id: string;
  readonly name: string;
  readonly age: number;
  readonly chiefComplaint: string;
  triageLevel: TriageLevel;
  readonly arrivalTime: Date;
  status: PatientStatus;
}

export interface PatientIntakeForm {
  readonly name: string;
  readonly age: number;
  readonly chiefComplaint: string;
  readonly triageLevel: TriageLevel;
}
