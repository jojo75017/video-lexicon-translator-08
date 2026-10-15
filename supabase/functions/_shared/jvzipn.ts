// JVZIPN v2 rules (official JVZoo guide): cverify = first 8 chars, uppercase,
// of SHA-1(UTF-8 "paykey|customer_email|product_name|transaction_type|date|" + secret).
export const JVZOO_AUTEUR_PRODUCT_ID = '457791';

export async function computeCverify(f: Record<string, string>, secret: string) {
  const base = [f.paykey, f.customer_email, f.product_name, f.transaction_type, f.date]
    .map((v) => v ?? '').join('|') + '|' + secret;
  const hash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(base));
  return Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, '0')).join('').slice(0, 8).toUpperCase();
}

export async function verifyCverify(f: Record<string, string>, secret: string) {
  if (!secret) return false;
  const expected = await computeCverify(f, secret);
  const got = String(f.cverify ?? '').toUpperCase();
  if (got.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}

/** One paid year from the later of now or the current paid end, plus 3 days of grace. */
export function extendAuteurExpiry(currentExpiry: string | null | undefined, now = new Date()) {
  const current = currentExpiry ? new Date(currentExpiry) : null;
  const start = current && current.getTime() > now.getTime() ? current : now;
  const next = new Date(start);
  next.setUTCFullYear(next.getUTCFullYear() + 1);
  next.setUTCDate(next.getUTCDate() + 3);
  return next.toISOString();
}

export type ExistingSubscriber = {
  status?: string | null; plan_type?: string | null; plan_tier?: string | null;
  expires_at?: string | null; stripe_subscription_id?: string | null;
} | null;

/** Never downgrade or overwrite another active right (lifetime, Stripe, higher plans). */
export function canGrantAuteur(sub: ExistingSubscriber, now = new Date()) {
  if (!sub) return true;
  if (sub.plan_type === 'lifetime' || sub.status === 'lifetime') return false;
  const active = sub.status === 'active' && (!sub.expires_at || new Date(sub.expires_at).getTime() > now.getTime());
  if (!active) return true;
  if (sub.stripe_subscription_id) return false;
  return sub.plan_tier === 'auteur';
}

/** A refund only revokes an Auteur access that JVZoo itself granted. */
export function canRevokeOnRefund(sub: ExistingSubscriber, jvzooGranted: boolean) {
  return !!sub && jvzooGranted && sub.plan_tier === 'auteur' && sub.plan_type === 'annual' && !sub.stripe_subscription_id;
}

export function eventKey(f: Record<string, string>) {
  return `${String(f.transaction_type ?? '').toUpperCase()}:${f.transaction_id ?? ''}`;
}
