import { supabase } from '@/integrations/supabase/client';

let pendingCheck: Promise<boolean> | null = null;

/** Revalidate the current user, then verify the admin role in the database. */
export async function getIsCurrentSessionAdmin(): Promise<boolean> {
  if (pendingCheck) return pendingCheck;

  pendingCheck = (async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return false;

      const { data: roleResult, error: roleError } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin',
      });

      if (roleError) {
        console.error('Admin role verification failed:', roleError);
        return false;
      }

      return roleResult === true;
    } catch (error) {
      console.error('Admin session verification failed:', error);
      return false;
    } finally {
      pendingCheck = null;
    }
  })();

  return pendingCheck;
}

export function clearAdminCache() {
  pendingCheck = null;
  try {
    localStorage.removeItem('admin_status_cache_v1');
  } catch {
    // Browser storage may be unavailable.
  }
}
