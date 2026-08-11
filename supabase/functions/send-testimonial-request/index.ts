import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled } from "../_shared/resendThrottle.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";

/**
 * Demande de témoignage aux abonnés actifs.
 *
 * La page de vente n'a aucun avis à afficher : ce message invite chaque abonné
 * à déposer 3 lignes + une photo de son livre sur /v3/temoignage (validation
 * manuelle avant publication).
 *
 * Sécurité : admin (has_role) ou secret cron.
 * Modes : `status` / `preview` (aucun envoi) et `send`.
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const TEMPLATE = "demande-temoignage-2026";
const FORM_URL = "https://ebookstudio.fr/v3/temoignage";

function html(): string {
  return `<!DOCTYPE html><html lang="fr"><body style="margin:0;background:#FAFAFA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAFAFA;padding:24px 12px">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
<tr><td style="background:#232F3E;padding:22px 26px;color:#ffffff;font:700 21px/1.3 Arial,Helvetica,sans-serif">
Votre avis vaut plus que toutes mes pages de vente
</td></tr>
<tr><td style="padding:26px;color:#232F3E;font:16px/1.6 Arial,Helvetica,sans-serif">
<p style="margin:0 0 16px">Bonjour,</p>
<p style="margin:0 0 16px">Vous utilisez EbookStudio, et j'ai un service à vous demander : <strong>trois lignes sur votre expérience</strong>. Les personnes qui hésitent aujourd'hui ne me croient pas moi — elles croient les auteurs qui s'en servent déjà.</p>
<p style="margin:0 0 10px;font:700 17px Arial,Helvetica,sans-serif">Ce que je vous demande, très concrètement</p>
<ul style="margin:0 0 18px;padding-left:22px">
<li style="margin-bottom:8px">Ce que vous avez réussi à faire (un livre écrit, publié, une couverture, un manuscrit nettoyé…).</li>
<li style="margin-bottom:8px">En combien de temps, et ce qui vous a le plus aidé.</li>
<li>Si vous le souhaitez : <strong>une photo ou une capture de votre livre</strong> (écran, tablette ou exemplaire papier).</li>
</ul>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px"><tr>
<td style="background:#008296;border-radius:8px"><a href="${FORM_URL}" style="display:inline-block;padding:14px 26px;color:#ffffff;text-decoration:none;font:700 16px Arial,Helvetica,sans-serif">Déposer mon témoignage (2 minutes)</a></td>
</tr></table>
<p style="margin:0 0 8px;font-size:14px;color:#555">Seuls votre prénom, votre commentaire et la photo du livre peuvent être publiés. Votre email n'apparaît jamais, et rien n'est mis en ligne sans relecture de ma part.</p>
<p style="margin:0;font-size:14px;color:#555">Si quelque chose ne va pas dans votre utilisation, répondez-moi plutôt à ce message : je préfère régler le problème avant de demander un avis.</p>
<p style="margin:20px 0 0">Merci sincèrement,<br>Georges Boubet<br><span style="color:#555;font-size:14px">EbookStudio</span></p>
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

    // Ne pas solliciter deux fois ceux qui ont déjà témoigné.
    const { data: existing } = await db.from("book_testimonials").select("email").limit(5000);
    const testified = new Set((existing || []).map((r: any) => String(r.email || "").toLowerCase()));

    const explicit: string[] = Array.isArray(body.emails)
      ? body.emails.map((e: unknown) => String(e).trim().toLowerCase()).filter((e: string) => e.includes("@"))
      : [];

    const pool = explicit.length
      ? explicit
      : Array.from(new Set(
          (subs || [])
            .map((s: any) => String(s.email || "").trim().toLowerCase())
            .filter((e: string) => Boolean(e) && !e.endsWith("@example.com")),
        ));
    const targets = explicit.length ? pool : pool.filter((e) => !done.has(e) && !testified.has(e));

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
        subject: "Puis-je vous demander trois lignes sur votre livre ?",
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
