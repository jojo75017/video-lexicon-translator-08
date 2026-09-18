import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { FROM_CAMPAIGN, REPLY_TO } from "../_shared/emailIdentity.ts";

/**
 * Relance unique « devis correction / mise en forme + inscription V3 ».
 *
 * Deux blocs de poids égal : je le fais pour vous (prestation, devis à partir
 * de 149 €) ou vous le faites vous-même (V3 au 1er octobre).
 *
 * Cible, dans cet ordre : paniers abandonnés (funnel_orders en attente),
 * prospects actifs non désinscrits, leads de tunnel.
 * Un seul email par adresse, jamais deux : garde-fou sur `email_send_log`.
 *
 * Modes : `status` / `preview` (aucun envoi), `test` (vers l'admin), `send`.
 * Réservé aux administrateurs (has_role).
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TEMPLATE = "relance-devis-v3";
const SUBJECT = "Votre livre est écrit. Il n'est pas encore publiable.";
const LINK_DEVIS = "https://ebookstudio.fr/r/devis1";
const LINK_V3 = "https://ebookstudio.fr/r/v3insc";
const BATCH_MAX = 200;

function isInternalEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  if (e.endsWith("@example.com")) return true;
  if (e.endsWith("@ebookstudio.fr")) return true;
  if (e.includes("+test") || e.includes("test-") || e.includes("-test")) return true;
  if (e.startsWith("boubetgeorges")) return true;
  return false;
}

function html(firstName: string | null): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 20px/1.35 Arial,Helvetica,sans-serif">
Un manuscrit n'est pas un livre publiable
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">${hello}</p>
<p style="margin:0 0 16px">Soyons direct. Un texte écrit n'est pas un livre vendable. Sans correction sérieuse, sans mise en page aux normes, sans couverture aux bons gabarits, Amazon refuse le fichier ou les lecteurs referment le livre à la page trois. C'est la raison numéro un des publications qui ne vendent rien.</p>
<p style="margin:0 0 20px">Deux façons d'en sortir. Choisissez la vôtre.</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border:1px solid #e5e7eb;border-radius:10px">
<tr><td style="padding:18px 20px">
<p style="margin:0 0 8px;font:700 17px Arial,Helvetica,sans-serif;color:#0f5132">1. Je le fais pour vous</p>
<p style="margin:0 0 12px;font-size:15px">Correction complète, mise en forme aux normes KDP, couverture professionnelle, accompagnement jusqu'au dépôt sur votre compte. Devis à partir de 149 €, réponse sous 24 h.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:#FF9E2D;border-radius:8px"><a href="${LINK_DEVIS}" style="display:inline-block;padding:13px 24px;color:#232F3E;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">Demander mon devis (à partir de 149 €)</a></td>
</tr></table>
</td></tr></table>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;border:1px solid #e5e7eb;border-radius:10px">
<tr><td style="padding:18px 20px">
<p style="margin:0 0 8px;font:700 17px Arial,Helvetica,sans-serif;color:#0f5132">2. Je le fais moi-même</p>
<p style="margin:0 0 12px;font-size:15px">EbookStudio V3 ouvre le 1<sup>er</sup> octobre : écriture chapitre par chapitre, correcteur intégré, couvertures Kindle et broché, fiche KDP prête à coller. 27 € par mois (Plume) ou 47 € par mois (Édition), sans engagement.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:#232F3E;border-radius:8px"><a href="${LINK_V3}" style="display:inline-block;padding:13px 24px;color:#ffffff;text-decoration:none;font:700 15px Arial,Helvetica,sans-serif">M'inscrire à la V3</a></td>
</tr></table>
</td></tr></table>

<p style="margin:0 0 16px;font-size:15px">Le 1<sup>er</sup> octobre, la V3 ouvre et les places d'accompagnement de la rentrée sont prises en premier arrivé. Si votre manuscrit dort depuis des mois, c'est maintenant qu'il faut trancher.</p>
<p style="margin:0 0 8px;font-size:14px;color:#555">Une question avant de décider ? Répondez à ce message : je lis et je réponds personnellement.</p>
<p style="margin:18px 0 0">Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio</span></p>
<p style="margin:18px 0 0;font-size:12px;color:#888">Vous recevez ce message parce que vous avez laissé votre adresse sur EbookStudio. Répondez « STOP » et je vous retire définitivement de la liste.</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

async function isAdmin(req: Request, baseUrl: string) {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const client = createClient(baseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
    global: { headers: { Authorization: authorization } },
  });
  const { data } = await client.auth.getUser();
  if (!data.user) return false;
  const { data: allowed } = await client.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return allowed === true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({}));
    const mode = String((body as Record<string, unknown>).mode || "status");
    const limit = Math.min(BATCH_MAX, Math.max(1, Number((body as Record<string, unknown>).limit) || BATCH_MAX));

    if (!(await isAdmin(req, baseUrl))) return respond({ error: "Accès administrateur requis" }, 403);

    // Envoi de contrôle vers la boîte de l'administrateur.
    if (mode === "test") {
      if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [REPLY_TO],
        reply_to: REPLY_TO,
        subject: `[TEST] ${SUBJECT}`,
        html: html("Georges"),
      });
      return res?.ok
        ? respond({ success: true, mode, sent: 1, to: REPLY_TO })
        : respond({ success: false, mode, sent: 0, error: res?.detail || "envoi refusé" });
    }

    /* ---------------- Exclusions ---------------- */
    const excluded = new Set<string>();
    const { data: paidOrders } = await db.from("funnel_orders").select("email").eq("status", "paid").limit(5000);
    for (const r of paidOrders || []) excluded.add(String((r as Record<string, unknown>).email || "").toLowerCase());
    const { data: paidInst } = await db
      .from("v3_installment_orders").select("email").in("status", ["active", "completed", "paid"]).limit(5000);
    for (const r of paidInst || []) excluded.add(String((r as Record<string, unknown>).email || "").toLowerCase());
    const { data: subs } = await db.from("subscribers").select("email").eq("status", "active").limit(5000);
    for (const r of subs || []) excluded.add(String((r as Record<string, unknown>).email || "").toLowerCase());

    // Déjà touché par cette relance : jamais deux fois.
    for (let from = 0; from < 20000; from += 1000) {
      const { data: already } = await db
        .from("email_send_log").select("recipient_email").eq("template_name", TEMPLATE)
        .range(from, from + 999);
      if (!already?.length) break;
      for (const r of already) excluded.add(String((r as Record<string, unknown>).recipient_email || "").toLowerCase());
      if (already.length < 1000) break;
    }

    /* ---------------- Candidats ---------------- */
    type Candidate = { email: string; first_name: string | null; source: string };
    const seen = new Set<string>();
    const candidates: Candidate[] = [];
    const push = (email: string, first_name: string | null, source: string) => {
      const e = email.trim().toLowerCase();
      if (isInternalEmail(e) || excluded.has(e) || seen.has(e)) return;
      seen.add(e);
      candidates.push({ email: e, first_name: first_name || null, source });
    };

    // 1. Paniers abandonnés d'abord.
    const { data: pending } = await db
      .from("funnel_orders").select("email,first_name,created_at")
      .eq("status", "pending").order("created_at", { ascending: false }).limit(1000);
    for (const r of pending || []) {
      push(String((r as Record<string, unknown>).email || ""), (r as Record<string, unknown>).first_name as string | null, "panier");
    }

    // 2. Prospects actifs non désinscrits.
    for (let from = 0; from < 10000; from += 1000) {
      const { data: prospects } = await db
        .from("sales_prospects").select("email,first_name,unsubscribed")
        .or("unsubscribed.is.null,unsubscribed.eq.false")
        .range(from, from + 999);
      if (!prospects?.length) break;
      for (const r of prospects) {
        push(String((r as Record<string, unknown>).email || ""), (r as Record<string, unknown>).first_name as string | null, "prospect");
      }
      if (prospects.length < 1000) break;
    }

    // 3. Leads de tunnel.
    const { data: leads } = await db.from("funnel_leads").select("email,first_name").limit(1000);
    for (const r of leads || []) {
      push(String((r as Record<string, unknown>).email || ""), (r as Record<string, unknown>).first_name as string | null, "lead");
    }

    if (mode === "status" || mode === "preview") {
      return respond({
        success: true,
        mode,
        template: TEMPLATE,
        subject: SUBJECT,
        would_send: candidates.length,
        batch_max: BATCH_MAX,
        targets: candidates.slice(0, 50).map((c) => ({ email: c.email, source: c.source })),
      });
    }

    if (mode !== "send") return respond({ error: "Mode inconnu" }, 400);
    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    const batch = candidates.slice(0, limit);
    let sent = 0;
    const errors: string[] = [];
    for (const target of batch) {
      const res = await sendResendEmailThrottled({
        from: FROM_CAMPAIGN,
        to: [target.email],
        reply_to: REPLY_TO,
        subject: SUBJECT,
        html: html(target.first_name),
        tags: [{ name: "template", value: TEMPLATE }],
      });
      if (res?.ok) {
        sent++;
        await db.from("email_send_log").insert({
          message_id: res.id ?? null,
          template_name: TEMPLATE,
          recipient_email: target.email,
          status: "sent",
        });
      } else {
        errors.push(`${target.email}: ${res?.detail || "envoi refusé"}`);
        // Refus de la plateforme (quota, clé, domaine) : on arrête net le lot.
        if (res?.quotaExhausted || res?.status === 429 || res?.status === 401 || res?.status === 403) break;
      }
    }

    return respond({
      success: true,
      mode,
      template: TEMPLATE,
      targets: candidates.length,
      sent,
      remaining: Math.max(0, candidates.length - sent),
      errors,
    });
  } catch (e) {
    console.error("send-relance-devis-v3 error:", e);
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
