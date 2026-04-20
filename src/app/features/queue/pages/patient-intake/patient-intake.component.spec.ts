import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { PatientIntakeComponent } from './patient-intake.component';
import { QueueService } from '../../services/queue.service';
import { TriageLevel } from '../../models/patient.model';

describe('PatientIntakeComponent', () => {
  let fixture: ComponentFixture<PatientIntakeComponent>;
  let component: PatientIntakeComponent;
  let queueService: QueueService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientIntakeComponent],
      providers: [QueueService, provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientIntakeComponent);
    component = fixture.componentInstance;
    queueService = TestBed.inject(QueueService);
    fixture.detectChanges();
  });

  describe('invalid submit', () => {
    it('marks all controls as touched when the form is invalid', () => {
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[type="submit"]');
      submitBtn.click();
      fixture.detectChanges();

      const { name, age, chiefComplaint } = component.form.controls;
      expect(name.touched).toBe(true);
      expect(age.touched).toBe(true);
      expect(chiefComplaint.touched).toBe(true);
    });

    it('does not add a patient when the form is invalid', () => {
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[type="submit"]');
      submitBtn.click();

      expect(queueService.allPatients()).toHaveLength(0);
    });

    it('shows validation errors for empty required fields after submit', () => {
      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[type="submit"]');
      submitBtn.click();
      fixture.detectChanges();

      const errors: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.form-field__error');
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('valid submit', () => {
    it('calls addPatient and navigates away when the form is valid', () => {
      const addSpy = vi.spyOn(queueService, 'addPatient');
      const router = TestBed.inject(Router);
      const navSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

      fillForm(fixture, { name: 'John Doe', age: 32, chiefComplaint: 'Headache', triageLevel: TriageLevel.Standard });

      const submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('[type="submit"]');
      submitBtn.click();

      expect(addSpy).toHaveBeenCalledOnce();
      expect(addSpy).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'John Doe', age: 32, triageLevel: TriageLevel.Standard }),
      );
      expect(navSpy).toHaveBeenCalledWith(['/queue']);
    });
  });
});

function fillForm(
  fixture: ComponentFixture<PatientIntakeComponent>,
  data: { name: string; age: number; chiefComplaint: string; triageLevel: TriageLevel },
): void {
  const { name, age, chiefComplaint, triageLevel } = fixture.componentInstance.form.controls;
  name.setValue(data.name);
  age.setValue(data.age);
  chiefComplaint.setValue(data.chiefComplaint);
  triageLevel.setValue(data.triageLevel);
  fixture.detectChanges();
}
