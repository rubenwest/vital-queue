import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'queue',
  },
  {
    path: 'queue',
    loadChildren: () =>
      import('./features/queue/queue.routes').then((m) => m.QUEUE_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'queue',
  },
];
