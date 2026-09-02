// Panneau de test admin — accorde ou retire des accès de TEST au Studio BD.
// Réservé aux administrateurs : écrit/supprime des lignes module_entitlements
// pour l'email de l'admin connecté, afin de vérifier le déverrouillage sans payer.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const MODULES = ["bd-comic", "bd-comic-pro"] as const;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Non authentifié" }, 401);

    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user?.email) return json({ error: "Non authentifié" }, 401);

    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (isAdmin !== true) return json({ error: "Réservé aux administrateurs" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    const environment = body?.environment === "live" ? "live" : "sandbox";
    const email = user.email.toLowerCase();

    const service = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "status") {
      const { data, error } = await service
        .from("module_entitlements")
        .select("module,status,environment,amount,created_at")
        .eq("email", email)
        .in("module", MODULES);
      if (error) throw error;
      return json({ email, environment, rows: data ?? [] });
    }

    if (action === "grant" || action === "grant_pro") {
      const modules = action === "grant" ? ["bd-comic"] : ["bd-comic", "bd-comic-pro"];
      for (const module of modules) {
        const { data: existing } = await service
          .from("module_entitlements")
          .select("id")
          .eq("email", email)
          .eq("module", module)
          .eq("environment", environment)
          .maybeSingle();
        if (existing?.id) {
          const { error } = await service
            .from("module_entitlements")
            .update({ status: "paid" })
            .eq("id", existing.id);
          if (error) throw error;
        } else {
          const { error } = await service.from("module_entitlements").insert({
            email,
            module,
            status: "paid",
            amount: module === "bd-comic" ? 17 : 47,
            currency: "eur",
            environment,
            stripe_session_id: `admin-test-${module}-${Date.now()}`,
          });
          if (error) throw error;
        }
      }
      return json({ success: true, email, environment, modules });
    }

    if (action === "revoke") {
      const { error } = await service
        .from("module_entitlements")
        .delete()
        .eq("email", email)
        .in("module", MODULES)
        .like("stripe_session_id", "admin-test-%");
      if (error) throw error;
      return json({ success: true, email, revoked: true });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (error) {
    console.error("bd-test-access error:", error);
    return json({ error: (error as Error).message }, 500);
  }
});
