export const REVIEWER_KIND = 'jvzoo-auteur';
export function isDedicatedReviewer(metadata: Record<string, unknown> | undefined) {
  return metadata?.reviewer_kind === REVIEWER_KIND;
}
export function reviewerSubscription(email: string, userId: string, code: string, expiresAt: string) {
  return { email, user_id: userId, access_code: code, status: 'active', plan_type: 'pro', plan_tier: 'auteur', expires_at: expiresAt };
}