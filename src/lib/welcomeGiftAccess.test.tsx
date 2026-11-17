import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, cleanup } from '@testing-library/react';

const state = vi.hoisted(() => ({ plan: '', owned: false }));
vi.mock('@/contexts/AdminAccessContext', () => ({ useAdminAccess: () => ({ isAdmin: false, isChecking: false }) }));
vi.mock('@/hooks/useV3Entitlement', () => ({ default: () => ({ loading: false, hasFull: false }) }));
vi.mock('@/lib/stripe', () => ({ getStripeEnvironment: () => 'live' }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  auth: { getUser: async () => ({ data: { user: { email: 'test@example.invalid' } } }) },
  rpc: async (name: string) => ({ data: name === 'get_my_monthly_quota'
    ? [{ plan: state.plan }]
    : state.owned ? [{ module: 'audio_premium', status: 'active', environment: 'live' }] : [] }),
} }));
import useModuleAccess from '@/hooks/useModuleAccess';

// Execute the real shared server decision, without identity changes or credits.
const source = readFileSync('supabase/functions/_shared/coverPro.ts', 'utf8');
const start = source.indexOf('const PAID_STATUSES');
const end = source.indexOf('/* ------------------------------------------------------------------ */', start);
const code = ts.transpileModule(source.slice(start, end).replace('export async function', 'async function'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;
const coverRight = new Function('COVER_PRO_MODULE', `${code}; return hasCoverProRight;`)('cover_studio_pro');

async function checkCover(tier: string, type: string, status = 'active', purchased = false) {
  const from = vi.fn((table: string) => {
    const chain = {
      select: () => chain, eq: () => chain, ilike: () => chain,
      in: async () => ({ data: purchased ? [{ status: 'paid' }] : [] }),
      maybeSingle: async () => ({ data: { plan_tier: tier, plan_type: type, status } }),
    };
    if (!['subscribers', 'module_entitlements'].includes(table)) throw new Error(table);
    return chain;
  });
  return coverRight({ from }, { id: 'test', email: 'test@example.invalid', isAdmin: false });
}

describe('Welcome gift cover access without customer changes', () => {
  for (const type of ['subscription', 'annual']) {
    it(`Starter 19 € excludes Pro (${type})`, async () => {
      expect(await checkCover('plume', type)).toEqual({ granted: false, reason: null });
    });
    it(`Auteur 29 € includes Pro (${type})`, async () => {
      expect(await checkCover('edition', type)).toEqual({ granted: true, reason: 'plan' });
    });
    it(`Édition 59 € includes Pro (${type})`, async () => {
      expect(await checkCover('maison', type)).toEqual({ granted: true, reason: 'plan' });
    });
  }
  it('inactive subscription does not receive the gift', async () => {
    expect((await checkCover('edition', 'subscription', 'inactive')).granted).toBe(false);
  });
  it('existing separate purchase remains accessible', async () => {
    expect(await checkCover('plume', 'lifetime', 'active', true)).toEqual({ granted: true, reason: 'purchased' });
  });
  it('lifetime ownership is not newly extended by the welcome gift', async () => {
    expect((await checkCover('edition', 'lifetime')).granted).toBe(false);
  });
});

describe('Audio gift through the actual subscriber hook', () => {
  beforeEach(() => { cleanup(); state.plan = ''; state.owned = false; });
  for (const period of ['monthly', 'annual']) {
    for (const [tier, price, granted] of [['debutant', 19, false], ['auteur', 29, true], ['vip', 59, true]] as const) {
      it(`${price} € audio access is ${granted} (${period})`, async () => {
        state.plan = `v3m_${tier}_${period}`;
        const { result } = renderHook(() => useModuleAccess('audio_premium'));
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.hasAccess).toBe(granted);
        expect(result.current.reason).toBe(granted ? 'plan' : null);
      });
    }
  }
  it('previous audio purchase remains accessible', async () => {
    state.owned = true;
    const { result } = renderHook(() => useModuleAccess('audio_premium'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasAccess).toBe(true);
    expect(result.current.reason).toBe('purchased');
  });
});