import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import {
  computeCverify, verifyCverify, extendAuteurExpiry, canGrantAuteur, canRevokeOnRefund, eventKey,
} from '../../supabase/functions/_shared/jvzipn';

const f = { paykey: 'PT-1', customer_email: 'a@b.fr', product_name: 'EbookStudio V3 Auteur', transaction_type: 'SALE', date: '2026-10-16 10:00:00' };

describe('JVZIPN v2', () => {
  it('matches the official SHA-1 algorithm', async () => {
    const ref = createHash('sha1').update('PT-1|a@b.fr|EbookStudio V3 Auteur|SALE|2026-10-16 10:00:00|S3cret', 'utf8').digest('hex').slice(0, 8).toUpperCase();
    expect(await computeCverify(f, 'S3cret')).toBe(ref);
    expect(await verifyCverify({ ...f, cverify: ref }, 'S3cret')).toBe(true);
    expect(await verifyCverify({ ...f, cverify: ref }, 'other')).toBe(false);
    expect(await verifyCverify({ ...f, total: '1', cverify: ref, transaction_type: 'BILL' }, 'S3cret')).toBe(false);
  });
  it('extends one year plus 3 days from the later paid end', () => {
    const now = new Date('2026-10-16T00:00:00Z');
    expect(extendAuteurExpiry(null, now)).toBe('2027-10-19T00:00:00.000Z');
    expect(extendAuteurExpiry('2027-10-19T00:00:00.000Z', now)).toBe('2028-10-22T00:00:00.000Z');
  });
  it('never overwrites lifetime or Stripe rights', () => {
    expect(canGrantAuteur({ plan_type: 'lifetime', status: 'active' })).toBe(false);
    expect(canGrantAuteur({ status: 'active', plan_tier: 'auteur', stripe_subscription_id: 'sub_1' })).toBe(false);
    expect(canGrantAuteur({ status: 'active', plan_tier: 'pro' })).toBe(false);
    expect(canGrantAuteur(null)).toBe(true);
  });
  it('refund revokes only a JVZoo-granted Auteur access', () => {
    expect(canRevokeOnRefund({ plan_tier: 'auteur', plan_type: 'annual' }, true)).toBe(true);
    expect(canRevokeOnRefund({ plan_tier: 'auteur', plan_type: 'annual' }, false)).toBe(false);
    expect(canRevokeOnRefund({ plan_tier: 'pro', plan_type: 'lifetime' }, true)).toBe(false);
  });
  it('duplicate notifications share one key, rebills differ', () => {
    expect(eventKey({ transaction_type: 'SALE', transaction_id: 'X' })).toBe(eventKey({ transaction_type: 'sale', transaction_id: 'X' }));
    expect(eventKey({ transaction_type: 'BILL', transaction_id: 'X-B001' })).not.toBe(eventKey({ transaction_type: 'BILL', transaction_id: 'X-B002' }));
  });
});
