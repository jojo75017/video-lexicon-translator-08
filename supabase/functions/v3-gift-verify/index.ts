// V3 — Vérifie le paiement d'une carte cadeau après retour Stripe.
// Active la carte (status='active') et envoie le code au bénéficiaire si renseigné.
// Renvoie le code à l'acheteur pour qu'il puisse l'offrir.

import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { EMAIL_SENDING_ENABLED } from "../_shared/emailSendingGuard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

async function emailRecipientCode(to: string, code: string, buyer: string) {
  if (!EMAIL_SENDING_ENABLED) return;
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "EbookStudio <noreply@ebookstudio.fr>",
      to: [to],
      subject: "🎁 Vous avez reçu une carte cadeau EbookStudio !",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#2A2118">
          <h1 style="color:#C97A14">🎁 Une carte cadeau pour vous !</h1>
          <p>${buyer} vous offre l'accès à vie au générateur de livres EbookStudio (Base — création & publication).</p>
          <p>Votre code cadeau :</p>
          <div style="background:#FFF3DF;border:1px solid #E8951E55;border-radius:10px;padding:16px;text-align:center;font-size:22px;font-weight:800;letter-spacing:2px;color:#C97A14">${code}</div>
          <p style="margin-top:20px">Pour l'activer :</p>
          <ol>
            <li>Créez votre compte (ou connectez-vous) sur EbookStudio.</li>
            <li>Rendez-vous sur <a href="https://ebookstudio.fr/carte-cadeau">ebookstudio.fr/carte-cadeau</a></li>
            <li>Saisissez votre code — l'accès sera lié à votre compte, à vie.</li>
          </ol>
          <p style="color:#a18a6c;font-size:12px">Ce code est à usage unique et personnel.</p>
        </div>`,
    }),
  }).catch((e) => console.error("Resend gift email failed:", e));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { sessionId, environment } = await req.json();
    const env: StripeEnv = environment === "live" ? "live" : "sandbox";
    if (typeof sessionId !== "string" || !sessionId) throw new Error("sessionId requis");

    const session = await stripeRequest(env, "GET", `/checkout/sessions/${sessionId}`);
    const paid = session?.payment_status === "paid" && session?.status === "complete";
    const cardId = session?.metadata?.gift_card_id;
    if (!cardId) throw new Error("Carte cadeau introuvable sur la session");

    const supabase = getSupabase();
    const { data: card, error: cardErr } = await supabase
      .from("v3_gift_cards").select("*").eq("id", cardId).single();
    if (cardErr || !card) throw new Error("Carte cadeau introuvable");

    if (!paid) {
      return new Response(JSON.stringify({ ok: false, error: "Paiement non confirmé" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Activer si nécessaire
    if (card.status === "pending_payment") {
      await supabase.from("v3_gift_cards").update({ status: "active" }).eq("id", cardId);
      if (card.recipient_email) {
        await emailRecipientCode(card.recipient_email, card.code, card.buyer_email);
      }
    }

    return new Response(
      JSON.stringify({ ok: true, code: card.code, recipientEmail: card.recipient_email }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de vérification";
    console.error("v3-gift-verify error:", message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
