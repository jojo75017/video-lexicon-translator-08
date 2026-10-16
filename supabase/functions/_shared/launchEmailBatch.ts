export const LAUNCH_EMAIL_BATCH_MAX = 300;

export function launchEmailBatchLimit(value: unknown): number {
  const requested = Number(value);
  return Number.isFinite(requested) && requested > 0
    ? Math.min(LAUNCH_EMAIL_BATCH_MAX, Math.max(1, Math.floor(requested)))
    : LAUNCH_EMAIL_BATCH_MAX;
}