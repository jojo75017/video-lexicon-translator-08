// Cover Studio KDP Pro — utilitaires serveur partagés (étape 3).
//
// Règles de sécurité appliquées ici :
//  - la clé API personnelle n'est JAMAIS stockée en clair : AES-GCM avec un
//    secret conservé uniquement côté serveur (COVER_PRO_KEY_ENCRYPTION_SECRET) ;
//  - le déchiffrement a lieu uniquement au moment de l'appel au fournisseur ;
//  - aucune clé n'est renvoyée au client, ni journalisée, ni incluse dans un
//    message d'erreur (voir `scrub`) ;
//  - aucun appel à la passerelle Lovable, aucun crédit Lovable.

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export const COVER_PRO_MODULE = "cover_studio_pro";
export const INCLUDED_GENERATIONS = 3;

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Supprime toute occurrence de clé API d'un texte avant journalisation/renvoi. */
export function scrub(text: string): string {
  return String(text ?? "")
    .replace(/sk-[A-Za-z0-9_\-]{8,}/g, "sk-***")
    .replace(/AIza[0-9A-Za-z_\-]{10,}/g, "AIza***");
}

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

export interface AuthedUser {
  id: string;
  email: string;
  isAdmin: boolean;
}

/** Valide le JWT porteur et récupère le rôle admin. */
export async function authenticate(req: Request): Promise<AuthedUser | null> {
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader) return null;

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error } = await userClient.auth.getUser();
  if (error || !user?.id) return null;

  const { data: isAdmin } = await userClient.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });

  return {
    id: user.id,
    email: (user.email ?? "").toLowerCase(),
    isAdmin: isAdmin === true,
  };
}

const PAID_STATUSES = new Set(["active", "completed", "paid"]);

/** Droit réel `cover_studio_pro` : achat enregistré ou administrateur. */
export async function hasCoverProRight(
  service: SupabaseClient,
  user: AuthedUser,
): Promise<{ granted: boolean; reason: "admin" | "purchased" | null }> {
  if (user.isAdmin) return { granted: true, reason: "admin" };
  if (!user.email) return { granted: false, reason: null };

  const { data } = await service
    .from("module_entitlements")
    .select("status")
    .eq("email", user.email)
    .eq("module", COVER_PRO_MODULE);

  const owns = (data ?? []).some((r: { status?: string }) =>
    PAID_STATUSES.has((r.status ?? "").toLowerCase())
  );
  return owns ? { granted: true, reason: "purchased" } : { granted: false, reason: null };
}

/* ------------------------------------------------------------------ */
/* Chiffrement AES-GCM du coffre BYOK                                  */
/* ------------------------------------------------------------------ */

async function aesKey(): Promise<CryptoKey> {
  const secret = Deno.env.get("COVER_PRO_KEY_ENCRYPTION_SECRET");
  if (!secret) throw new Error("Secret de chiffrement absent côté serveur.");
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey("raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

function toB64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}
function fromB64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

export async function encryptKey(plain: string): Promise<{ cipher: string; iv: string }> {
  const key = await aesKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const buf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(plain),
  );
  return { cipher: toB64(new Uint8Array(buf)), iv: toB64(iv) };
}

export async function decryptKey(cipher: string, iv: string): Promise<string> {
  const key = await aesKey();
  const buf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: fromB64(iv) },
    key,
    fromB64(cipher),
  );
  return new TextDecoder().decode(buf);
}

/** Aperçu masqué : seule forme de la clé qui peut atteindre le navigateur. */
export function maskKey(plain: string): string {
  const k = plain.trim();
  if (k.length <= 10) return "sk-***";
  return `${k.slice(0, 6)}…${k.slice(-4)}`;
}

/** Récupère et déchiffre la clé personnelle OpenAI de l'utilisateur. */
export async function loadUserOpenAIKey(
  service: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data } = await service
    .from("cover_pro_api_keys")
    .select("key_cipher,key_iv,provider")
    .eq("user_id", userId)
    .maybeSingle();
  if (!data?.key_cipher || !data?.key_iv) return null;
  try {
    return await decryptKey(data.key_cipher as string, data.key_iv as string);
  } catch {
    return null;
  }
}
