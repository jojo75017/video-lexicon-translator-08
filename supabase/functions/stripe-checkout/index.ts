import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Catalogue des produits autorisés (montants en centimes EUR)
const PRODUCT_CATALOG: Record<string, { name: string; description: string; amount: number }> = {
  pro_lifetime: {
    name: "EbookStudio Pro — Accès à Vie",
    description: "Accès complet à EbookStudio Pro (paiement unique)",
    amount: 6700,
  },
  serenity: {
    name: "Pack Sérénité",
    description: "Session Zoom 1-à-1 + support prioritaire + audit ebook",
    amount: 3000,
  },
  extended_license: {
    name: "Licence Commerciale Étendue",
    description: "Usage freelance / agence + projets clients illimités",
    amount: 4700,
  },
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

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const { planId, email, successUrl, cancelUrl, addons } = await req.json();

    console.log("Creating checkout for plan:", planId, "email:", email, "addons:", addons);

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
    }

    // Construire la liste des produits commandés
    // Le produit principal "pro_lifetime" est toujours inclus
    const requestedItems: string[] = ["pro_lifetime"];
    if (Array.isArray(addons)) {
      for (const addon of addons) {
        if (typeof addon === "string" && PRODUCT_CATALOG[addon] && addon !== "pro_lifetime") {
          requestedItems.push(addon);
        }
      }
    }

    // Construire les line items pour Stripe (price_data inline = simple et flexible)
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = requestedItems.map((key) => {
      const product = PRODUCT_CATALOG[key];
      return {
        price_data: {
          currency: "eur",
          unit_amount: product.amount,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
        quantity: 1,
      };
    });

    const totalAmount = requestedItems.reduce((sum, key) => sum + PRODUCT_CATALOG[key].amount, 0);
    console.log("Line items:", requestedItems, "Total:", totalAmount / 100, "€");

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      ...(customerId ? { customer: customerId } : { customer_email: email }),
      line_items: lineItems,
      mode: "payment",
      payment_intent_data: {
        metadata: {
          planId: planId || "pro",
          email,
          items: requestedItems.join(","),
        },
      },
      success_url:
        successUrl ||
        `${req.headers.get("origin")}/paiement-succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.get("origin")}/offres`,
      metadata: {
        planId: planId || "pro",
        email,
        items: requestedItems.join(","),
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
