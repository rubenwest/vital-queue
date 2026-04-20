import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'error' | 'warning' | 'info';

export interface Notification {
  readonly id: string;
  readonly message: string;
  readonly type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);

  show(message: string, type: NotificationType = 'error', durationMs = 5000): void {
    const id = crypto.randomUUID();
    this._notifications.update((list) => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), durationMs);
  }

  dismiss(id: string): void {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
