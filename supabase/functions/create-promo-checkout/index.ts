// Creates an Embedded Checkout session for the EbookStudio annual plan (67€).
// Inserts a funnel_orders row in 'pending' state and returns the Stripe clientSecret.
// The webhook (payments-webhook) marks the order as 'paid' on checkout.session.completed.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRICE_LOOKUP_KEY = "ebookstudio_lifetime_59";
const PRODUCT_LABEL = "EbookStudio — Accès à vie";
// Promo d'été jusqu'au 31 août 2026 : 59€ (tarif normal 67€ à rétablir après).
const AMOUNT_EUR = 59;

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

    // Validate optional bonuses payload
    const rawBonuses = Array.isArray(body.bonuses) ? body.bonuses : [];
    const bonuses = rawBonuses
      .map((b: any) => ({
        key: String(b?.key || "").slice(0, 64),
        title: String(b?.title || "").slice(0, 120),
        amount: Number(b?.amount) || 0,
      }))
      .filter((b: any) => b.key && b.title && b.amount > 0 && b.amount <= 500);
    const bonusTotal = bonuses.reduce((s: number, b: any) => s + b.amount, 0);
    const totalAmount = AMOUNT_EUR + bonusTotal;

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

    // 1. Insert pending order with TOTAL amount (base + bonuses)
    const { data: order, error: orderErr } = await supabase
      .from("funnel_orders")
      .insert({
        email,
        first_name: first_name || null,
        product_key: "main",
        amount: totalAmount,
        currency: "EUR",
        payment_method: "stripe",
        status: "pending",
        ref_code,
        metadata: bonuses.length > 0 ? { bonuses } : null,
      })
      .select("id")
      .single();
    if (orderErr) throw orderErr;

    // 2. Resolve Stripe price by lookup_key for the base product
    const prices = await stripeRequest<{ data: any[] }>(
      environment, "GET", "/prices",
      { lookup_keys: [PRICE_LOOKUP_KEY], active: true, limit: 1 },
    );
    if (!prices.data?.length) {
      throw new Error(`Stripe price '${PRICE_LOOKUP_KEY}' not found`);
    }
    const stripePriceId = prices.data[0].id;

    // 3. Build line_items: base product + each bonus as inline price_data
    const lineItems: any[] = [{ price: stripePriceId, quantity: 1 }];
    for (const b of bonuses) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: b.title },
          unit_amount: Math.round(b.amount * 100),
        },
        quantity: 1,
      });
    }

    // 4. Create embedded checkout session
    const session = await stripeRequest<{ id: string; client_secret: string }>(
      environment, "POST", "/checkout/sessions",
      {
        mode: "payment",
        ui_mode: "embedded_page",
        return_url: returnUrl,
        customer_email: email,
        line_items: lineItems,
        metadata: {
          order_id: order.id,
          ref_code: ref_code || "",
          product: "ebookstudio_lifetime",
          bonus_keys: bonuses.map((b: any) => b.key).join(",") || "",
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
