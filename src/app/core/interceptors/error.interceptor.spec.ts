import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { errorInterceptor } from './error.interceptor';

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService);
  });

  afterEach(() => httpMock.verify());

  it('shows a warning toast on 401 without navigating (no login route)', () => {
    // Arrange
    http.get('/api/test').subscribe({ error: () => {} });

    // Act
    httpMock.expectOne('/api/test').flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    // Assert
    const notifications = notificationService.notifications();
    expect(notifications).toHaveLength(1);
    expect(notifications[0].type).toBe('warning');
    expect(notifications[0].message).toContain('session');
  });

  it('shows a mapped error toast for known 4xx codes', () => {
    // Arrange
    http.get('/api/test').subscribe({ error: () => {} });

    // Act
    httpMock.expectOne('/api/test').flush('Not found', { status: 404, statusText: 'Not Found' });

    // Assert
    const notifications = notificationService.notifications();
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].message).toContain('not found');
  });

  it('shows a mapped error toast for known 5xx codes', () => {
    // Arrange
    http.get('/api/test').subscribe({ error: () => {} });

    // Act
    httpMock.expectOne('/api/test').flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    // Assert
    const notifications = notificationService.notifications();
    expect(notifications[0].type).toBe('error');
    expect(notifications[0].message).toContain('internal server error');
  });

  it('shows a generic client error for unmapped 4xx', () => {
    // Arrange
    http.get('/api/test').subscribe({ error: () => {} });

    // Act
    httpMock.expectOne('/api/test').flush('Gone', { status: 410, statusText: 'Gone' });

    // Assert
    expect(notificationService.notifications()[0].message).toContain('client error');
  });

  it('shows a generic server error for unmapped 5xx', () => {
    // Arrange
    http.get('/api/test').subscribe({ error: () => {} });

    // Act
    httpMock.expectOne('/api/test').flush('Bad gateway', { status: 504, statusText: 'Gateway Timeout' });

    // Assert
    expect(notificationService.notifications()[0].message).toContain('server error');
  });

  it('does not show a toast for successful requests', () => {
    // Arrange
    http.get('/api/test').subscribe();

    // Act
    httpMock.expectOne('/api/test').flush({ ok: true });

    // Assert
    expect(notificationService.notifications()).toHaveLength(0);
  });
});
