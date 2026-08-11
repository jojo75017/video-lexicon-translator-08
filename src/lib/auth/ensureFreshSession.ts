import { supabase } from "@/integrations/supabase/client";

/**
 * Retourne un access token valide, en rafraîchissant la session si elle est
 * expirée ou proche de l'expiration (les workflows longs dépassent souvent
 * la durée de vie du token, ce qui provoquait des erreurs "Non authentifié").
 */
export async function ensureFreshAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  const session = data?.session;

  if (session?.access_token) {
    const expiresAt = (session.expires_at ?? 0) * 1000;
    const isExpiringSoon = !expiresAt || expiresAt - Date.now() < 120_000;
    if (!isExpiringSoon) return session.access_token;
  }

  const { data: refreshed } = await supabase.auth.refreshSession();
  return refreshed?.session?.access_token ?? session?.access_token ?? null;
}

export function isAuthError(message: unknown): boolean {
  const text = String(message || "").toLowerCase();
  return (
    text.includes("non authentifié") ||
    text.includes("not authenticated") ||
    text.includes("unauthorized") ||
    text.includes("jwt expired") ||
    text.includes("401")
  );
}
