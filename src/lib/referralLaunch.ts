// Date d'ouverture officielle du programme de parrainage
// Avant cette date, aucune fonctionnalité de parrainage n'est accessible.
export const REFERRAL_LAUNCH_DATE = new Date('2026-07-01T00:00:00+02:00');

export const isReferralActive = (): boolean => Date.now() >= REFERRAL_LAUNCH_DATE.getTime();

export const getReferralCountdown = () => {
  const diff = REFERRAL_LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  };
};
