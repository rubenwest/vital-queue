import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

const ERROR_MESSAGES: Partial<Record<number, string>> = {
  400: 'Bad request. Please check the submitted data.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'A conflict occurred. The resource may already exist.',
  422: 'The server could not process the request. Please review the data.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'An internal server error occurred. Please try again later.',
  502: 'Service temporarily unavailable. Please try again later.',
  503: 'Service temporarily unavailable. Please try again later.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        notifications.show('Your session has expired. Please log in again.', 'warning');
        router.navigate(['/login']);
        return throwError(() => error);
      }

      const message =
        ERROR_MESSAGES[error.status] ??
        (error.status >= 400 && error.status < 500
          ? 'An unexpected client error occurred.'
          : 'An unexpected server error occurred.');

      notifications.show(message, 'error');
      return throwError(() => error);
    }),
  );
};
