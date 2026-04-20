import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'error' | 'warning' | 'info';

export interface AppNotification {
  readonly id: string;
  readonly message: string;
  readonly type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<AppNotification[]>([]);
  private readonly _timers = new Map<string, ReturnType<typeof setTimeout>>();

  readonly notifications = this._notifications.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);

  show(message: string, type: NotificationType = 'error', durationMs = 5000): void {
    const id = crypto.randomUUID();
    this._notifications.update((list) => [...list, { id, message, type }]);
    this._timers.set(id, setTimeout(() => this.dismiss(id), durationMs));
  }

  dismiss(id: string): void {
    const timer = this._timers.get(id);
    if (timer !== undefined) {
      clearTimeout(timer);
      this._timers.delete(id);
    }
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }
}
