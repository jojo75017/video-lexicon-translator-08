// Demande aux abonnés actifs d'envoyer la photo de leur premier livre + un commentaire.
// Body: { test?: boolean }  -> test = envoi uniquement à l'adresse admin.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";
const ADMIN_EMAIL = "boubetgeorges@gmail.com";
const TEMPLATE_NAME = "temoignage-photo-premier-livre";
const SUBJECT = "Une photo de votre premier livre ? (2 minutes, et ça m'aide beaucoup)";
const FORM_LINK = "https://video-lexicon-translator-08.lovable.app/v3/temoignage";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;

function buildHtml(): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0b1220;">
<div style="max-width:620px;margin:0 auto;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#232F3E;">
  <div style="background:linear-gradient(135deg,#0b1220 0%,#0f2a3a 100%);padding:32px 28px;text-align:center;color:#fff;">
    <div style="display:inline-block;background:#FF9E2D;color:#0b1220;font-weight:bold;padding:6px 14px;border-radius:20px;font-size:12px;letter-spacing:1px;">VOTRE PREMIER LIVRE</div>
    <h1 style="margin:16px 0 8px;font-size:26px;line-height:1.3;">Montrez-nous votre livre 📚</h1>
  </div>
  <div style="padding:28px;">
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px;">Bonjour,</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px;">
      Vous faites partie des tout premiers auteurs à utiliser EbookStudio, et j'aimerais vous demander un petit service.
    </p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px;">
      <strong>Envoyez-moi une photo de votre premier livre</strong> (une capture d'écran, votre liseuse, votre tablette ou l'exemplaire papier) accompagnée de <strong>quelques mots sur votre expérience</strong> : ce que vous avez réussi à faire, en combien de temps, ce qui vous a le plus aidé.
    </p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px;">
      Ces témoignages seront affichés sur la page de présentation d'EbookStudio. C'est ce qui rassure le plus les personnes qui hésitent encore à publier leur premier livre.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto;">
      <tr><td style="border-radius:10px;background:#FF9E2D;">
        <a href="${FORM_LINK}" style="display:inline-block;padding:16px 30px;color:#0b1220;text-decoration:none;font-weight:bold;font-size:17px;border-radius:10px;">Envoyer ma photo + mon commentaire →</a>
      </td></tr>
    </table>
    <div style="background:#FFF7E6;border-left:4px solid #FF9E2D;padding:14px 18px;border-radius:6px;font-size:14px;line-height:1.7;">
      ⏱️ <strong>2 minutes suffisent :</strong><br>
      1. Votre prénom et le titre de votre livre<br>
      2. Votre commentaire (2 à 4 phrases)<br>
      3. La photo de votre livre
    </div>
    <p style="font-size:14px;line-height:1.6;color:#555;margin:22px 0 0;">
      Si vous préférez, répondez simplement à cet email avec la photo en pièce jointe : je m'occupe du reste.
    </p>
    <p style="font-size:15px;line-height:1.6;margin:16px 0 0;">
      Merci du fond du cœur,<br><strong>Georges Boubet</strong> — EbookStudio
    </p>
  </div>
  <div style="background:#FAFAFA;padding:16px 28px;border-top:1px solid #eee;font-size:12px;color:#888;text-align:center;line-height:1.6;">
    Vous recevez cet email en tant qu'abonné EbookStudio.
  </div>
</div>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    let testMode = false;
    try {
      const body = await req.json();
      testMode = body?.test === true;
    } catch { /* no body */ }

    let recipients: string[] = [ADMIN_EMAIL];
    if (!testMode) {
      const { data, error } = await supabase
        .from("subscribers")
        .select("email")
        .eq("status", "active");
      if (error) throw error;
      recipients = Array.from(
        new Set((data ?? []).map((r: { email: string }) => r.email).filter(Boolean)),
      );
    }

    const html = buildHtml();
    let sent = 0;
    const failed: string[] = [];

    for (const email of recipients) {
      try {
        await sendResendEmailThrottled({
          from: FROM_ADDRESS,
          to: [email],
          subject: SUBJECT,
          html,
        });
        sent++;
        await supabase.from("email_send_log").insert({
          email,
          template_name: TEMPLATE_NAME,
          status: "sent",
        });
      } catch (e) {
        if (isQuotaExhausted()) {
          return new Response(
            JSON.stringify({ ok: false, reason: "quota", sent, remaining: recipients.length - sent }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        console.error("send failed", email, e);
        failed.push(email);
      }
    }

    return new Response(JSON.stringify({ ok: true, total: recipients.length, sent, failed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
