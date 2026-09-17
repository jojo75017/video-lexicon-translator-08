import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { CHECKOUT_URL, SITE_ORIGIN } from "../_shared/checkoutUrl.ts";

/**
 * Relance unique des prospects qui ont demandé un pack de niches gratuit
 * (5 niches, 10 niches, essai) et n'ont jamais commandé.
 *
 * Public réellement tiède : ils ont laissé leur email volontairement.
 * Un seul email par adresse, jamais deux : le garde-fou est `email_send_log`
 * (template `relance-leads-niches`).
 *
 * Sécurité : admin (has_role) ou secret cron.
 * Modes : `status` / `preview` (aucun envoi) et `send`.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const TEMPLATE = "relance-leads-niches";
const PREVIEW_URL = `${SITE_ORIGIN}/r/apv3`;

/** Adresses internes, jetables ou de test : jamais relancées. */
function isInternalEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  if (!e || !e.includes("@")) return true;
  if (e.endsWith("@example.com")) return true;
  if (e.endsWith("@ebookstudio.fr")) return true;
  if (e.endsWith("@yopmail.com")) return true;
  if (e.endsWith("@duck.com")) return true;
  if (e.includes("+test")) return true;
  if (e.includes("test-") || e.includes("-test")) return true;
  if (e.startsWith("boubetgeorges")) return true;
  return false;
}

function html(firstName: string | null): string {
  const hello = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 21px/1.3 Arial,Helvetica,sans-serif">
Vous aviez demandé mes niches — voici la suite
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">${hello}</p>
<p style="margin:0 0 16px">Vous avez téléchargé mon pack de niches KDP il y a quelque temps. Une question simple : avez-vous écrit le livre depuis ?</p>
<p style="margin:0 0 16px">Si la réponse est non, c'est normal. Trouver la niche est la partie facile. Écrire les 40 chapitres, corriger, faire une couverture qui tient debout et sortir un fichier accepté par Amazon, c'est là que tout le monde s'arrête.</p>
<p style="margin:0 0 16px">C'est exactement ce que fait EbookStudio, de bout en bout. Je viens de mettre en ligne une présentation complète, en vidéo, sans rien à installer ni à payer pour la regarder :</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px"><tr>
<td style="background:#008296;border-radius:8px"><a href="${PREVIEW_URL}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">Voir la présentation</a></td>
</tr></table>
<p style="margin:0 0 16px;font-size:15px">Et si vous voulez aller au bout : l'accès complet est à <strong>47 € une seule fois, conservé à vie</strong>, jusqu'au 30 septembre. À partir du 1<sup>er</sup> octobre, l'accès passe en abonnement, à 27 € ou 47 € par mois selon la formule. <a href="${CHECKOUT_URL}?src=relance-leads-niches" style="color:#008296">Prendre l'accès à vie</a> — garantie 30 jours, remboursement sur simple demande.</p>
<p style="margin:0 0 8px;font-size:14px;color:#555">Une question, un doute, un blocage sur votre projet de livre ? Répondez à ce message : je lis et je réponds personnellement.</p>
<p style="margin:20px 0 0">Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio</span></p>
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
    const mode = String(body.mode || "status");

    const { data: cronSecret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
    const hasCronSecret = !!cronSecret?.value && req.headers.get("x-cron-secret") === cronSecret.value;
    if (!hasCronSecret && !(await isAdmin(req, baseUrl))) {
      return respond({ error: "Accès administrateur requis" }, 403);
    }

    const { data: leads, error } = await db
      .from("funnel_leads")
      .select("id,email,first_name,lead_magnet,created_at")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) throw error;

    // Exclusions : clients payants, abonnés actifs, adresses déjà relancées.
    const excluded = new Set<string>();
    const { data: paidOrders } = await db.from("funnel_orders").select("email").eq("status", "paid").limit(5000);
    for (const r of paidOrders || []) excluded.add(String((r as any).email || "").toLowerCase());
    const { data: paidInst } = await db
      .from("v3_installment_orders").select("email").in("status", ["active", "completed", "paid"]).limit(5000);
    for (const r of paidInst || []) excluded.add(String((r as any).email || "").toLowerCase());
    const { data: subs } = await db.from("subscribers").select("email").eq("status", "active").limit(5000);
    for (const r of subs || []) excluded.add(String((r as any).email || "").toLowerCase());
    const { data: already } = await db
      .from("email_send_log").select("recipient_email").eq("template_name", TEMPLATE).limit(5000);
    for (const r of already || []) excluded.add(String((r as any).recipient_email || "").toLowerCase());

    const seen = new Set<string>();
    const candidates: Array<{ id: string; email: string; first_name: string | null; lead_magnet: string | null }> = [];
    for (const lead of leads || []) {
      const email = String((lead as any).email || "").trim().toLowerCase();
      if (isInternalEmail(email)) continue;
      if (excluded.has(email)) continue;
      if (seen.has(email)) continue;
      seen.add(email);
      candidates.push({
        id: String((lead as any).id),
        email,
        first_name: (lead as any).first_name ?? null,
        lead_magnet: (lead as any).lead_magnet ?? null,
      });
    }

    if (mode === "status" || mode === "preview") {
      return respond({
        success: true,
        mode,
        template: TEMPLATE,
        would_send: candidates.length,
        targets: candidates.map((c) => ({ email: c.email, lead_magnet: c.lead_magnet })),
      });
    }

    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    let sent = 0;
    const errors: string[] = [];
    for (const lead of candidates) {
      const res = await sendResendEmailThrottled({
        from: "Georges Boubet <noreply@ebookstudio.fr>",
        to: [lead.email],
        reply_to: "contact@ebookstudio.fr",
        subject: "Vous aviez demandé mes niches KDP — et depuis ?",
        html: html(lead.first_name),
      });
      if (res?.ok) {
        sent++;
        await db.from("email_send_log").insert({
          message_id: res.id ?? null,
          template_name: TEMPLATE,
          recipient_email: lead.email,
          status: "sent",
        });
      } else {
        errors.push(`${lead.email}: ${res?.detail || "envoi refusé"}`);
      }
    }

    return respond({ success: true, mode, template: TEMPLATE, targets: candidates.length, sent, errors });
  } catch (e) {
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
