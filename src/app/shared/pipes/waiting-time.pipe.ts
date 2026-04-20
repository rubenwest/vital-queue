import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'waitingTime', standalone: true, pure: false })
export class WaitingTimePipe implements PipeTransform {
  transform(arrivalTime: Date): string {
    const seconds = Math.floor((Date.now() - arrivalTime.getTime()) / 1000);

    if (seconds < 60) {
      return seconds === 1 ? '1 second' : `${seconds} seconds`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
      if (remainingSeconds === 0) {
        return minutes === 1 ? '1 minute' : `${minutes} minutes`;
      }
      const minLabel = minutes === 1 ? '1 minute' : `${minutes} minutes`;
      const secLabel = remainingSeconds === 1 ? '1 second' : `${remainingSeconds} seconds`;
      return `${minLabel} ${secLabel}`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const hourLabel = hours === 1 ? '1 hour' : `${hours} hours`;
    if (remainingMinutes === 0) return hourLabel;
    const minLabel = remainingMinutes === 1 ? '1 minute' : `${remainingMinutes} minutes`;
    return `${hourLabel} ${minLabel}`;
  }
}
