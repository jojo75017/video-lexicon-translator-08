import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Plan configurations
const PLANS = {
  starter: {
    name: "Starter",
    price: 2700, // in cents
    type: "subscription" as const,
    interval: "month" as const,
    features: ["5 ebooks/mois", "Fonctions de base", "Export PDF", "Support email"],
  },
  pro: {
    name: "Pro",
    price: 6700,
    type: "subscription" as const,
    interval: "month" as const,
    features: ["Ebooks illimités", "Toutes les fonctions", "Export PDF/EPUB", "Formation incluse", "Support prioritaire"],
  },
  lifetime: {
    name: "Lifetime",
    price: 14700,
    type: "one_time" as const,
    features: ["Accès à vie", "Toutes les fonctions", "Mises à jour gratuites", "Support VIP", "Formation complète"],
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      throw new Error("Stripe non configuré");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const { planId, email, successUrl, cancelUrl } = await req.json();

    console.log("Creating checkout for plan:", planId, "email:", email);

    if (!planId || !PLANS[planId as keyof typeof PLANS]) {
      throw new Error("Plan invalide");
    }

    if (!email) {
      throw new Error("Email requis");
    }

    const plan = PLANS[planId as keyof typeof PLANS];

    // Check if customer exists
    let customerId: string | undefined;
    const existingCustomers = await stripe.customers.list({ email, limit: 1 });
    
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      const newCustomer = await stripe.customers.create({ email });
      customerId = newCustomer.id;
      console.log("Created new customer:", customerId);
    }

    // Create or get product and price
    let priceId: string;
    
    // Search for existing product
    const products = await stripe.products.list({ limit: 100 });
    let product = products.data.find(p => p.name === `Ebook Generator - ${plan.name}`);
    
    if (!product) {
      product = await stripe.products.create({
        name: `Ebook Generator - ${plan.name}`,
        description: plan.features.join(", "),
      });
      console.log("Created product:", product.id);
    }

    // Search for existing price
    const prices = await stripe.prices.list({ product: product.id, limit: 10 });
    let price = prices.data.find(p => 
      p.unit_amount === plan.price && 
      (plan.type === "subscription" ? p.recurring?.interval === plan.interval : p.type === "one_time")
    );

    if (!price) {
      if (plan.type === "subscription") {
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price,
          currency: "eur",
          recurring: { interval: plan.interval },
        });
      } else {
        price = await stripe.prices.create({
          product: product.id,
          unit_amount: plan.price,
          currency: "eur",
        });
      }
      console.log("Created price:", price.id);
    }

    priceId = price.id;

    // Create checkout session
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: plan.type === "subscription" ? "subscription" : "payment",
      success_url: successUrl || `${req.headers.get("origin")}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/offres`,
      metadata: {
        planId,
        email,
      },
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log("Created checkout session:", session.id);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error in stripe-checkout:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
