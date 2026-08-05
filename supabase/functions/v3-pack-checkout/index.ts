// V3 Pack Tout Complet — checkout embarqué via la gateway Lovable Payments.
// Formules : 1×547€ (paiement unique) / 3×189€ / 4×144€ (échéancier mensuel).
// Les échéances sont gérées via un abonnement Stripe mensuel ; le webhook
// `payments-webhook` annule l'abonnement et bascule en accès à vie une fois
// toutes les échéances payées (voir métadonnées installments_total).

import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Catalogue des formules autorisées (montants en centimes EUR).
const PLANS: Record<
  string,
  { label: string; total: number; installments: number; monthly: number }
> = {
  full_1x: { label: "Pack Pro Vendeur V3 — paiement unique", total: 54700, installments: 1, monthly: 54700 },
  full_3x: { label: "Pack Pro Vendeur V3 — 3× sans frais", total: 56700, installments: 3, monthly: 18900 },
  full_4x: { label: "Pack Pro Vendeur V3 — 4× sans frais", total: 57600, installments: 4, monthly: 14400 },
  base_1x: { label: "Base Création & Publication V3 — paiement unique", total: 19700, installments: 1, monthly: 19700 },
  base_3x: { label: "Base Création & Publication V3 — 3× sans frais", total: 20700, installments: 3, monthly: 6900 },
  // Offre V2 « accès à vie » — tunnel unique /commander.
  // Tarif été (août & septembre 2026) : 47 € au lieu de 59 €.
  v2_1x: { label: "EbookStudio Pro — accès à vie (paiement unique)", total: 4700, installments: 1, monthly: 4700 },
  v2_2x: { label: "EbookStudio Pro — accès à vie (2× 25€)", total: 5000, installments: 2, monthly: 2500 },
  v2_3x: { label: "EbookStudio Pro — accès à vie (3× 18€)", total: 5400, installments: 3, monthly: 1800 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { plan, email, environment, returnUrl, src, ref } = await req.json();

    const env: StripeEnv = environment === "live" ? "live" : "sandbox";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error("Email valide requis");
    }
    // Tous les anciens identifiants de l'offre à vie sont ramenés au tarif
    // public actuel. Un vieux lien ou une ancienne version du site ne peut
    // donc jamais créer une commande à 59 € pendant la promo.
    const normalizedPlan = plan === "v2_59_1x" ? "v2_1x" : plan;
    const planDef = PLANS[normalizedPlan];
    if (!planDef) throw new Error("Formule inconnue");
    if (typeof returnUrl !== "string" || !/^https?:\/\//.test(returnUrl)) {
      throw new Error("returnUrl invalide");
    }

    // Résoudre / créer le client Stripe (via gateway).
    const found = await stripeRequest(env, "GET", "/customers", { email: trimmedEmail, limit: 1 });
    const customerId: string = found?.data?.[0]?.id
      ?? (await stripeRequest(env, "POST", "/customers", { email: trimmedEmail })).id;

    // Enregistrer la commande (suivi des échéances).
    const supabase = getSupabase();
    const { data: order, error: orderErr } = await supabase
      .from("v3_installment_orders")
      .insert({
        email: trimmedEmail,
        plan: normalizedPlan,
        installments_total: planDef.installments,
        installments_paid: 0,
        amount_total: planDef.total / 100,
        currency: "EUR",
        status: "pending",
        stripe_customer_id: customerId,
        environment: env,
      })
      .select("id")
      .single();
    if (orderErr) throw new Error(`DB: ${orderErr.message}`);
    const orderId = order.id as string;

    const clean = (v: unknown) =>
      typeof v === "string" && v.trim() ? v.trim().slice(0, 60) : undefined;
    const commonMeta: Record<string, string> = {
      kind: "v3_full_pack",
      plan: normalizedPlan,
      email: trimmedEmail,
      order_id: orderId,
      installments_total: String(planDef.installments),
    };
    const srcTag = clean(src);
    const refTag = clean(ref);
    if (srcTag) commonMeta.src = srcTag;
    if (refTag) commonMeta.ref = refTag;

    let sessionParams: Record<string, any>;
    if (planDef.installments === 1) {
      // Paiement unique 547€.
      sessionParams = {
        mode: "payment",
        ui_mode: "embedded_page",
        locale: "fr",
        // PayPal forcé explicitement : la configuration dynamique de moyens
        // de paiement du compte ne le remontait pas sur /commander.
        "payment_method_types[0]": "card",
        "payment_method_types[1]": "paypal",
        customer: customerId,
        return_url: returnUrl,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: planDef.monthly,
            product_data: { name: planDef.label },
          },
        }],
        "payment_intent_data[description]": planDef.label,
        "payment_intent_data[metadata][order_id]": orderId,
        metadata: commonMeta,
      };
    } else {
      // Échéancier : abonnement mensuel limité à N prélèvements (annulé par le webhook).
      sessionParams = {
        mode: "subscription",
        ui_mode: "embedded_page",
        locale: "fr",
        customer: customerId,
        return_url: returnUrl,
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: planDef.monthly,
            recurring: { interval: "month" },
            product_data: { name: planDef.label },
          },
        }],
        "subscription_data[metadata][order_id]": orderId,
        "subscription_data[metadata][kind]": "v3_full_pack",
        "subscription_data[metadata][installments_total]": String(planDef.installments),
        metadata: commonMeta,
      };
    }

    const session = await stripeRequest(env, "POST", "/checkout/sessions", sessionParams);

    await supabase
      .from("v3_installment_orders")
      .update({ stripe_session_id: session.id })
      .eq("id", orderId);

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret, orderId }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de paiement";
    console.error("v3-pack-checkout error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
