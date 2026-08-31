/**
 * DIFFUSION RÉELLE de la campagne unique (5 emails « cadeau-1 … cadeau-5 »).
 *
 * Modes :
 * - `stats` : compteurs (prospects éligibles, déjà envoyés, désinscrits, acheteurs) ;
 * - `reset` : remise à zéro des compteurs (étapes des prospects + journaux/ouvertures/clics
 *   des templates de la campagne) pour pouvoir relancer proprement ;
 * - `send`  : envoi par lot d'un email de la campagne, sans doublon.
 *
 * Réservé aux administrateurs (has_role). Le HTML est rendu côté admin puis
 * personnalisé ici (prénom, désinscription, pixel d'ouverture).
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { isQuotaExhausted, sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED } from "../_shared/emailSendingGuard.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEMPLATES = ["cadeau-1", "cadeau-2", "cadeau-3", "cadeau-4", "cadeau-5"] as const;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const normalize = (value: string) => value.trim().toLowerCase();

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

/** Enveloppe l'email : prénom, pied de page de désinscription, pixel d'ouverture. */
function personalize(html: string, baseUrl: string, email: string, firstName: string, template: string) {
  const step = TEMPLATES.indexOf(template as typeof TEMPLATES[number]) + 1;
  const unsubscribe = `${baseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(email)}&seq=all`;
  const pixel = `${baseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}&t=${template}`;
  const withName = firstName
    ? html.replace("Bonjour,", `Bonjour ${firstName},`)
    : html;
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f6f7f8;padding:24px 12px">
<div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;padding:26px 24px">
${withName}
<p style="margin:26px 0 0;padding:14px 0 0;border-top:1px solid #e5e7eb;text-align:center;color:#68737d;font:12px/1.6 Arial,Helvetica,sans-serif">Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#0f6b5c">Se désinscrire</a></p>
</div>
<img src="${pixel}" width="1" height="1" alt="" style="display:none"></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const authHeader = req.headers.get("Authorization") ?? "";

    const asUser = createClient(baseUrl, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: auth } = await asUser.auth.getUser();
    if (!auth?.user) return json({ error: "Non authentifié" }, 401);
    const { data: allowed } = await asUser.rpc("has_role", { _user_id: auth.user.id, _role: "admin" });
    if (allowed !== true) return json({ error: "Réservé aux administrateurs" }, 403);

    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || "stats");

    /* ------------------------------- STATS ------------------------------- */
    if (mode === "stats") {
      const { count: total } = await db.from("sales_prospects").select("id", { count: "exact", head: true });
      const { count: active } = await db
        .from("sales_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .eq("unsubscribed", false);
      const { count: unsubscribed } = await db
        .from("sales_prospects")
        .select("id", { count: "exact", head: true })
        .eq("unsubscribed", true);

      const perTemplate: Record<string, number> = {};
      for (const template of TEMPLATES) {
        const { count } = await db
          .from("email_send_log")
          .select("id", { count: "exact", head: true })
          .eq("template_name", template)
          .in("status", ["sent", "delivered"]);
        perTemplate[template] = count ?? 0;
      }

      return json({
        success: true,
        blocked: !EMAIL_SENDING_ENABLED,
        total: total ?? 0,
        active: active ?? 0,
        unsubscribed: unsubscribed ?? 0,
        sent: perTemplate,
      });
    }

    /* ------------------------------- RESET ------------------------------- */
    if (mode === "reset") {
      const { error: prospectError } = await db
        .from("sales_prospects")
        .update({
          current_step: 0,
          last_email_sent_at: null,
          next_email_at: new Date().toISOString(),
          completed: false,
          relance_round: 0,
          relance_sent_at: null,
          relance_status: null,
        })
        .eq("unsubscribed", false);
      if (prospectError) throw prospectError;

      await db.from("email_send_log").delete().in("template_name", [...TEMPLATES]);
      await db.from("email_opens").delete().in("template_name", [...TEMPLATES]);
      await db.from("email_clicks").delete().in("template_name", [...TEMPLATES]);

      const { count: active } = await db
        .from("sales_prospects")
        .select("id", { count: "exact", head: true })
        .eq("status", "active")
        .eq("unsubscribed", false);

      return json({ success: true, mode, reset: true, ready: active ?? 0 });
    }

    /* -------------------------------- SEND ------------------------------- */
    if (mode === "send") {
      if (!EMAIL_SENDING_ENABLED) return json({ error: "Envoi d'emails désactivé sur ce projet" }, 409);

      const template = String(body.emailId || "");
      if (!TEMPLATES.includes(template as typeof TEMPLATES[number])) return json({ error: "Email de campagne inconnu" }, 400);
      const subject = String(body.subject || "");
      const html = String(body.html || "");
      if (!subject || subject.length > 300) return json({ error: "Objet invalide" }, 400);
      if (!html || html.length > 200_000) return json({ error: "Contenu invalide" }, 400);
      const limit = Math.min(Math.max(Number(body.batch_size || 100), 1), 300);
      const step = TEMPLATES.indexOf(template as typeof TEMPLATES[number]) + 1;

      // Journal des envois déjà faits — paginé (PostgREST plafonne à 1000 lignes).
      // Tous les statuts comptent : une tentative enregistrée interdit un second envoi.
      const done = new Set<string>();
      for (let offset = 0; offset < 50000; offset += 1000) {
        const { data: logRows, error: logError } = await db
          .from("email_send_log")
          .select("recipient_email")
          .eq("template_name", template)
          .order("created_at", { ascending: true })
          .range(offset, offset + 999);
        if (logError) throw logError;
        if (!logRows || logRows.length === 0) break;
        for (const row of logRows) done.add(normalize(row.recipient_email || ""));
        if (logRows.length < 1000) break;
      }

      const { data: paidOrders } = await db.from("funnel_orders").select("email").eq("status", "paid");
      const paid = new Set((paidOrders || []).map((r) => normalize(r.email || "")));

      // PostgREST plafonne chaque réponse à 1000 lignes : on pagine, sinon les
      // prospects au-delà du millième ne recevraient jamais la campagne.
      const targets: Array<{ email: string; first_name: string }> = [];
      const seen = new Set<string>();
      let eligible = 0;
      const page = 1000;
      for (let offset = 0; offset < 20000; offset += page) {
        const { data: rows, error: rowsError } = await db
          .from("sales_prospects")
          .select("email,first_name")
          .eq("status", "active")
          .eq("unsubscribed", false)
          .order("email", { ascending: true })
          .range(offset, offset + page - 1);
        if (rowsError) throw rowsError;
        if (!rows || rows.length === 0) break;
        for (const row of rows) {
          const email = normalize(String(row.email || ""));
          if (!isEmail(email) || seen.has(email) || paid.has(email)) continue;
          seen.add(email);
          if (done.has(email)) continue;
          eligible++;
          if (targets.length < limit) targets.push({ email, first_name: String(row.first_name || "") });
        }
        if (rows.length < page) break;
      }

      const remaining = Math.max(eligible - targets.length, 0);
      if (body.dry_run) return json({ success: true, mode, template, would_send: targets.length, remaining });

      let sent = 0;
      let skipped = 0;
      const failures: Array<{ email: string; error: string }> = [];
      for (const target of targets) {
        // RÉSERVATION AVANT ENVOI : un index unique (template_name, lower(email))
        // rend le doublon impossible, même si deux lots partent en parallèle.
        const { data: claim, error: claimError } = await db
          .from("email_send_log")
          .insert({
            recipient_email: target.email,
            template_name: template,
            message_id: `${template}-${target.email}`,
            status: "sending",
          })
          .select("id")
          .maybeSingle();

        if (claimError || !claim) {
          skipped++;
          continue;
        }

        const result = await sendResendEmailThrottled({
          from: FROM_CAMPAIGN,
          to: [target.email],
          subject,
          html: personalize(html, baseUrl, target.email, target.first_name, template),
          reply_to: REPLY_TO,
        });

        await db
          .from("email_send_log")
          .update({
            provider_message_id: result.id || null,
            message_id: result.id || `${template}-${target.email}`,
            status: result.ok ? "sent" : "failed",
            error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}`,
          })
          .eq("id", claim.id);

        if (!result.ok) {
          failures.push({ email: target.email, error: `HTTP ${result.status || ""}` });
          if (isQuotaExhausted()) break;
          continue;
        }

        sent++;
        await db
          .from("sales_prospects")
          .update({
            current_step: step,
            last_email_sent_at: new Date().toISOString(),
            next_email_at: step >= TEMPLATES.length ? null : new Date(Date.now() + 2 * 86400000).toISOString(),
            completed: step >= TEMPLATES.length,
          })
          .eq("email", target.email);
      }


      return json({
        success: true,
        mode,
        template,
        targets: targets.length,
        sent,
        failed: failures.length,
        failures: failures.slice(0, 20),
        remaining: Math.max(remaining, 0),
        quota_exhausted: isQuotaExhausted(),
      });
    }

    return json({ error: "Mode inconnu" }, 400);
  } catch (err) {
    console.error("send-campagne-unique error", err);
    return json({ error: (err as Error).message ?? "Erreur inconnue" }, 500);
  }
});
