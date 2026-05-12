// Creates an Embedded Checkout session for the EbookStudio annual plan (67€).
// Inserts a funnel_orders row in 'pending' state and returns the Stripe clientSecret.
// The webhook (payments-webhook) marks the order as 'paid' on checkout.session.completed.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRICE_LOOKUP_KEY = "ebookstudio_lifetime_67";
const PRODUCT_LABEL = "EbookStudio — Accès à vie";
const AMOUNT_EUR = 67;

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const first_name = String(body.first_name || "").trim().slice(0, 80);
    const ref_code = String(body.ref_code || "").trim().slice(0, 64) || null;
    const environment: StripeEnv = body.environment === "live" ? "live" : "sandbox";
    const returnUrl = String(body.returnUrl || "").trim();

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!returnUrl) {
      return new Response(JSON.stringify({ error: "returnUrl requis" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // 1. Insert pending order
    const { data: order, error: orderErr } = await supabase
      .from("funnel_orders")
      .insert({
        email,
        first_name: first_name || null,
        product_key: "main",
        amount: AMOUNT_EUR,
        currency: "EUR",
        payment_method: "stripe",
        status: "pending",
        ref_code,
      })
      .select("id")
      .single();
    if (orderErr) throw orderErr;

    // 2. Resolve Stripe price by lookup_key
    const prices = await stripeRequest<{ data: any[] }>(
      environment, "GET", "/prices",
      { lookup_keys: [PRICE_LOOKUP_KEY], active: true, limit: 1 },
    );
    if (!prices.data?.length) {
      throw new Error(`Stripe price '${PRICE_LOOKUP_KEY}' not found`);
    }
    const stripePriceId = prices.data[0].id;

    // 3. Create embedded checkout session
    const session = await stripeRequest<{ id: string; client_secret: string }>(
      environment, "POST", "/checkout/sessions",
      {
        mode: "payment",
        ui_mode: "embedded",
        return_url: returnUrl,
        customer_email: email,
        line_items: [{ price: stripePriceId, quantity: 1 }],
        metadata: {
          order_id: order.id,
          ref_code: ref_code || "",
          product: "ebookstudio_lifetime",
        },
        payment_intent_data: {
          metadata: { order_id: order.id, ref_code: ref_code || "" },
        },
      },
    );

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret, orderId: order.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-promo-checkout error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
