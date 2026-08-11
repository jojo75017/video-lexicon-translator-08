import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";

/**
 * Mode d'emploi du Correcteur de livre envoyé aux abonnés (V2 inclus).
 *
 * Les acheteurs V2 gardent l'accès gratuit à vie au Correcteur (`/v3/corriger`),
 * ce message leur explique comment nettoyer un manuscrit déjà écrit.
 *
 * Sécurité : admin (has_role) ou secret cron.
 * Modes : `status` (aperçu des destinataires), `preview` (aucun envoi), `send`.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const TEMPLATE = "correcteur-mode-emploi";
const APP_URL = "https://ebookstudio.fr/v3/corriger";

function html(): string {
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 21px/1.3 Arial,Helvetica,sans-serif">
Nettoyez vos livres en quelques minutes
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">Bonjour,</p>
<p style="margin:0 0 16px">Si l'un de vos manuscrits contient encore des scories — mots en latin ou en langue étrangère, formules inventées, fautes d'accord, ponctuation bancale — vous pouvez maintenant le nettoyer vous-même, sans réécrire une ligne à la main.</p>
<p style="margin:0 0 10px;font:700 17px Arial,Helvetica,sans-serif">Comment faire, étape par étape</p>
<ol style="margin:0 0 18px;padding-left:22px">
<li style="margin-bottom:8px">Connectez-vous, puis ouvrez <strong>Corriger mon livre</strong> (menu « Tous les outils »).</li>
<li style="margin-bottom:8px">Importez votre manuscrit : fichier <strong>Word (.docx)</strong>, <strong>PDF</strong>, lien d'article ou simple copier-coller du texte. Le livre est découpé en chapitres automatiquement, sans perte de texte.</li>
<li style="margin-bottom:8px">Choisissez le mode : <strong>Correction stricte</strong> (orthographe, grammaire, accords, ponctuation, mots étrangers — aucune réécriture) ou <strong>Correction + polissage</strong> (répétitions et lourdeurs allégées en plus).</li>
<li style="margin-bottom:8px">Lancez la correction : elle avance chapitre par chapitre, et vous pouvez relancer un chapitre isolé sans perdre le reste.</li>
<li style="margin-bottom:8px">Relisez : pour chaque chapitre vous voyez <strong>l'avant / après en couleur</strong> et la liste des corrections. Rien n'est retenu tant que vous n'avez pas cliqué sur <strong>« Accepter ce chapitre »</strong> (ou « Tout accepter »). Vous pouvez aussi réécrire un passage à la main.</li>
<li>Exportez votre livre corrigé en <strong>Word et PDF</strong>, sommaire propre, prêt pour Amazon KDP.</li>
</ol>
<p style="margin:0 0 18px">À savoir : le Correcteur écrit désormais <strong>100 % en français</strong>. Les inscriptions latines et les mots inventés sont traduits ou remplacés, et aucune phrase n'est ajoutée à votre texte.</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px"><tr>
<td style="background:#008296;border-radius:8px"><a href="${APP_URL}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">Corriger mon livre</a></td>
</tr></table>
<p style="margin:0 0 8px;font-size:14px;color:#555">Si vous avez acheté la version précédente d'EbookStudio, le Correcteur vous est offert à vie — rien à payer.</p>
<p style="margin:0;font-size:14px;color:#555">Une question, un fichier qui coince ? Répondez à ce message, je regarde personnellement.</p>
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

    // Destinataires : abonnés actifs (tous paliers, V2 à vie comprise).
    const { data: subs } = await db
      .from("subscribers")
      .select("email,status")
      .in("status", ["active", "trialing"])
      .limit(2000);

    const { data: already } = await db
      .from("email_send_log")
      .select("recipient_email")
      .eq("template_name", TEMPLATE)
      .limit(5000);
    const done = new Set((already || []).map((r: any) => String(r.recipient_email).toLowerCase()));

    const explicit: string[] = Array.isArray(body.emails)
      ? body.emails.map((e: unknown) => String(e).trim().toLowerCase()).filter((e: string) => e.includes("@"))
      : [];

    const pool = explicit.length
      ? explicit
      : Array.from(new Set((subs || []).map((s: any) => String(s.email || "").trim().toLowerCase()).filter(Boolean)));
    const targets = explicit.length ? pool : pool.filter((e) => !done.has(e));

    if (mode === "status" || mode === "preview") {
      return respond({ success: true, mode, template: TEMPLATE, would_send: targets.length, targets });
    }

    if (!EMAIL_SENDING_ENABLED) return respond(emailSendingBlockedResult(), 423);

    let sent = 0;
    const errors: string[] = [];
    for (const email of targets) {
      const res = await sendResendEmailThrottled({
        from: "Georges Boubet <noreply@ebookstudio.fr>",
        to: [email],
        reply_to: "contact@ebookstudio.fr",
        subject: "Comment nettoyer un livre déjà écrit (mode d'emploi)",
        html: html(),
      });
      if (res?.ok) {
        sent++;
        await db.from("email_send_log").insert({
          message_id: res.id ?? null,
          template_name: TEMPLATE,
          recipient_email: email,
          status: "sent",
        });
      } else {
        errors.push(`${email}: ${res?.detail || "envoi refusé"}`);
      }
    }

    return respond({ success: true, mode, template: TEMPLATE, targets: targets.length, sent, errors });
  } catch (e) {
    return respond({ error: e instanceof Error ? e.message : "Erreur inconnue" }, 500);
  }
});
