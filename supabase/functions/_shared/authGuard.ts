// Garde partagée : exige un utilisateur connecté (ou un admin) avant toute action coûteuse ou sensible.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const baseCors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function deny(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...baseCors, "Content-Type": "application/json" },
  });
}

export type GuardUser = { id: string; email: string | null };

/** Retourne l'utilisateur connecté, ou une réponse 401 à renvoyer telle quelle. */
export async function requireUser(req: Request): Promise<GuardUser | Response> {
  const header = req.headers.get("Authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return deny(401, "Connexion requise.");
  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  if (token === anon) return deny(401, "Connexion requise.");
  if (token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) return { id: "service", email: null };
  const client = createClient(url, anon, { global: { headers: { Authorization: `Bearer ${token}` } } });
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user) return deny(401, "Connexion requise.");
  return { id: data.user.id, email: data.user.email ?? null };
}

export async function isAdmin(userId: string): Promise<boolean> {
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data } = await admin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  return !!data;
}

/** Retourne l'admin connecté, ou une réponse 401/403. */
export async function requireAdmin(req: Request): Promise<GuardUser | Response> {
  const u = await requireUser(req);
  if (u instanceof Response) return u;
  if (!(await isAdmin(u.id))) return deny(403, "Réservé à l'administrateur.");
  return u;
}

/** Accepte un appel interne (clé service) ou un admin connecté. */
export async function requireAdminOrService(req: Request): Promise<true | Response> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "").trim();
  if (token && token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) return true;
  const a = await requireAdmin(req);
  return a instanceof Response ? a : true;
}
