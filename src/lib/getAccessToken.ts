import { supabase } from "@/integrations/supabase/client";

/** Returns the signed-in user's access token, falling back to the publishable key. */
export async function getAccessToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
}
