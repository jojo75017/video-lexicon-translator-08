import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  'dashboard': 'free',
  'analytics': 'free',
  'projects': 'free',
  'settings': 'free',
  'users': 'pro',
  'billing': 'pro',
  'api-keys': 'pro',
  'admin-panel': 'admin',
  'user-management': 'admin',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userRole = await fetchUserRole(session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            role: userRole,
            plan: userRole === 'admin' ? 'Enterprise' : userRole === 'pro' ? 'Pro' : 'Free',
            createdAt: session.user.created_at,
          });
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const userRole = await fetchUserRole(session.user.id);
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: userRole,
          plan: userRole === 'admin' ? 'Enterprise' : userRole === 'pro' ? 'Pro' : 'Free',
          createdAt: session.user.created_at,
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error || !data) {
        // Check subscriber status as fallback
        const { data: subscriber } = await supabase
          .from('subscribers')
          .select('plan_type')
          .eq('email', (await supabase.auth.getUser()).data.user?.email)
          .single();

        if (subscriber?.plan_type === 'lifetime' || subscriber?.plan_type === 'pro') {
          return 'pro';
        }
        return 'free';
      }

      return data.role as UserRole;
    } catch {
      return 'free';
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        role: user?.role || 'free',
        login,
        signup,
        logout,
        hasRole,
        canAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
