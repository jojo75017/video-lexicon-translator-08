import { supabase } from "@/integrations/supabase/client";

let sessionRecoveryPromise: Promise<string | null> | null = null;

async function restoreSubscriberSession(): Promise<string | null> {
  try {
    const email = localStorage.getItem("subscriber_email")?.trim().toLowerCase();
    const rawSubscriber = localStorage.getItem("subscriber_data");
    const subscriber = rawSubscriber ? JSON.parse(rawSubscriber) : null;
    const accessCode = typeof subscriber?.access_code === "string"
      ? subscriber.access_code.trim().toUpperCase()
      : "";

    if (!email || !accessCode) return null;

    const { data, error } = await supabase.functions.invoke("subscriber-auth", {
      body: { email, access_code: accessCode },
    });
    if (error || !data?.access_token || !data?.refresh_token) return null;

    const { data: installed, error: setSessionError } = await supabase.auth.setSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    });
    if (setSessionError || !installed.session?.access_token) return null;

    const { data: verified, error: verificationError } = await supabase.auth.getUser(
      installed.session.access_token
    );
    return !verificationError && verified.user ? installed.session.access_token : null;
  } catch {
    return null;
  }
}

/**
 * Retourne un access token valide, en rafraîchissant la session si elle est
 * expirée ou proche de l'expiration (les workflows longs dépassent souvent
 * la durée de vie du token, ce qui provoquait des erreurs "Non authentifié").
 */
async function resolveFreshAccessToken(): Promise<string | null> {
  try {
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) return restoreSubscriberSession();
  const session = data?.session;

  if (!session) return restoreSubscriberSession();

  if (session?.access_token) {
    const expiresAt = (session.expires_at ?? 0) * 1000;
    const isExpiringSoon = !expiresAt || expiresAt - Date.now() < 120_000;
    if (!isExpiringSoon) {
      const { data: verified, error: verificationError } = await supabase.auth.getUser(session.access_token);
      if (!verificationError && verified.user) return session.access_token;
    }
  }

  const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
  const refreshedToken = refreshed?.session?.access_token;
  if (refreshError || !refreshedToken) return restoreSubscriberSession();

  const { data: verified, error: verificationError } = await supabase.auth.getUser(refreshedToken);
  return !verificationError && verified.user ? refreshedToken : restoreSubscriberSession();
  } catch {
    return restoreSubscriberSession();
  }
}

export async function ensureFreshAccessToken(): Promise<string | null> {
  // Plusieurs sauvegardes cloud peuvent vérifier la session au même instant.
  // Un refresh token est à usage unique : on mutualise donc le renouvellement
  // afin qu'un workflow long ne perde pas sa session vers P8/P9.
  if (!sessionRecoveryPromise) {
    sessionRecoveryPromise = resolveFreshAccessToken().finally(() => {
      sessionRecoveryPromise = null;
    });
  }

  return sessionRecoveryPromise;
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
