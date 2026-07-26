import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const to = "juanito.ferrero@laposte.net";
  const html = `
  <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:620px;margin:0 auto;background:#fff;border:1px solid #eee;border-radius:12px;overflow:hidden;">
    <div style="background:linear-gradient(135deg,#008296,#00b4cc);padding:22px;color:#fff;">
      <h1 style="margin:0;font-size:22px;">Un petit message personnel 👋</h1>
    </div>
    <div style="padding:24px;color:#232F3E;line-height:1.6;font-size:15px;">
      <p>Bonjour Juanito,</p>

      <p>Je vous écris personnellement suite à votre passage sur EbookStudio.
      J'ai vu qu'une tentative de paiement était restée <strong>en suspens</strong> et
      qu'elle n'est finalement pas passée.</p>

      <p>Je voulais simplement vous demander : <strong>était-ce volontaire</strong> de
      votre part (changement d'avis, hésitation, autre priorité) ou est-ce qu'un
      problème technique vous a empêché de finaliser ?</p>

      <p>Dans tous les cas, aucune inquiétude — je préfère juste comprendre
      pour ne pas vous laisser sur un mauvais souvenir.</p>

      <div style="margin:22px 0;padding:16px;background:#FFF7EC;border-left:4px solid #FF9E2D;border-radius:6px;">
        <strong>Si vous voulez reprendre l'offre :</strong> l'accès à vie est toujours
        disponible <strong>à 59 €</strong> (paiement unique, sans abonnement, garantie
        30 jours). Il vous suffit de cliquer ci-dessous :
        <div style="margin-top:14px;">
          <a href="https://www.ebookstudio.fr/promo/commande?ref=juanito&autopay=1"
             style="display:inline-block;background:#008296;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;">
            Reprendre l'accès à 59 €
          </a>
        </div>
      </div>

      <p>Et si finalement ce n'était pas pour vous, dites-le moi en répondant à cet
      email — un simple « non merci » suffit, aucune insistance de ma part.</p>

      <p style="margin-top:24px;">Merci beaucoup pour votre retour,<br/>
      <strong>Georges Boubet</strong><br/>EbookStudio</p>
    </div>
  </div>`;

  try {
    const r = await resend.emails.send({
      from: "Georges — EbookStudio <noreply@ebookstudio.fr>",
      to: [to],
      reply_to: "boubetgeorges@gmail.com",
      subject: "Juanito, votre paiement n'est pas passé — était-ce volontaire ?",
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
