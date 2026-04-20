import { Routes } from '@angular/router';
import { QueueService } from './services/queue.service';

export const QUEUE_ROUTES: Routes = [
  {
    path: '',
    providers: [QueueService],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/queue-dashboard/queue-dashboard.component').then(
            (m) => m.QueueDashboardComponent,
          ),
      },
      {
        path: 'intake',
        loadComponent: () =>
          import('./pages/patient-intake/patient-intake.component').then(
            (m) => m.PatientIntakeComponent,
          ),
      },
    ],
  },
];
