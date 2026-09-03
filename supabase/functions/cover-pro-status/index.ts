// Cover Studio KDP Pro — état du droit d'accès, des crédits inclus et de la clé BYOK.
// Source unique de vérité pour le verrouillage de l'interface.
// Les 3 générations incluses sont créditées ici, une seule fois par compte, de
// façon idempotente (fonction SQL `cover_pro_grant_included_credits`).

import {
  authenticate,
  corsHeaders,
  hasCoverProRight,
  INCLUDED_GENERATIONS,
  json,
  serviceClient,
} from "../_shared/coverPro.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST" && req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  try {
    const user = await authenticate(req);
    if (!user) return json({ error: "Non authentifié", hasAccess: false }, 401);

    const service = serviceClient();
    const right = await hasCoverProRight(service, user);

    if (!right.granted) {
      return json({
        hasAccess: false,
        reason: null,
        credits: { granted: 0, used: 0, remaining: 0 },
        key: null,
      });
    }

    // Attribution unique des 3 générations offertes (jamais recréditées).
    const { data: credits } = await service.rpc("cover_pro_grant_included_credits", {
      _user_id: user.id,
      _amount: INCLUDED_GENERATIONS,
    });
    const row = Array.isArray(credits) ? credits[0] : credits;

    const { data: keyRow } = await service
      .from("cover_pro_api_keys")
      .select("provider,key_mask,last_tested_at,last_test_ok")
      .eq("user_id", user.id)
      .maybeSingle();

    return json({
      hasAccess: true,
      reason: right.reason,
      isAdmin: user.isAdmin,
      credits: {
        granted: row?.granted ?? 0,
        used: row?.used ?? 0,
        remaining: row?.remaining ?? 0,
      },
      key: keyRow
        ? {
          provider: keyRow.provider,
          mask: keyRow.key_mask,
          lastTestedAt: keyRow.last_tested_at,
          lastTestOk: keyRow.last_test_ok,
        }
        : null,
    });
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Erreur inattendue" }, 500);
  }
});
