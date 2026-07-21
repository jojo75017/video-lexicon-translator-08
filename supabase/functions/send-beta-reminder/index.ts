import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";

// Email à exclure de la relance (accès conservé)
const EXCLUDED_EMAILS = ["rachel.mlm63@gmail.com"];

const SUBJECT = "⏰ Votre accès bêta EbookStudio se termine le 30 juin";

function buildHtml(): string {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:600px; margin:0 auto; line-height:1.6;">
    <p>Bonjour,</p>

    <p>Vous faites partie des premiers bêta-testeurs d'<strong>EbookStudio Pro V2</strong>, et je vous en remercie sincèrement.</p>

    <p>Je reviens vers vous car <strong>votre accès bêta prend fin le 30 juin</strong>. Sans nouvelle de votre part,
    je vais <strong>couper les accès bêta ce jour-là</strong> afin de libérer les places.</p>

    <p>Avant cela, j'aimerais vraiment avoir votre retour&nbsp;:</p>
    <ul>
      <li>Avez-vous pu tester la plateforme&nbsp;?</li>
      <li>Qu'est-ce qui vous a plu ou bloqué&nbsp;?</li>
      <li>Souhaitez-vous conserver votre accès&nbsp;?</li>
    </ul>

    <p>Il vous suffit de <strong>répondre à cet email</strong> avant le <strong>30 juin</strong> pour me dire où vous en êtes.
    Sans réponse, l'accès sera désactivé le 30 juin.</p>

    <p>Merci encore pour votre participation, et au plaisir de vous lire.</p>

    <p style="margin-top:24px;">
      Bien à vous,<br/>
      <strong>Georges Boubet</strong><br/>
      EbookStudio Pro V2
    </p>
  </div>`;
}

import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

async function sendResendEmail(to: string, subject: string, html: string) {
  const r = await sendResendEmailThrottled({ from: FROM_ADDRESS, to: [to], subject, html });
  return { ok: r.ok, id: r.id, detail: r.ok ? undefined : `HTTP ${r.status ?? ""}: ${r.detail ?? ""}` };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Récupère les bêta-testeurs (codes utilisés)
    const { data: codes, error } = await supabase
      .from("beta_promo_codes")
      .select("used_by_email")
      .eq("status", "used");
    if (error) throw error;

    const recipients = Array.from(
      new Set(
        (codes ?? [])
          .map((c: any) => (c.used_by_email ?? "").trim().toLowerCase())
          .filter((e: string) => e && !EXCLUDED_EMAILS.includes(e)),
      ),
    );

    const html = buildHtml();
    const results: any[] = [];

    for (const to of recipients) {
      const result = await sendResendEmail(to, SUBJECT, html);
      results.push({ to, ...result });
      try {
        await supabase.from("email_send_log").insert({
          recipient_email: to,
          template_name: "beta-reminder",
          message_id: result.id ?? null,
          status: result.ok ? "sent" : "error",
          error_message: result.ok ? null : (result.detail ?? null),
        });
      } catch (_) { /* noop */ }
      if (isQuotaExhausted()) { console.warn("[beta-reminder] Resend daily quota atteint, arrêt de la boucle"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    return new Response(
      JSON.stringify({ total: recipients.length, sent, excluded: EXCLUDED_EMAILS, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 },
    );
  }
});
