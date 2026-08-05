import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { isQuotaExhausted, sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { CHECKOUT_URL } from "../_shared/checkoutUrl.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const CAMPAIGN = "offre-47-sequence-2026";
const CHECKOUT = CHECKOUT_URL;

const DELAYS = [0, 2, 3, 2, 3];
const STEPS = [
  { subject: "Tout EbookStudio à 47 € — voici ce qui est inclus", heading: "Votre idée peut devenir un vrai livre", body: "Jusqu’au 30 septembre, l’accès complet à EbookStudio est à <strong>47 € au lieu de 59 €</strong>.<br><br>Un paiement unique, aucun abonnement : plan, rédaction, export Word/PDF, couverture KDP et fiche Amazon sont réunis dans un seul workflow.", cta: "Voir tout ce qui est inclus à 47 €" },
  { subject: "De votre idée à un livre prêt pour Amazon KDP", heading: "Vous apportez l’idée. EbookStudio construit le livre.", body: "Vous indiquez le sujet, validez le plan, puis le workflow rédige les chapitres et prépare les éléments de publication.<br><br>Vous restez maître du contenu : vous relisez, ajustez et exportez lorsque le résultat vous convient.", cta: "Transformer mon idée en livre" },
  { subject: "Voici les 5 étapes qui créent votre livre", heading: "Un workflow simple, sans page blanche", body: "1. Définir le sujet et le lecteur<br>2. Générer puis valider le plan<br>3. Rédiger les chapitres<br>4. Créer l’habillage et la couverture<br>5. Exporter le pack prêt à publier", cta: "Voir le workflow EbookStudio" },
  { subject: "Paiement, accès, accompagnement : réponses claires", heading: "Avant de décider, voici les réponses essentielles", body: "<strong>Un abonnement ?</strong> Non, 47 € est un paiement unique.<br><br><strong>L’accès expire ?</strong> Non, il est à vie et la V3 est incluse.<br><br><strong>Besoin d’être technicien ?</strong> Non, le workflow vous guide du plan à l’export.<br><br>Si vous bloquez, répondez à cet email : je vous réponds personnellement.", cta: "Vérifier l’offre et le paiement" },
  { subject: "Le tarif de 47 € se termine le 30 septembre", heading: "Dernier message sur le tarif de 47 €", body: "Le 30 septembre 2026 au soir, l’accès à vie repasse à <strong>59 €</strong>.<br><br>Si votre projet de livre attend depuis trop longtemps, vous pouvez obtenir maintenant le workflow complet pour 47 €, une seule fois.<br><br>C’est le dernier email de cette séquence. Il n’y aura pas de relance cachée ensuite.", cta: "Profiter du tarif avant le 30 septembre" },
] as const;

const normalize = (value: string) => value.trim().toLowerCase();
const templateName = (step: number) => `offre-47-unique-${step}`;
const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function trackedLink(baseUrl: string, email: string, step: number) {
  const destination = `${CHECKOUT}?src=${CAMPAIGN}-${step}&email=${encodeURIComponent(email)}`;
  return `${baseUrl}/functions/v1/track-email-click?e=${encodeURIComponent(email)}&s=${step}&t=${templateName(step)}&u=${encodeURIComponent(destination)}`;
}

function render(baseUrl: string, email: string, firstName: string, step: number) {
  const content = STEPS[step - 1];
  const link = trackedLink(baseUrl, email, step);
  const unsubscribe = `${baseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(email)}&seq=all`;
  const pixel = `${baseUrl}/functions/v1/track-email-open?e=${encodeURIComponent(email)}&s=${step}&t=${templateName(step)}`;
  return `<!doctype html><html lang="fr"><body style="margin:0;background:#f6f7f8;padding:24px 10px"><table role="presentation" width="100%"><tr><td align="center"><table role="presentation" width="580" style="max-width:580px;width:100%;background:#fff;border:1px solid #e5e7eb;border-collapse:collapse"><tr><td style="background:#008296;padding:20px 28px;color:#fff;font:700 22px Arial">EbookStudio</td></tr><tr><td style="padding:30px 28px;color:#232F3E;font:16px/1.65 Arial"><p>Bonjour${firstName ? ` ${firstName}` : ""},</p><h1 style="font:700 25px/1.25 Arial">${content.heading}</h1><p>${content.body}</p><table role="presentation" style="margin:28px auto"><tr><td bgcolor="#FF9E2D"><a href="${link}" style="display:inline-block;padding:16px 26px;color:#232F3E;text-decoration:none;font:700 16px Arial">${content.cta}</a></td></tr></table><p>Bien à vous,<br><strong>Georges Boubet</strong><br>EbookStudio</p></td></tr><tr><td style="padding:18px;background:#f6f7f8;text-align:center;color:#68737d;font:12px Arial">Vous recevez cet email car vous avez manifesté un intérêt pour EbookStudio.<br><a href="${unsubscribe}" style="color:#008296">Se désinscrire de tous les emails marketing</a></td></tr></table></td></tr></table><img src="${pixel}" width="1" height="1" alt="" style="display:none"></body></html>`;
}

async function isAdmin(req: Request, baseUrl: string) {
  const authorization = req.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const client = createClient(baseUrl, Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authorization } } });
  const { data } = await client.auth.getUser();
  if (!data.user) return false;
  const { data: allowed } = await client.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return allowed === true;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  try {
    const baseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const db = createClient(baseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const body = await req.json().catch(() => ({}));
    const mode = String(body.mode || "status");
    if (mode === "auto") {
      const { data: secret } = await db.from("app_secrets").select("value").eq("key", "cron_secret").maybeSingle();
      if (!secret?.value || req.headers.get("x-cron-secret") !== secret.value) return respond({ error: "Non autorisé" }, 401);
    } else if (!(await isAdmin(req, baseUrl))) return respond({ error: "Accès administrateur requis" }, 403);

    if (mode === "status") return respond({ campaign: CAMPAIGN, active: true, blocked: !EMAIL_SENDING_ENABLED, steps: STEPS.map((s, i) => ({ step: i + 1, subject: s.subject, template: templateName(i + 1) })) });
    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    let recipients: Array<{ id?: string; email: string; first_name: string; current_step: number }> = [];
    if (mode === "test") {
      const requested = Number(body.step || 0);
      const testEmail = normalize(String(body.test_email || ""));
      if (!isEmail(testEmail)) return respond({ error: "Adresse de test invalide" }, 400);
      recipients = (requested >= 1 && requested <= 5 ? [requested] : [1, 2, 3, 4, 5]).map((step) => ({ email: testEmail, first_name: "Georges", current_step: step - 1 }));
    } else {
      let query = db.from("sales_prospects").select("id,email,first_name,current_step").eq("status", "active").eq("unsubscribed", false).eq("auto_send", true).eq("completed", false).lte("next_email_at", new Date().toISOString()).order("next_email_at").limit(Math.min(Number(body.batch_size || 50), 100));
      if (mode === "manual" && Array.isArray(body.prospect_ids) && body.prospect_ids.length) query = db.from("sales_prospects").select("id,email,first_name,current_step").in("id", body.prospect_ids).eq("status", "active").eq("unsubscribed", false).limit(100);
      const { data, error } = await query;
      if (error) throw error;
      recipients = data || [];
    }

    const { data: orders } = await db.from("funnel_orders").select("email").eq("status", "paid");
    const buyers = new Set((orders || []).map((row) => normalize(row.email || "")));
    let sent = 0;
    let skipped = 0;
    for (const recipient of recipients) {
      const email = normalize(recipient.email || "");
      const step = mode === "test" ? recipient.current_step + 1 : Number(body.step || recipient.current_step + 1);
      if (!isEmail(email) || buyers.has(email) || !STEPS[step - 1]) { skipped++; continue; }
      const template = templateName(step);
      if (mode !== "test") {
        const { count } = await db.from("email_send_log").select("id", { count: "exact", head: true }).eq("recipient_email", email).eq("template_name", template).in("status", ["sent", "delivered"]);
        if ((count || 0) > 0) { skipped++; continue; }
      }
      const result = await sendResendEmailThrottled({ from: "Georges Boubet <noreply@ebookstudio.fr>", to: [email], subject: `${mode === "test" ? "[TEST] " : ""}${STEPS[step - 1].subject}`, html: render(baseUrl, email, recipient.first_name || "", step), reply_to: "contact@ebookstudio.fr" });
      await db.from("email_send_log").insert({ recipient_email: email, template_name: template, message_id: result.id || `${CAMPAIGN}-${step}-${email}`, status: result.ok ? "sent" : "failed", error_message: result.ok ? null : `HTTP ${result.status || ""}: ${result.detail || ""}` });
      if (!result.ok) { if (isQuotaExhausted()) break; continue; }
      sent++;
      if (mode !== "test" && recipient.id) {
        const completed = step >= 5;
        await db.from("sales_prospects").update({ current_step: step, last_email_sent_at: new Date().toISOString(), next_email_at: completed ? null : new Date(Date.now() + DELAYS[step] * 86400000).toISOString(), completed }).eq("id", recipient.id);
      }
    }
    return respond({ success: true, campaign: CAMPAIGN, sent, skipped });
  } catch (error) {
    console.error("send-sales-email", error);
    return respond({ error: error instanceof Error ? error.message : "Erreur serveur" }, 500);
  }
});