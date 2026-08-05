import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { EMAIL_SENDING_ENABLED, emailSendingBlockedResult } from "../_shared/emailSendingGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    if (!EMAIL_SENDING_ENABLED) {
      return new Response(JSON.stringify(emailSendingBlockedResult()), {
        status: 423,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { email, first_name } = await req.json();
    const cleanEmail = String(email || "").trim().toLowerCase();
    const greeting = first_name ? `Bonjour ${String(first_name).replace(/[<>]/g, "")},` : "Bonjour,";

    if (!isValidEmail(cleanEmail)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY manquant");
      return new Response(JSON.stringify({ error: "Email non configuré" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
      <h1 style="color:#008296;margin:0 0 12px">🎉 Votre place est réservée !</h1>
      <p>${greeting}</p>
      <p>Merci pour votre inscription au webinaire gratuit <strong>« Publiez votre 1<sup>er</sup> ebook rentable en 7 jours grâce à l'IA »</strong>.</p>
      <p>Voici ce que vous allez découvrir en 45 minutes :</p>
      <ul>
        <li>La démonstration en direct du workflow complet</li>
        <li>Comment trouver une niche rentable (données Amazon réelles)</li>
        <li>Le plan d'action pour publier en 7 jours</li>
        <li>Une session de questions / réponses en direct</li>
      </ul>
      <p>Vous recevrez le <strong>lien d'accès et un rappel</strong> par email avant la session. En attendant, vous pouvez déjà tester l'outil :</p>
      <p style="text-align:center;margin:24px 0">
        <a href="https://ebookstudio.fr/demo" style="background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
          🚀 Essayer le générateur gratuitement
        </a>
      </p>
      <p>À très vite,<br/>Georges — EbookStudio</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#6b7280">Vous recevez cet email car vous vous êtes inscrit au webinaire sur ebookstudio.fr.</p>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "EbookStudio <contact@ebookstudio.fr>",
        to: [cleanEmail],
        subject: "🎉 Votre place au webinaire est confirmée !",
        html,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("Resend error", res.status, txt);
      return new Response(JSON.stringify({ error: "Envoi échoué" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[WEBINAIRE] Confirmation envoyée à ${cleanEmail}`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-webinaire-confirmation error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
