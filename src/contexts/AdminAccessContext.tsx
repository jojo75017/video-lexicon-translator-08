import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  clearAdminCache,
  getCachedAdminStatus,
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

export function AdminAccessProvider({ children }: { children: React.ReactNode }) {
  const initial = getCachedAdminStatus();
  const [status, setStatus] = useState<AdminAccessStatus>(
    initial === true ? 'admin' : initial === false ? 'non-admin' : 'restoring',
  );
  const mounted = useRef(true);

  const applyResult = useCallback((result: boolean | null) => {
    if (!mounted.current) return;
    setStatus((previous) => {
      if (previous === 'admin' && result !== true) return 'admin';
      if (result === true) return 'admin';
      if (result === false) return 'non-admin';
      return 'temporary-error';
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
      setStatus((previous) => previous === 'admin' ? 'admin' : 'restoring');
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