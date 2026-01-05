import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'free' | 'pro' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  plan: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  role: UserRole;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  hasRole: (requiredRole: UserRole) => boolean;
  canAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const roleHierarchy: Record<UserRole, number> = {
  free: 0,
  pro: 1,
  admin: 2,
};

const featureAccess: Record<string, UserRole> = {
  dashboard: 'free',
  analytics: 'free',
  projects: 'free',
  settings: 'free',
  users: 'pro',
  billing: 'pro',
  'api-keys': 'pro',
  'admin-panel': 'admin',
  'user-management': 'admin',
};

interface AuthProviderProps {
  children: ReactNode;
}

const computePlan = (role: UserRole) => (role === 'admin' ? 'Enterprise' : role === 'pro' ? 'Pro' : 'Free');

const makeUser = (supUser: SupabaseUser, role: UserRole): User => ({
  id: supUser.id,
  email: supUser.email || '',
  role,
  plan: computePlan(role),
  createdAt: supUser.created_at,
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async (userId: string, email?: string | null): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (!error && data?.role) {
        return data.role as UserRole;
      }

      // Fallback: si l’utilisateur a un plan abonnement (pro/lifetime) => pro
      if (email) {
        const { data: subscriber } = await supabase
          .from('subscribers')
          .select('plan_type')
          .eq('email', email)
          .single();

        if (subscriber?.plan_type === 'lifetime' || subscriber?.plan_type === 'pro') {
          return 'pro';
        }
      }

      return 'free';
    } catch {
      return 'free';
    }
  };

  useEffect(() => {
    // 1) Listener d'abord (IMPORTANT)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // IMPORTANT: ne faire que des updates synchrones ici
      setSession(nextSession);
      setUser(nextSession?.user ? makeUser(nextSession.user, 'free') : null);

      // 2) Récupération du rôle en différé (évite les deadlocks / instabilités)
      if (nextSession?.user) {
        setTimeout(async () => {
          const role = await fetchUserRole(nextSession.user.id, nextSession.user.email);
          setUser(makeUser(nextSession.user, role));
        }, 0);
      }
    });

    // 3) Ensuite on hydrate avec la session existante
    supabase.auth.getSession().then(async ({ data: { session: existing } }) => {
      setSession(existing);

      if (existing?.user) {
        setUser(makeUser(existing.user, 'free'));
        const role = await fetchUserRole(existing.user.id, existing.user.email);
        setUser(makeUser(existing.user, role));
      } else {
        setUser(null);
      }

      setIsLoading(false);
    }).catch((err) => {
      console.error('Auth init error:', err);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const canAccess = (feature: string): boolean => {
    const requiredRole = featureAccess[feature] || 'free';
    return hasRole(requiredRole);
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    role: user?.role || 'free',
    login,
    signup,
    logout,
    hasRole,
    canAccess,
  }), [user, session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
