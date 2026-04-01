import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKeyRaw = Deno.env.get("STRIPE_SECRET_KEY");
    const stripeKey = (stripeKeyRaw || "").trim();
    if (!stripeKey) {
      throw new Error("Stripe non configuré");
    }

    console.log("Stripe key prefix:", stripeKey.slice(0, 7));

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const { planId, email, successUrl, cancelUrl } = await req.json();

    console.log("Creating checkout for plan:", planId, "email:", email);

    if (!email) throw new Error("Email requis");

    const isRestrictedKey = stripeKey.startsWith("rk_");

    // Get or create customer
    let customerId: string | undefined;
    if (!isRestrictedKey) {
      const customers = await stripe.customers.list({ email, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      } else {
        const newCustomer = await stripe.customers.create({ email });
        customerId = newCustomer.id;
      }
      console.log("Customer:", customerId);
    }

    // Get or create a recurring price for the subscription with trial
    const configuredPriceId = (Deno.env.get("STRIPE_LIFETIME_PRICE_ID") || "").trim();
    let priceId: string;

    if (isRestrictedKey) {
      if (!configuredPriceId || !configuredPriceId.startsWith("price_")) {
        throw new Error(
          "Clé Stripe limitée: configurez STRIPE_LIFETIME_PRICE_ID (price_...) dans le backend."
        );
      }
      priceId = configuredPriceId;
    } else {
      // Look for or create a recurring price for the trial model
      const productName = "EbookStudio Pro — Accès à Vie";
      const amount = 6700; // 67€

      const products = await stripe.products.search({
        query: `name:'${productName}'`,
        limit: 1,
      });

      let productId: string;
      if (products.data.length > 0) {
        productId = products.data[0].id;
      } else {
        const product = await stripe.products.create({
          name: productName,
          description: "Accès complet à EbookStudio Pro avec essai gratuit de 7 jours",
        });
        productId = product.id;
      }

      // Look for existing recurring price
      const prices = await stripe.prices.list({
        product: productId,
        active: true,
        type: "recurring",
        limit: 10,
      });

      const matchingPrice = prices.data.find(
        (p) => p.unit_amount === amount && p.recurring?.interval === "year"
      );

      if (matchingPrice) {
        priceId = matchingPrice.id;
      } else {
        // Create a yearly recurring price (will only charge once after trial due to cancel logic)
        const price = await stripe.prices.create({
          product: productId,
          unit_amount: amount,
          currency: "eur",
          recurring: { interval: "year" },
        });
        priceId = price.id;
      }
    }

    console.log("Using price:", priceId);

    // Create subscription checkout with 7-day trial
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      ...(customerId ? { customer: customerId } : { customer_email: email }),
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 7,
        metadata: { planId: planId || "pro", email },
      },
      success_url:
        successUrl ||
        `${req.headers.get("origin")}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/offres`,
      metadata: { planId: planId || "pro", email },
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
