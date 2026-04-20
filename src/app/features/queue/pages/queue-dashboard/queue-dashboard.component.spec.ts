import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { QueueDashboardComponent } from './queue-dashboard.component';
import { QueueService } from '../../services/queue.service';
import { TriageLevel } from '../../models/patient.model';

describe('QueueDashboardComponent', () => {
  let fixture: ComponentFixture<QueueDashboardComponent>;
  let component: QueueDashboardComponent;
  let queueService: QueueService;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [QueueDashboardComponent],
      providers: [QueueService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(QueueDashboardComponent);
    component = fixture.componentInstance;
    queueService = TestBed.inject(QueueService);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the empty state when there are no waiting patients', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.empty-state')).toBeTruthy();
  });

  it('renders a row for each waiting patient', () => {
    queueService.addPatient({ name: 'Alice', age: 30, chiefComplaint: 'Chest pain', triageLevel: TriageLevel.Immediate });
    queueService.addPatient({ name: 'Bob', age: 40, chiefComplaint: 'Fracture', triageLevel: TriageLevel.Urgent });
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('app-patient-row');
    expect(rows).toHaveLength(2);
  });

  it('increments the tick signal every second', () => {
    expect(component.tick()).toBe(0);
    vi.advanceTimersByTime(3000);
    expect(component.tick()).toBe(3);
  });

  it('clears the interval on destroy', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearInterval');
    fixture.destroy();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('delegates triage change to the service', () => {
    const spy = vi.spyOn(queueService, 'updateTriageLevel');
    queueService.addPatient({ name: 'Carol', age: 25, chiefComplaint: 'Burn', triageLevel: TriageLevel.Urgent });
    const id = queueService.allPatients()[0].id;

    component.onTriageLevelChanged(id, TriageLevel.Immediate);

    expect(spy).toHaveBeenCalledWith(id, TriageLevel.Immediate);
  });

  it('delegates admit to the service', () => {
    const spy = vi.spyOn(queueService, 'admit');
    queueService.addPatient({ name: 'Dan', age: 55, chiefComplaint: 'Stroke', triageLevel: TriageLevel.Immediate });
    const id = queueService.allPatients()[0].id;

    component.onAdmit(id);

    expect(spy).toHaveBeenCalledWith(id);
  });

  it('delegates discharge to the service', () => {
    const spy = vi.spyOn(queueService, 'discharge');
    queueService.addPatient({ name: 'Eve', age: 70, chiefComplaint: 'Fall', triageLevel: TriageLevel.Standard });
    const id = queueService.allPatients()[0].id;

    component.onDischarge(id);

    expect(spy).toHaveBeenCalledWith(id);
  });
});
