// Cover Studio KDP Pro — administration du droit d'accès.
// Réservé aux administrateurs : accorde ou retire manuellement le droit
// `cover_studio_pro` pour un email. Réutilise `module_entitlements`
// (aucun second système de paiement).
//
// Les 3 générations incluses ne sont JAMAIS recréditées : la table
// `cover_pro_credits` conserve `granted_once = true` même après une révocation.

import {
  authenticate,
  corsHeaders,
  COVER_PRO_MODULE,
  json,
  serviceClient,
} from "../_shared/coverPro.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const user = await authenticate(req);
    if (!user) return json({ error: "Non authentifié" }, 401);
    if (!user.isAdmin) return json({ error: "Réservé aux administrateurs" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = String(body?.action ?? "");
    const target = String(body?.email ?? user.email).trim().toLowerCase();
    const environment = body?.environment === "live" ? "live" : "sandbox";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)) {
      return json({ error: "Email invalide" }, 400);
    }

    const service = serviceClient();

    if (action === "status") {
      const { data, error } = await service
        .from("module_entitlements")
        .select("id,email,status,environment,amount,created_at")
        .eq("email", target)
        .eq("module", COVER_PRO_MODULE);
      if (error) throw error;

      const { data: authUser } = await service.auth.admin.listUsers({ page: 1, perPage: 1000 });
      const found = authUser?.users?.find((u) => (u.email ?? "").toLowerCase() === target);
      let credits: unknown = null;
      if (found) {
        const { data: c } = await service
          .from("cover_pro_credits")
          .select("granted,used,granted_once")
          .eq("user_id", found.id)
          .maybeSingle();
        credits = c ?? null;
      }
      return json({ entitlements: data ?? [], credits });
    }

    if (action === "grant") {
      const { data: existing } = await service
        .from("module_entitlements")
        .select("id")
        .eq("email", target)
        .eq("module", COVER_PRO_MODULE)
        .maybeSingle();

      if (existing?.id) {
        const { error } = await service
          .from("module_entitlements")
          .update({ status: "active" })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await service.from("module_entitlements").insert({
          email: target,
          module: COVER_PRO_MODULE,
          status: "active",
          amount: 0,
          currency: "eur",
          environment,
        });
        if (error) throw error;
      }
      return json({ ok: true, granted: true, email: target });
    }

    if (action === "revoke") {
      const { error } = await service
        .from("module_entitlements")
        .update({ status: "revoked" })
        .eq("email", target)
        .eq("module", COVER_PRO_MODULE);
      if (error) throw error;
      return json({ ok: true, granted: false, email: target });
    }

    return json({ error: "Action inconnue" }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Erreur inattendue" }, 500);
  }
});
