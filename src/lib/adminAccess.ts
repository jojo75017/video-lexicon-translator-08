import { supabase } from '@/integrations/supabase/client';

// In-memory cache to avoid repeated slow Edge Function calls
let cachedResult: { isAdmin: boolean; timestamp: number } | null = null;
const CACHE_DURATION_MS = 30_000; // 30 seconds

export function clearAdminCache() {
  cachedResult = null;
}

export async function getIsCurrentSessionAdmin(): Promise<boolean> {
  // Return cached result if fresh
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

    const { data, error } = await supabase.functions.invoke('check-admin', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error) {
      console.error('Admin access check failed:', error);
      cachedResult = { isAdmin: false, timestamp: Date.now() };
      return false;
    }

    const isAdmin = !!data?.isAdmin;
    cachedResult = { isAdmin, timestamp: Date.now() };
    return isAdmin;
  } catch (error) {
    console.error('Admin session check failed:', error);
    cachedResult = { isAdmin: false, timestamp: Date.now() };
    return false;
  }
}
