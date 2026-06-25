import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = "Georges Boubet <noreply@ebookstudio.fr>";

// Adresses à exclure (compte propriétaire / tests)
const EXCLUDED_EMAILS = ["boubetgeorges@gmail.com"];

const SUBJECT = "Vous aviez jeté un œil à EbookStudio 👀";

const OFFRES_LINK = "https://video-lexicon-translator-08.lovable.app/offres";

function buildHtml(): string {
  return `
  <div style="font-family: Arial, Helvetica, sans-serif; color:#232F3E; max-width:600px; margin:0 auto; line-height:1.6;">
    <p>Bonjour,</p>

    <p>J'ai remarqué que vous aviez <strong>cliqué sur l'un de mes emails</strong> à propos d'<strong>EbookStudio</strong>
    — l'outil qui vous permet d'écrire et de publier un ebook professionnel sur Amazon KDP grâce à l'IA, de A à Z.</p>

    <p>C'est plutôt bon signe&nbsp;: le sujet vous intéresse. Du coup, je voulais simplement savoir
    <strong>ce qui vous a retenu de franchir le pas</strong>&nbsp;?</p>

    <ul>
      <li>Vous avez une question sur le fonctionnement&nbsp;?</li>
      <li>Vous hésitez sur le type de livre à créer&nbsp;?</li>
      <li>Vous voulez voir un exemple concret avant de vous lancer&nbsp;?</li>
    </ul>

    <p>Répondez-moi directement à cet email, je vous réponds personnellement.
    Et si vous êtes prêt(e), tout est ici&nbsp;:</p>

    <p style="text-align:center; margin:28px 0;">
      <a href="${OFFRES_LINK}"
         style="background:#008296; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-weight:bold; display:inline-block;">
        Découvrir EbookStudio
      </a>
    </p>

    <p style="margin-top:24px;">
      Bien à vous,<br/>
      <strong>Georges Boubet</strong><br/>
      EbookStudio
    </p>
  </div>`;
}

async function sendResendEmail(to: string, subject: string, html: string) {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return { ok: false, detail: "RESEND_API_KEY manquante" };
  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`,
      },
      body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
    });
    if (!res.ok) {
      const detail = await res.text();
      return { ok: false, detail: `HTTP ${res.status}: ${detail}` };
    }
    const json = await res.json().catch(() => ({}));
    return { ok: true, id: json?.id };
  } catch (err) {
    return { ok: false, detail: String(err) };
  }
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

    // Récupère tous les emails ayant cliqué au moins une fois
    const { data: clicks, error } = await supabase
      .from("email_clicks")
      .select("prospect_email");
    if (error) throw error;

    const recipients = Array.from(
      new Set(
        (clicks ?? [])
          .map((c: any) => (c.prospect_email ?? "").trim().toLowerCase())
          .filter((e: string) => e && e.includes("@") && !EXCLUDED_EMAILS.includes(e)),
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
          template_name: "clickers-followup",
          message_id: result.id ?? null,
          status: result.ok ? "sent" : "error",
          error_message: result.ok ? null : (result.detail ?? null),
        });
      } catch (_) { /* noop */ }
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
