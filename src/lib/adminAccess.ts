import { supabase } from '@/integrations/supabase/client';

export async function getIsCurrentSessionAdmin(): Promise<boolean> {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return false;
    }

    const { data, error } = await supabase.functions.invoke('check-admin', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error) {
      console.error('Admin access check failed:', error);
      return false;
    }

    return !!data?.isAdmin;
  } catch (error) {
    console.error('Admin session check failed:', error);
    return false;
  }
}