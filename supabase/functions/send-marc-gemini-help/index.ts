import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const to = "marcfontaine33@gmail.com";
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:620px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#008296,#00b4cc);padding:22px;color:#fff;">
      <h1 style="margin:0;font-size:22px;">Bienvenue sur EbookStudio, Marc 👋</h1>
    </div>
    <div style="padding:24px;color:#232F3E;line-height:1.55;font-size:15px;">
      <p>Bonjour Marc,</p>
      <p>Merci pour votre confiance ! J'ai vu que vous rencontriez l'erreur
        <em>« Edge Function returned a non-2xx status code »</em> et que l'EBOOKBOT ne répondait pas.</p>
      <p><strong>C'est normal, il manque juste une étape :</strong> configurer votre <strong>clé Gemini gratuite</strong>.
        Sans clé, aucun agent IA (EBOOKBOT, recherche mots-clés Amazon, workflow…) ne peut fonctionner.
        C'est la politique « BYOK » (Bring Your Own Key) qui vous permet d'avoir une IA illimitée sans surcoût.</p>

      <div style="margin:20px 0;padding:16px;background:#FFF7EC;border-left:4px solid #FF9E2D;border-radius:6px;">
        <strong>En 90 secondes :</strong>
        <ol style="margin:8px 0 0 18px;padding:0;">
          <li>Ouvrez <a href="https://aistudio.google.com/apikey" style="color:#008296;">https://aistudio.google.com/apikey</a></li>
          <li>Cliquez sur <strong>« Create API key »</strong> (connexion Google requise, c'est gratuit)</li>
          <li>Copiez la clé (elle commence par <code>AIza…</code>)</li>
          <li>Sur EbookStudio, cliquez sur le bouton orange <strong>« Choisir mon IA · Clés API »</strong> en bas à droite, collez la clé et validez</li>
        </ol>
      </div>

      <p>Une fois la clé collée, l'EBOOKBOT répond instantanément et la recherche avancée de mots-clés Amazon KDP fonctionne.</p>

      <p>Un guide PDF pas-à-pas est également disponible ici :
        <a href="https://www.ebookstudio.fr/Guide_Cle_Gemini_API.pdf" style="color:#008296;">Guide Clé Gemini API</a>.</p>

      <p>Si vous restez bloqué, répondez simplement à cet email, je vous accompagne personnellement.</p>

      <p style="margin-top:24px;">Bien cordialement,<br/><strong>Georges Boubet</strong><br/>EbookStudio</p>
    </div>
  </div>`;

  try {
    const r = await resend.emails.send({
      from: "Georges — EbookStudio <noreply@ebookstudio.fr>",
      to: [to],
      reply_to: "boubetgeorges@gmail.com",
      subject: "Marc, il manque juste votre clé Gemini (90 sec) 🔑",
      html,
    });
    return new Response(JSON.stringify({ ok: true, r }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
