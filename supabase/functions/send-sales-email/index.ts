import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { pushToSystemeIo } from "../_shared/systemeio.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Séquence courte 5 étapes + 1 relance non-cliqueurs (étape 6).
// Le contenu des emails vit désormais dans les automations Systeme.io.
// Ici on ne garde que le rythme (day_offset) pour savoir QUAND appliquer le tag.
const EMAIL_SEQUENCE = [
  { step: 1, day_offset: 0 },
  { step: 2, day_offset: 1 },
  { step: 3, day_offset: 2 },
  { step: 4, day_offset: 3 },
  { step: 5, day_offset: 4 },
  { step: 6, day_offset: 6 },
];

// Nombre de relances disponibles pour les non-cliqueurs (tags ebs-relance-1..3).
const RELANCE_MAX_ROUNDS = 3;

// Construit le tag Systeme.io de l'étape de séquence.
function seqTag(step: number, isInteresse: boolean): string {
  return isInteresse ? `ebs-seq-interesse-${step}` : `ebs-seq-${step}`;
}

// Construit le tag Systeme.io de relance (round 0 → ebs-relance-1).
function relanceTag(round: number): string {
  return `ebs-relance-${round + 1}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const body = await req.json();
    const mode = body.mode || "auto"; // "auto" = cron, "manual" = admin trigger
    const targetStep = body.step; // for manual: which step to send
    const prospectIds = body.prospect_ids; // for manual: specific prospects

    // relance = tag dédié aux non-cliqueurs (ne touche pas à l'étape de séquence)
    const isRelance = mode === "relance";
    const batchSize = body.batch_size || (isRelance ? 200 : 50);

    // ===== SÉCURITÉ : empêcher tout déclenchement non autorisé d'une campagne =====
    if (mode === "auto") {
      // Le cron doit fournir le secret partagé (stocké côté serveur uniquement)
      const provided = req.headers.get("x-cron-secret");
      const { data: secretRow } = await supabase
        .from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
      const cronSecret = secretRow?.value;
      if (!cronSecret || provided !== cronSecret) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // manual / relance : réservé aux administrateurs authentifiés
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const authClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: authData } = await authClient.auth.getUser();
      if (!authData?.user) {
        return new Response(JSON.stringify({ error: "Non authentifié" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: isAdmin } = await authClient.rpc("has_role", { _user_id: authData.user.id, _role: "admin" });
      if (isAdmin !== true) {
        return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    let query = supabase
      .from("sales_prospects")
      .select("*")
      .eq("status", "active")
      .eq("unsubscribed", false);

    // La relance vise aussi les prospects ayant terminé la séquence (sans avoir cliqué).
    if (!isRelance) {
      query = query.eq("completed", false);
    }

    // Anti-doublon par variante : on relance tant que les 3 variantes ne sont pas épuisées
    // (relance_round < RELANCE_MAX_ROUNDS), sauf si l'appel force explicitement (body.force === true).
    if (isRelance && !body.force) {
      query = query.lt("relance_round", RELANCE_MAX_ROUNDS);
    }

    if ((mode === "manual" || isRelance) && prospectIds?.length) {
      query = query.in("id", prospectIds);
    } else if (mode === "auto") {
      query = query.eq("auto_send", true).lte("next_email_at", new Date().toISOString());
    }

    query = query.order("next_email_at", { ascending: true }).limit(batchSize);

    const { data: prospects, error: fetchErr } = await query;
    if (fetchErr) throw fetchErr;

    // En mode auto on continue même sans prospect de séquence : la passe relance s'exécute ensuite.
    if ((!prospects || prospects.length === 0) && mode !== "auto") {
      return new Response(
        JSON.stringify({ success: true, sent: 0, message: "Aucun prospect à traiter" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let sent = 0;
    let errors = 0;

    for (let i = 0; i < (prospects?.length || 0); i++) {
      const prospect = prospects![i];

      // Rate limit doux pour rester sous les limites de l'API Systeme.io
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }

      // ===== Mode RELANCE : 3 variantes tournantes, n'incrémente pas l'étape =====
      if (isRelance) {
        const round = Math.min(prospect.relance_round ?? 0, RELANCE_MAX_ROUNDS - 1);
        const result = await pushToSystemeIo(prospect.email, prospect.first_name, [relanceTag(round)]);
        if (!result.ok) {
          console.error(`Systeme.io relance error for ${prospect.email}:`, result.detail);
          await supabase.from("sales_prospects").update({
            relance_status: "error",
          }).eq("id", prospect.id);
          errors++;
          continue;
        }
        const nowIso = new Date().toISOString();
        await supabase.from("sales_prospects").update({
          last_email_sent_at: nowIso,
          relance_sent_at: nowIso,
          relance_status: "sent",
          relance_round: round + 1,
        }).eq("id", prospect.id);
        sent++;
        continue;
      }

      const stepToSend = mode === "manual" && targetStep
        ? targetStep
        : prospect.current_step + 1;

      if (stepToSend > 6) {
        await supabase.from("sales_prospects").update({ completed: true }).eq("id", prospect.id);
        continue;
      }

      // Étape 6 = relance UNIQUEMENT pour ceux qui n'ont jamais cliqué.
      // Ceux qui ont cliqué sont des leads chauds : on clôture la séquence sans les relancer.
      if (stepToSend === 6) {
        const { count: clickCount } = await supabase
          .from("email_clicks")
          .select("id", { count: "exact", head: true })
          .ilike("prospect_email", prospect.email);
        if ((clickCount || 0) > 0) {
          await supabase.from("sales_prospects").update({
            completed: true,
            next_email_at: null,
          }).eq("id", prospect.id);
          continue;
        }
      }

      const seqInfo = EMAIL_SEQUENCE[stepToSend - 1];
      const isInteresse = prospect.source === "interesses";

      const result = await pushToSystemeIo(
        prospect.email,
        prospect.first_name,
        [seqTag(stepToSend, isInteresse)],
      );

      if (!result.ok) {
        console.error(`Systeme.io error for ${prospect.email}:`, result.detail);
        errors++;
        continue;
      }

      // Calculate next email time
      const nextStep = stepToSend + 1;
      const nextSeq = EMAIL_SEQUENCE[nextStep - 1];
      const daysBetween = nextSeq
        ? nextSeq.day_offset - seqInfo.day_offset
        : 0;

      const nextAt = new Date();
      nextAt.setDate(nextAt.getDate() + daysBetween);

      await supabase.from("sales_prospects").update({
        current_step: stepToSend,
        last_email_sent_at: new Date().toISOString(),
        next_email_at: nextSeq ? nextAt.toISOString() : null,
        completed: stepToSend >= 6,
      }).eq("id", prospect.id);

      sent++;
    }

    // ===== Passe RELANCE AUTOMATIQUE (cron) =====
    // Prospects ayant terminé la séquence, non-cliqueurs, non-clients,
    // avec encore des relances disponibles, espacées d'au moins 3 jours.
    let relanceAutoSent = 0;
    if (mode === "auto") {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const { data: relanceTargets } = await supabase
        .from("sales_prospects")
        .select("*")
        .eq("status", "active")
        .eq("unsubscribed", false)
        .gte("current_step", 5)
        .lt("relance_round", RELANCE_MAX_ROUNDS)
        .or(`relance_sent_at.is.null,relance_sent_at.lte.${threeDaysAgo}`)
        .order("relance_sent_at", { ascending: true, nullsFirst: true })
        .limit(batchSize);

      for (let i = 0; i < (relanceTargets?.length || 0); i++) {
        const prospect = relanceTargets![i];
        if (i > 0) await new Promise((r) => setTimeout(r, 400));

        // Stop si le prospect a déjà cliqué (lead chaud) → on ne le relance plus
        const { count: clickCount } = await supabase
          .from("email_clicks")
          .select("id", { count: "exact", head: true })
          .ilike("prospect_email", prospect.email);
        if ((clickCount || 0) > 0) {
          await supabase.from("sales_prospects")
            .update({ relance_round: RELANCE_MAX_ROUNDS })
            .eq("id", prospect.id);
          continue;
        }

        const round = Math.min(prospect.relance_round ?? 0, RELANCE_MAX_ROUNDS - 1);
        const result = await pushToSystemeIo(prospect.email, prospect.first_name, [relanceTag(round)]);
        if (!result.ok) {
          console.error(`Systeme.io relance auto error for ${prospect.email}:`, result.detail);
          await supabase.from("sales_prospects").update({ relance_status: "error" }).eq("id", prospect.id);
          errors++;
          continue;
        }
        const nowIso = new Date().toISOString();
        await supabase.from("sales_prospects").update({
          last_email_sent_at: nowIso,
          relance_sent_at: nowIso,
          relance_status: "sent",
          relance_round: round + 1,
        }).eq("id", prospect.id);
        relanceAutoSent++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: sent + relanceAutoSent, relanceAutoSent, errors, total: prospects?.length || 0, batchSize }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Sales email error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
