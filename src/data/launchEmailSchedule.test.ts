import { describe, expect, it } from 'vitest';
import { canSendLaunchEmail, LAUNCH_EMAIL_DATES } from '../../supabase/functions/_shared/launchEmailSchedule';

describe('Calendrier des emails du tunnel', () => {
  it('autorise seulement le premier le 16 octobre', () => {
    expect(LAUNCH_EMAIL_DATES[1]).toBe('2026-10-16');
    expect([1, 2, 3].map((step) => canSendLaunchEmail(step, new Date('2026-10-16T09:32:00Z')))).toEqual([true, false, false]);
  });
  it('autorise seulement le deuxième le 19 octobre', () => {
    expect(LAUNCH_EMAIL_DATES[2]).toBe('2026-10-19');
    expect([1, 2, 3].map((step) => canSendLaunchEmail(step, new Date('2026-10-19T09:32:00Z')))).toEqual([false, true, false]);
  });
  it('autorise seulement le dernier le 20 octobre', () => {
    expect(LAUNCH_EMAIL_DATES[3]).toBe('2026-10-20');
    expect([1, 2, 3].map((step) => canSendLaunchEmail(step, new Date('2026-10-20T09:32:00Z')))).toEqual([false, false, true]);
  });
  it('suit minuit à Paris', () => {
    expect(canSendLaunchEmail(2, new Date('2026-10-18T21:59:59Z'))).toBe(false);
    expect(canSendLaunchEmail(2, new Date('2026-10-18T22:00:00Z'))).toBe(true);
  });
});