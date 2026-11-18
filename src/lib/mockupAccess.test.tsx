import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook, waitFor } from '@testing-library/react';

const state = vi.hoisted(() => ({ plan: '', owned: false, full: false }));
vi.mock('@/contexts/AdminAccessContext', () => ({ useAdminAccess: () => ({ isAdmin: false, isChecking: false }) }));
vi.mock('@/hooks/useV3Entitlement', () => ({ default: () => ({ loading: false, hasFull: state.full }) }));
vi.mock('@/lib/stripe', () => ({ getStripeEnvironment: () => 'live' }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getUser: async () => ({ data: { user: { email: 'test@example.invalid' } } }) },
  rpc: async (name: string) => ({ data: name === 'get_my_monthly_quota' ? [{ plan: state.plan }]
    : state.owned ? [{ module: 'mockup-3d', status: 'active', environment: 'live' }] : [] }),
} }));
import useModuleAccess from '@/hooks/useModuleAccess';

describe('Mockup Studio separate purchase and Edition inclusion', () => {
  beforeEach(() => { cleanup(); state.plan = ''; state.owned = false; state.full = false; });
  for (const period of ['monthly', 'annual']) {
    for (const [plan, granted] of [['debutant', false], ['auteur', false], ['vip', true]] as const) {
      it(`${plan} ${period}: included=${granted}`, async () => {
        state.plan = `v3m_${plan}_${period}`;
        state.full = plan === 'auteur'; // old generic Full classification must not unlock 29 €
        const { result } = renderHook(() => useModuleAccess('mockup-3d'));
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.hasAccess).toBe(granted);
      });
    }
  }
  it('one-time purchase unlocks Starter', async () => {
    state.plan = 'v3m_debutant_monthly'; state.owned = true;
    const { result } = renderHook(() => useModuleAccess('mockup-3d'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAccess).toBe(true);
    expect(result.current.reason).toBe('purchased');
  });
  it('missing plan without purchase stays locked', async () => {
    const { result } = renderHook(() => useModuleAccess('mockup-3d'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAccess).toBe(false);
  });
  it('checkout catalog charges exactly 27 EUR and webhook grants the matching module', () => {
    const source = readFileSync('supabase/functions/v3-upsell-checkout/index.ts', 'utf8');
    const amount = source.match(/mockup_3d:\s*\{[^}]*amount:\s*(\d+)/)?.[1];
    expect(Number(amount)).toBe(2700);
    const webhook = readFileSync('supabase/functions/payments-webhook/index.ts', 'utf8');
    expect(webhook.match(/mockup_3d:\s*"([^"]+)"/)?.[1]).toBe('mockup-3d');
  });
});