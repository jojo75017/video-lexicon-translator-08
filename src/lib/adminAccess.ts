import { supabase } from '@/integrations/supabase/client';

// In-memory cache to avoid repeated slow Edge Function calls
let cachedResult: { isAdmin: boolean; timestamp: number } | null = null;
const CACHE_DURATION_MS = 60_000; // 60 seconds
const LS_KEY = 'admin_status_cache_v1';
// Un admin confirmé reste admin longtemps : on ne le déconnecte plus pour un
// simple cache expiré ou une panne réseau. Un "non" reste éphémère.
const LS_TTL_MS = 30 * 24 * 60 * 60_000; // 30 jours
const LS_TTL_NEGATIVE_MS = 60_000; // 1 minute pour un "non"


export function clearAdminCache() {
  cachedResult = null;
  try { localStorage.removeItem(LS_KEY); } catch {}
}

export function readLocalCache(): boolean | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { isAdmin, ts } = JSON.parse(raw);
    const ttl = isAdmin ? LS_TTL_MS : LS_TTL_NEGATIVE_MS;
    if (Date.now() - ts > ttl) return null;
    return !!isAdmin;
  } catch {
    return null;
  }

}

function writeLocalCache(isAdmin: boolean) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ isAdmin, ts: Date.now() }));
  } catch {}
}

export async function getIsCurrentSessionAdmin(): Promise<boolean> {
  // Return memory cached result if fresh
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_DURATION_MS) {
    return cachedResult.isAdmin;
  }

  try {
    // getUser() revalide réellement le jeton côté serveur. Un getSession()
    // seul peut conserver une session locale expirée et provoquer un faux refus.
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      cachedResult = { isAdmin: false, timestamp: Date.now() };
      return false;
    }

    // Vérification directe du rôle en base : c'est le chemin le plus fiable et
    // il reste protégé par la fonction security-definer has_role.
    const { data: roleResult, error: roleError } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin',
    });

    if (!roleError) {
      const isAdmin = roleResult === true;
      cachedResult = { isAdmin, timestamp: Date.now() };
      writeLocalCache(isAdmin);
      return isAdmin;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return false;

    // Secours pour les anciens environnements où le RPC n'est pas disponible.
    const invokePromise = supabase.functions.invoke('check-admin', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('check-admin timeout') }), 6000)
    );

    const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

    if (error) {
      console.error('Admin access check failed:', error);
      // Fallback to localStorage cache to avoid logging out a real admin on transient errors
      const fallback = readLocalCache();
      if (fallback !== null) {
        console.log('Using localStorage admin fallback:', fallback);
        cachedResult = { isAdmin: fallback, timestamp: Date.now() };
        return fallback;
      }
      cachedResult = { isAdmin: false, timestamp: Date.now() };
      return false;
    }

    const isAdmin = !!data?.isAdmin;
    cachedResult = { isAdmin, timestamp: Date.now() };
    writeLocalCache(isAdmin);
    return isAdmin;
  } catch (error) {
    console.error('Admin session check failed:', error);
    const fallback = readLocalCache();
    if (fallback !== null) {
      cachedResult = { isAdmin: fallback, timestamp: Date.now() };
      return fallback;
    }
    cachedResult = { isAdmin: false, timestamp: Date.now() };
    return false;
  }
}
