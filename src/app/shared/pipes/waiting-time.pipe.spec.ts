import { WaitingTimePipe } from './waiting-time.pipe';

describe('WaitingTimePipe', () => {
  let pipe: WaitingTimePipe;

  const arrivalSecondsAgo = (seconds: number): Date =>
    new Date(Date.now() - seconds * 1000);

  beforeEach(() => {
    pipe = new WaitingTimePipe();
  });

  describe('seconds range (< 60s)', () => {
    it('returns "1 second" for exactly 1 second', () => {
      expect(pipe.transform(arrivalSecondsAgo(1), 0)).toBe('1 second');
    });

    it('returns plural for 2+ seconds', () => {
      expect(pipe.transform(arrivalSecondsAgo(45), 0)).toBe('45 seconds');
    });

    it('returns "0 seconds" for 0 elapsed', () => {
      expect(pipe.transform(arrivalSecondsAgo(0), 0)).toBe('0 seconds');
    });
  });

  describe('minutes range (1m–59m)', () => {
    it('returns "1 minute" for exactly 60 seconds', () => {
      expect(pipe.transform(arrivalSecondsAgo(60), 0)).toBe('1 minute');
    });

    it('returns plural minutes for 2+ minutes exactly', () => {
      expect(pipe.transform(arrivalSecondsAgo(120), 0)).toBe('2 minutes');
    });

    it('returns minutes + seconds when remainder > 0', () => {
      expect(pipe.transform(arrivalSecondsAgo(90), 0)).toBe('1 minute 30 seconds');
    });

    it('uses singular second when remainder is 1', () => {
      expect(pipe.transform(arrivalSecondsAgo(61), 0)).toBe('1 minute 1 second');
    });

    it('uses plural minutes and plural seconds', () => {
      expect(pipe.transform(arrivalSecondsAgo(150), 0)).toBe('2 minutes 30 seconds');
    });
  });

  describe('hours range (>= 60m)', () => {
    it('returns "1 hour" for exactly 3600 seconds', () => {
      expect(pipe.transform(arrivalSecondsAgo(3600), 0)).toBe('1 hour');
    });

    it('returns plural hours', () => {
      expect(pipe.transform(arrivalSecondsAgo(7200), 0)).toBe('2 hours');
    });

    it('returns hours + minutes when remainder > 0', () => {
      expect(pipe.transform(arrivalSecondsAgo(3660), 0)).toBe('1 hour 1 minute');
    });

    it('returns hours + plural minutes', () => {
      expect(pipe.transform(arrivalSecondsAgo(3720), 0)).toBe('1 hour 2 minutes');
    });

    it('ignores leftover seconds beyond the hour+minute display', () => {
      // 3661s = 1h 1m 1s → pipe shows only hours+minutes
      expect(pipe.transform(arrivalSecondsAgo(3661), 0)).toBe('1 hour 1 minute');
    });
  });

  describe('tick parameter', () => {
    it('produces a different result when called with a later arrival time', () => {
      const result1 = pipe.transform(arrivalSecondsAgo(30), 0);
      const result2 = pipe.transform(arrivalSecondsAgo(90), 0);
      expect(result1).not.toBe(result2);
    });
  });
});
