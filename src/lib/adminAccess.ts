import { supabase } from '@/integrations/supabase/client';

// In-memory cache to avoid repeated slow Edge Function calls
let cachedResult: { isAdmin: boolean; timestamp: number } | null = null;
const CACHE_DURATION_MS = 60_000; // 60 seconds
const LS_KEY = 'admin_status_cache_v1';
const LS_TTL_MS = 5 * 60_000; // 5 minutes localStorage fallback

export function clearAdminCache() {
  cachedResult = null;
  try { localStorage.removeItem(LS_KEY); } catch {}
}

function readLocalCache(): boolean | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { isAdmin, ts } = JSON.parse(raw);
    if (Date.now() - ts > LS_TTL_MS) return null;
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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      cachedResult = { isAdmin: false, timestamp: Date.now() };
      return false;
    }

    // Try edge function with a 6s timeout — fallback to localStorage if it fails
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
