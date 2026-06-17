// V3 — Achat d'une CARTE CADEAU Noël (Base 197€ offerte à -20% = 158€).
// Paiement unique via la gateway Lovable Payments.
// La carte ne débloque QUE la Base — les packs premium restent payants.

import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Montant figé serveur (centimes EUR). Aligné avec V3_GIFT_PRICE (158€).
const GIFT_AMOUNT = 15800;
const GIFT_LABEL = "Carte Cadeau Noël — Générateur de livres (Base à vie)";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

function genCode(): string {
  const part = () =>
    Array.from({ length: 4 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)],
    ).join("");
  return `NOEL-${part()}-${part()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { buyerEmail, recipientEmail, environment, returnUrl } = await req.json();

    const env: StripeEnv = environment === "live" ? "live" : "sandbox";
    const buyer = typeof buyerEmail === "string" ? buyerEmail.trim().toLowerCase() : "";
    if (!buyer || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(buyer)) {
      throw new Error("Email acheteur valide requis");
    }
    let recipient: string | null = null;
    if (typeof recipientEmail === "string" && recipientEmail.trim()) {
      const r = recipientEmail.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)) throw new Error("Email bénéficiaire invalide");
      recipient = r;
    }
    if (typeof returnUrl !== "string" || !/^https?:\/\//.test(returnUrl)) {
      throw new Error("returnUrl invalide");
    }

    const supabase = getSupabase();

    // Code unique
    let code = genCode();
    for (let i = 0; i < 5; i++) {
      const { data: clash } = await supabase
        .from("v3_gift_cards").select("id").eq("code", code).maybeSingle();
      if (!clash) break;
      code = genCode();
    }

    // Client Stripe (via gateway)
    const found = await stripeRequest(env, "GET", "/customers", { email: buyer, limit: 1 });
    const customerId: string = found?.data?.[0]?.id
      ?? (await stripeRequest(env, "POST", "/customers", { email: buyer })).id;

    // Carte en attente de paiement
    const { data: card, error: cardErr } = await supabase
      .from("v3_gift_cards")
      .insert({
        code,
        plan: "base",
        amount_paid: GIFT_AMOUNT / 100,
        currency: "EUR",
        buyer_email: buyer,
        recipient_email: recipient,
        status: "pending_payment",
        environment: env,
      })
      .select("id")
      .single();
    if (cardErr) throw new Error(`DB: ${cardErr.message}`);
    const cardId = card.id as string;

    const session = await stripeRequest(env, "POST", "/checkout/sessions", {
      mode: "payment",
      ui_mode: "embedded",
      customer: customerId,
      return_url: returnUrl,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: GIFT_AMOUNT,
          product_data: { name: GIFT_LABEL },
        },
      }],
      "payment_intent_data[description]": GIFT_LABEL,
      "payment_intent_data[metadata][gift_card_id]": cardId,
      metadata: {
        kind: "v3_gift",
        gift_card_id: cardId,
        buyer_email: buyer,
        gift_code: code,
      },
    });

    await supabase
      .from("v3_gift_cards")
      .update({ stripe_session_id: session.id })
      .eq("id", cardId);

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret, cardId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de paiement";
    console.error("v3-gift-checkout error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
