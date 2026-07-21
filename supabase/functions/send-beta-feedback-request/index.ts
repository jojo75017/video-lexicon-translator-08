import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendResendEmailThrottled, isQuotaExhausted } from "../_shared/resendThrottle.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email non configuré" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    // Liste par défaut : bêta-testeurs ayant utilisé un code, sauf Rachel
    const defaultRecipients = [
      "mechapizzai@gmail.com",
      "stef.gallois@gmail.com",
      "hello@ouzefi.com",
      "jsofiane.lr.fr@gmail.com",
      "blagardette@gmail.com",
    ];
    const recipients: string[] = Array.isArray(body.recipients) && body.recipients.length
      ? body.recipients
      : defaultRecipients;

    const subject = "Ton avis sur EbookStudio ? (2 minutes, ça m'aiderait énormément 🙏)";

    const buildHtml = () => `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
      <h1 style="color:#008296;margin:0 0 12px">Comment s'est passé ton test ? 🚀</h1>
      <p>Bonjour,</p>
      <p>Merci encore d'avoir accepté de tester <strong>EbookStudio</strong> en avant-première ! Ton retour est vraiment précieux pour améliorer l'outil avant le lancement.</p>
      <p>Aurais-tu 2 minutes pour me dire :</p>
      <ul>
        <li>👉 As-tu pu créer un ebook (ou démarrer un projet) ?</li>
        <li>👉 Qu'est-ce qui t'a plu / facilité la tâche ?</li>
        <li>👉 Qu'est-ce qui t'a bloqué ou semblé confus ?</li>
        <li>👉 Une fonctionnalité qui te manque ?</li>
      </ul>
      <p>Tu peux simplement <strong>répondre directement à cet email</strong>, même en quelques lignes. Chaque détail compte 🙏</p>
      <p style="text-align:center;margin:24px 0">
        <a href="https://ebookstudio.fr/contact-support" style="background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
          💬 Me donner mon avis
        </a>
      </p>
      <p>Un immense merci,<br/>Georges — EbookStudio</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
      <p style="font-size:12px;color:#6b7280">Tu reçois cet email car tu fais partie des bêta-testeurs d'EbookStudio.</p>
    </div>`;

    const results: { email: string; ok: boolean; error?: string }[] = [];

    for (const email of recipients) {
      const r = await sendResendEmailThrottled({
        from: "Georges - EbookStudio <contact@ebookstudio.fr>",
        to: [email],
        reply_to: "boubetgeorges@gmail.com",
        subject,
        html: buildHtml(),
      });
      if (r.ok) results.push({ email, ok: true });
      else {
        console.error("Resend error", email, r.status, r.detail);
        results.push({ email, ok: false, error: `${r.status ?? ""}` });
      }
      if (isQuotaExhausted()) { console.warn("[beta-feedback] Resend daily quota atteint, arrêt"); break; }
    }

    const sent = results.filter((r) => r.ok).length;
    console.log(`[BETA FEEDBACK] ${sent}/${recipients.length} envoyés`);

    return new Response(JSON.stringify({ success: true, sent, total: recipients.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("send-beta-feedback-request error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
