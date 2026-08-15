import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = {
  session: { user: { id: 'u1' } } as any,
  sessionError: null as any,
  user: { id: 'u1' } as any,
  userError: null as any,
  role: true as any,
  roleError: null as any,
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: state.session }, error: state.sessionError }),
      getUser: async () => ({ data: { user: state.user }, error: state.userError }),
    },
    rpc: async () => ({ data: state.role, error: state.roleError }),
  },
}));

describe('adminAccess', () => {
  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    state.session = { user: { id: 'u1' } };
    state.sessionError = null;
    state.user = { id: 'u1' };
    state.userError = null;
    state.role = true;
    state.roleError = null;
  });

  it('confirme un admin et mémorise l’indice de session', async () => {
    const mod = await import('./adminAccess');
    expect(await mod.resolveAdminStatus()).toBe(true);
    expect(mod.getCachedAdminStatus()).toBe(true);
    expect(mod.hasPersistedAdminHint()).toBe(true);
  });

  it('ignore une réponse négative tardive après un admin confirmé', async () => {
    const mod = await import('./adminAccess');
    expect(await mod.resolveAdminStatus()).toBe(true);

    // Le backend répondrait maintenant « non admin » : aucune rétrogradation.
    state.role = false;
    expect(await mod.resolveAdminStatus()).toBe(true);
    expect(mod.getCachedAdminStatus()).toBe(true);
  });

  it('une erreur réseau ne produit jamais un refus (statut inconnu)', async () => {
    state.userError = new Error('network');
    const mod = await import('./adminAccess');
    expect(await mod.resolveAdminStatus()).toBeNull();
    expect(mod.getCachedAdminStatus()).toBeNull();
    expect(mod.hasPersistedAdminHint()).toBe(false);
  }, 10000);

  it('sans session, le statut est un refus confirmé et l’indice est effacé', async () => {
    state.session = null;
    const mod = await import('./adminAccess');
    expect(await mod.resolveAdminStatus()).toBe(false);
    expect(mod.hasPersistedAdminHint()).toBe(false);
  });

  it('la déconnexion efface le statut admin et l’indice', async () => {
    const mod = await import('./adminAccess');
    expect(await mod.resolveAdminStatus()).toBe(true);
    mod.clearAdminCache();
    expect(mod.getCachedAdminStatus()).toBeNull();
    expect(mod.hasPersistedAdminHint()).toBe(false);
  });
});
