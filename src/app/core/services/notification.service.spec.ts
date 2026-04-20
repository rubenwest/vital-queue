import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  describe('show', () => {
    it('adds a notification with the given message and type', () => {
      // Arrange & Act
      service.show('Something went wrong', 'error');

      // Assert
      const notifications = service.notifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].message).toBe('Something went wrong');
      expect(notifications[0].type).toBe('error');
      expect(notifications[0].id).toBeTruthy();
    });

    it('defaults to error type when none is provided', () => {
      // Arrange & Act
      service.show('Oops');

      // Assert
      expect(service.notifications()[0].type).toBe('error');
    });

    it('auto-dismisses after the specified duration', () => {
      // Arrange
      vi.useFakeTimers();
      service.show('Temporary', 'info', 3000);
      expect(service.notifications()).toHaveLength(1);

      // Act
      vi.advanceTimersByTime(3000);

      // Assert
      expect(service.notifications()).toHaveLength(0);
      vi.useRealTimers();
    });

    it('does not dismiss before the duration elapses', () => {
      // Arrange
      vi.useFakeTimers();
      service.show('Temporary', 'info', 3000);

      // Act
      vi.advanceTimersByTime(2999);

      // Assert
      expect(service.notifications()).toHaveLength(1);
      vi.useRealTimers();
    });
  });

  describe('dismiss', () => {
    it('removes the notification with the given id', () => {
      // Arrange
      service.show('Error A', 'error');
      service.show('Error B', 'error');
      const idToRemove = service.notifications()[0].id;

      // Act
      service.dismiss(idToRemove);

      // Assert
      expect(service.notifications()).toHaveLength(1);
      expect(service.notifications()[0].message).toBe('Error B');
    });

    it('cancels the auto-dismiss timer on manual dismiss', () => {
      // Arrange
      vi.useFakeTimers();
      service.show('Manual dismiss', 'warning', 3000);
      const id = service.notifications()[0].id;

      // Act — dismiss manually before timeout
      service.dismiss(id);
      vi.advanceTimersByTime(3000);

      // Assert — still 0, timer was cleared and did not fire again
      expect(service.notifications()).toHaveLength(0);
      vi.useRealTimers();
    });

    it('is a no-op for an unknown id', () => {
      // Arrange
      service.show('Keep me', 'info');

      // Act
      service.dismiss('non-existent-id');

      // Assert
      expect(service.notifications()).toHaveLength(1);
    });
  });

  describe('hasNotifications', () => {
    it('is false when empty', () => {
      expect(service.hasNotifications()).toBe(false);
    });

    it('is true after adding a notification', () => {
      service.show('Test');
      expect(service.hasNotifications()).toBe(true);
    });

    it('returns false once all notifications are dismissed', () => {
      service.show('Test');
      const id = service.notifications()[0].id;
      service.dismiss(id);
      expect(service.hasNotifications()).toBe(false);
    });
  });
});
