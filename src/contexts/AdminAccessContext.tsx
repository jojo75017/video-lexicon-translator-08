import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  clearAdminCache,
  getCachedAdminStatus,
  hasPersistedAdminHint,
  resolveAdminStatus,
  subscribeAdminStatus,
} from '@/lib/adminAccess';

export type AdminAccessStatus = 'restoring' | 'admin' | 'non-admin' | 'temporary-error';

type AdminAccessValue = {
  status: AdminAccessStatus;
  isAdmin: boolean;
  isChecking: boolean;
  refresh: () => Promise<boolean | null>;
};

const AdminAccessContext = createContext<AdminAccessValue | null>(null);

/** Cadence de reprise automatique tant que le statut reste inconnu. */
const RETRY_DELAY_MS = 2500;

export function AdminAccessProvider({ children }: { children: React.ReactNode }) {
  const initial = getCachedAdminStatus();
  const [status, setStatus] = useState<AdminAccessStatus>(
    initial === true ? 'admin' : initial === false ? 'non-admin' : 'restoring',
  );
  const mounted = useRef(true);

  const applyResult = useCallback((result: boolean | null) => {
    if (!mounted.current) return;
    setStatus((previous) => {
      // Un admin confirmé ne peut jamais être rétrogradé pendant la session.
      if (previous === 'admin' && result !== true) return 'admin';
      if (result === true) return 'admin';
      if (result === false) return 'non-admin';
      // Statut inconnu : si la session a déjà été confirmée admin, on reste en
      // vérification (jamais « visiteur ») ; sinon erreur temporaire.
      return hasPersistedAdminHint() ? 'restoring' : 'temporary-error';
    });
  }, []);

  const refresh = useCallback(async () => {
    const result = await resolveAdminStatus();
    applyResult(result);
    return result;
  }, [applyResult]);

  useEffect(() => {
    mounted.current = true;
    const unsubscribeStatus = subscribeAdminStatus(applyResult);

    const restore = async () => {
      setStatus((previous) => (previous === 'admin' ? 'admin' : 'restoring'));
      await refresh();
    };
    void restore();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        clearAdminCache();
        if (mounted.current) setStatus('non-admin');
        return;
      }
      if ((event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        setTimeout(() => { void refresh(); }, 0);
      }
    });

    return () => {
      mounted.current = false;
      unsubscribeStatus();
      subscription.unsubscribe();
    };
  }, [applyResult, refresh]);

  // Reprise automatique en arrière-plan : aucune attente ne se transforme en refus.
  useEffect(() => {
    if (status !== 'restoring' && status !== 'temporary-error') return;
    const timer = setTimeout(() => { void refresh(); }, RETRY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status, refresh]);

  return (
    <AdminAccessContext.Provider value={{
      status,
      isAdmin: status === 'admin',
      isChecking: status === 'restoring' || status === 'temporary-error',
      refresh,
    }}>
      {children}
    </AdminAccessContext.Provider>
  );
}

export function useAdminAccess() {
  const value = useContext(AdminAccessContext);
  if (!value) throw new Error('useAdminAccess must be used inside AdminAccessProvider');
  return value;
}
