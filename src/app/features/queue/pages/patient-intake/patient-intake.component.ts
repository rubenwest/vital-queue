import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QueueService } from '../../services/queue.service';
import { TriageLevel, TRIAGE_LABELS } from '../../models/patient.model';

interface IntakeFormControls {
  name: FormControl<string>;
  age: FormControl<number | null>;
  chiefComplaint: FormControl<string>;
  triageLevel: FormControl<TriageLevel>;
}

@Component({
  selector: 'app-patient-intake',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './patient-intake.component.html',
  styleUrl: './patient-intake.component.scss',
})
export class PatientIntakeComponent {
  private readonly _router = inject(Router);
  private readonly _queueService = inject(QueueService);
  private readonly _formRef = viewChild.required<ElementRef<HTMLFormElement>>('formEl');

  readonly triageLevels = Object.values(TriageLevel).filter(
    (v): v is TriageLevel => typeof v === 'number',
  );
  readonly triageLabels = TRIAGE_LABELS;

  readonly form = new FormGroup<IntakeFormControls>({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    age: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(0), Validators.max(150)] }),
    chiefComplaint: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    triageLevel: new FormControl(TriageLevel.Urgent, { nonNullable: true, validators: [Validators.required] }),
  });

  get nameControl() { return this.form.controls.name; }
  get ageControl() { return this.form.controls.age; }
  get chiefComplaintControl() { return this.form.controls.chiefComplaint; }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this._focusFirstInvalidField();
      return;
    }

    const { name, age, chiefComplaint, triageLevel } = this.form.getRawValue();
    this._queueService.addPatient({ name, age: age!, chiefComplaint, triageLevel });
    this._router.navigate(['/queue']);
  }

  cancel(): void {
    this._router.navigate(['/queue']);
  }

  private _focusFirstInvalidField(): void {
    const formEl = this._formRef().nativeElement;
    const firstInvalid = formEl.querySelector<HTMLElement>('.ng-invalid[id]');
    firstInvalid?.focus();
  }
}
