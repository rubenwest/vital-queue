import { Routes } from '@angular/router';

export const QUEUE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/queue-dashboard/queue-dashboard.component').then(
        (m) => m.QueueDashboardComponent
      ),
  },
  {
    path: 'intake',
    loadComponent: () =>
      import('./pages/patient-intake/patient-intake.component').then(
        (m) => m.PatientIntakeComponent
      ),
  },
];
