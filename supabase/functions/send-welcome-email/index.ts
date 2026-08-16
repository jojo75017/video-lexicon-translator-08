import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { Resend } from "npm:resend@2.0.0";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";
import { checkoutUrl, SITE_ORIGIN } from "../_shared/checkoutUrl.ts";
import { FROM_APP, REPLY_TO } from "../_shared/emailIdentity.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Adresse de contact humaine : un simple « Répondre » doit arriver ici. */
const SUPPORT_EMAIL = "boubetgeorges@gmail.com";
const NICHES_URL = `${SITE_ORIGIN}/10-niches-offertes`;
const APP_URL = `${SITE_ORIGIN}/v3`;

interface WelcomeEmailRequest {
  email: string;
  /** Code d'accès à rappeler ; sinon il est lu dans la base. */
  access_code?: string | null;
  first_name?: string | null;
}

async function lookupAccessCode(email: string): Promise<string | null> {
  try {
    const url = Deno.env.get("SUPABASE_URL");
    const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!url || !key) return null;
    const admin = createClient(url, key);
    const { data } = await admin
      .from("subscribers")
      .select("access_code")
      .eq("email", email)
      .maybeSingle();
    return (data?.access_code as string | null) ?? null;
  } catch (e) {
    console.error("lookupAccessCode failed", e);
    return null;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!EMAIL_SENDING_ENABLED) {
      return new Response(JSON.stringify(emailSendingBlockedResult()), {
        status: 423,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body: WelcomeEmailRequest = await req.json();
    const email = (body.email || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const firstName = (body.first_name || "").trim().slice(0, 80);
    const accessCode = (body.access_code || "").trim() || (await lookupAccessCode(email));

    const accessBlock = accessCode
      ? `<p style="margin:8px 0 0"><strong>Votre code d'accès :</strong>
           <span style="display:inline-block;padding:6px 12px;border-radius:8px;background:#fdf6e3;border:1px solid #c9a84c;font-family:monospace;font-size:16px;font-weight:bold;color:#064e3b">${accessCode}</span>
         </p>`
      : `<p style="margin:8px 0 0;color:#5a5a5a">Votre code d'accès vous est envoyé dans un email séparé. S'il n'arrive pas, écrivez-moi et je vous l'ouvre à la main.</p>`;

    const emailResponse = await resend.emails.send({
      from: FROM_APP,
      reply_to: REPLY_TO,
      to: [email],
      reply_to: SUPPORT_EMAIL,
      subject: "Vos accès EbookStudio + vos 10 niches offertes",
      html: `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:24px 12px;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a">
  <div style="max-width:600px;margin:0 auto;border:1px solid #e6e1d5;border-radius:16px;overflow:hidden">

    <div style="background:#064e3b;padding:28px 24px">
      <h1 style="margin:0;color:#f0d78c;font-size:24px">Bienvenue${firstName ? ` ${firstName}` : ""} sur EbookStudio</h1>
      <p style="margin:8px 0 0;color:#ffffff;font-size:14px">Vos accès, votre cadeau, et mon email direct.</p>
    </div>

    <div style="padding:24px">

      <h2 style="margin:0 0 8px;font-size:18px;color:#064e3b">1. Vos accès</h2>
      <p style="margin:0;font-size:15px;line-height:1.6">
        <strong>Email de connexion :</strong> ${email}
      </p>
      ${accessBlock}
      <p style="margin:16px 0 0">
        <a href="${APP_URL}" style="display:inline-block;background:#064e3b;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:10px;font-weight:bold">Ouvrir mon espace EbookStudio</a>
      </p>

      <h2 style="margin:28px 0 8px;font-size:18px;color:#064e3b">2. Votre cadeau : 10 niches Amazon KDP</h2>
      <p style="margin:0;font-size:15px;line-height:1.6">
        Elles s'affichent immédiatement, avec le mot-clé Amazon exact, le BSR à viser, le niveau de
        concurrence et le prix constaté. Un livre publié dans une mauvaise niche, c'est 40 heures perdues.
      </p>
      <p style="margin:14px 0 0">
        <a href="${NICHES_URL}" style="display:inline-block;background:#c9a84c;color:#1a1a1a;text-decoration:none;padding:13px 24px;border-radius:10px;font-weight:bold">Voir mes 10 niches offertes</a>
      </p>

      <h2 style="margin:28px 0 8px;font-size:18px;color:#064e3b">3. Votre kit de démarrage (PDF, 16 pages)</h2>
      <p style="margin:0;font-size:15px;line-height:1.6">
        De la première connexion jusqu'à la mise en vente sur Amazon KDP, avec les captures de votre
        espace : clés IA, niche, sommaire, écriture, correction, couverture, exports, premiers avis.
      </p>
      <p style="margin:14px 0 0">
        <a href="${SITE_ORIGIN}/kit-demarrage-ebookstudio-v3.pdf" style="display:inline-block;background:#064e3b;color:#ffffff;text-decoration:none;padding:13px 24px;border-radius:10px;font-weight:bold">Télécharger le kit de démarrage</a>
      </p>


      <h2 style="margin:28px 0 8px;font-size:18px;color:#064e3b">4. Vos 3 premières actions</h2>
      <ol style="margin:0;padding-left:20px;font-size:15px;line-height:1.7">
        <li>Choisissez une niche dans votre pack et cliquez sur « Écrire ce livre ».</li>
        <li>Validez le sommaire proposé (vous pouvez tout modifier).</li>
        <li>Lancez la rédaction, puis exportez en Word ou PDF prêt pour Amazon KDP.</li>
      </ol>

      <div style="margin-top:28px;padding:18px;border-radius:12px;background:#fdf6e3;border:1px solid #c9a84c">
        <p style="margin:0;font-size:15px;line-height:1.6">
          <strong>Un souci ? Écrivez-moi directement.</strong><br>
          <a href="mailto:${SUPPORT_EMAIL}" style="color:#064e3b;font-weight:bold">${SUPPORT_EMAIL}</a><br>
          Je réponds personnellement. Vous pouvez aussi simplement répondre à cet email.
        </p>
      </div>

      <p style="margin:22px 0 0;font-size:13px;color:#5a5a5a">
        Vous préférez découvrir l'offre complète d'abord ?
        <a href="${checkoutUrl("welcome-email")}" style="color:#064e3b">C'est ici</a>.
      </p>
    </div>

    <div style="background:#f6f4ee;padding:18px 24px;text-align:center;font-size:12px;color:#6b6b6b">
      EbookStudio — vos accès et votre cadeau de bienvenue.
    </div>
  </div>
</body>
</html>`,
    });

    console.log("Welcome email sent to", email, "code joined:", Boolean(accessCode));

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
