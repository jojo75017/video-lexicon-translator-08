/** Calendar days in Paris; sends remain manually triggered. */
export const LAUNCH_EMAIL_DATES: Record<number, string> = {
  1: '2026-10-16',
  2: '2026-10-19',
  3: '2026-10-20',
};

export function parisCalendarDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now);
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function canSendLaunchEmail(step: number, now = new Date()): boolean {
  return LAUNCH_EMAIL_DATES[step] === parisCalendarDate(now);
}