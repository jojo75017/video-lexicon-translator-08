import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Plan configurations with cached price IDs (will be populated on first run)
const PLANS = {
  starter: {
    name: "Ebook Generator - Starter",
    price: 2700,
    type: "subscription" as const,
    interval: "month" as const,
    features: ["5 ebooks/mois", "Fonctions de base", "Export PDF", "Support email"],
  },
  pro: {
    name: "Ebook Generator - Pro",
    price: 6700,
    type: "subscription" as const,
    interval: "month" as const,
    features: ["Ebooks illimités", "Toutes les fonctions", "Export PDF/EPUB", "Formation incluse", "Support prioritaire"],
  },
  lifetime: {
    name: "Ebook Generator - Lifetime",
    price: 14700,
    type: "one_time" as const,
    features: ["Accès à vie", "Toutes les fonctions", "Mises à jour gratuites", "Support VIP", "Formation complète"],
  },
};

// Cache for price IDs to avoid repeated API calls
const priceCache: Record<string, string> = {};

async function getOrCreatePrice(stripe: Stripe, planId: string, plan: typeof PLANS.starter): Promise<string> {
  // Check cache first
  if (priceCache[planId]) {
    console.log("Using cached price for", planId);
    return priceCache[planId];
  }

  // Search for existing price by looking up the product
  const products = await stripe.products.search({
    query: `name:'${plan.name}'`,
    limit: 1,
  });

  let productId: string;

  if (products.data.length > 0) {
    productId = products.data[0].id;
    console.log("Found existing product:", productId);
    
    // Get prices for this product
    const prices = await stripe.prices.list({ 
      product: productId, 
      active: true,
      limit: 10 
    });
    
    const matchingPrice = prices.data.find(p => 
      p.unit_amount === plan.price && 
      (plan.type === "subscription" ? p.recurring?.interval === plan.interval : p.type === "one_time")
    );

    if (matchingPrice) {
      console.log("Found existing price:", matchingPrice.id);
      priceCache[planId] = matchingPrice.id;
      return matchingPrice.id;
    }
  } else {
    // Create product
    const product = await stripe.products.create({
      name: plan.name,
      description: plan.features.join(", "),
    });
    productId = product.id;
    console.log("Created product:", productId);
  }

  // Create price
  let price: Stripe.Price;
  if (plan.type === "subscription") {
    price = await stripe.prices.create({
      product: productId,
      unit_amount: plan.price,
      currency: "eur",
      recurring: { interval: plan.interval },
    });
  } else {
    price = await stripe.prices.create({
      product: productId,
      unit_amount: plan.price,
      currency: "eur",
    });
  }
  
  console.log("Created price:", price.id);
  priceCache[planId] = price.id;
  return price.id;
}

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

    // Run customer lookup and price lookup in parallel
    const [customersResult, priceId] = await Promise.all([
      stripe.customers.list({ email, limit: 1 }),
      getOrCreatePrice(stripe, planId, plan),
    ]);

    // Get or create customer
    let customerId: string;
    if (customersResult.data.length > 0) {
      customerId = customersResult.data[0].id;
      console.log("Found existing customer:", customerId);
    } else {
      const newCustomer = await stripe.customers.create({ email });
      customerId = newCustomer.id;
      console.log("Created new customer:", customerId);
    }

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
