import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PatientRowComponent } from './patient-row.component';
import { Patient, TriageLevel } from '../../models/patient.model';

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'p1',
  name: 'Jane Smith',
  age: 45,
  chiefComplaint: 'Chest pain',
  triageLevel: TriageLevel.Urgent,
  arrivalTime: new Date(),
  status: 'waiting',
  ...overrides,
});

describe('PatientRowComponent', () => {
  let fixture: ComponentFixture<PatientRowComponent>;
  let component: PatientRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientRowComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('patient', makePatient());
    fixture.detectChanges();
  });

  it('renders patient name and chief complaint', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Jane Smith');
    expect(el.textContent).toContain('Chest pain');
  });

  it('pre-selects the option matching the current triage level', () => {
    const options: NodeListOf<HTMLOptionElement> =
      fixture.nativeElement.querySelectorAll('select option');

    const selected = Array.from(options).find((o) => o.selected);
    expect(Number(selected?.value)).toBe(TriageLevel.Urgent);
  });

  it('emits triageLevelChanged with the new level when the select changes', () => {
    const emitted: TriageLevel[] = [];
    component.triageLevelChanged.subscribe((v: TriageLevel) => emitted.push(v));

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = String(TriageLevel.Immediate);
    select.dispatchEvent(new Event('change'));

    expect(emitted).toHaveLength(1);
    expect(emitted[0]).toBe(TriageLevel.Immediate);
  });

  it('emits admit when the Admit button is clicked', () => {
    let emitted = false;
    component.admit.subscribe(() => (emitted = true));

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn--admit');
    btn.click();

    expect(emitted).toBe(true);
  });

  it('emits discharge when the Discharge button is clicked', () => {
    let emitted = false;
    component.discharge.subscribe(() => (emitted = true));

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn--discharge');
    btn.click();

    expect(emitted).toBe(true);
  });

  it('updates the triage badge label when the patient input changes', () => {
    fixture.componentRef.setInput('patient', makePatient({ triageLevel: TriageLevel.Immediate }));
    fixture.detectChanges();

    const badge: HTMLElement = fixture.nativeElement.querySelector('.triage-badge');
    expect(badge.textContent?.trim()).toBe('L1');
  });
});
