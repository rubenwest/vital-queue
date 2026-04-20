import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-notification-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notification-toast.component.html',
  styleUrl: './notification-toast.component.scss',
})
export class NotificationToastComponent {
  readonly notificationService = inject(NotificationService);
}
