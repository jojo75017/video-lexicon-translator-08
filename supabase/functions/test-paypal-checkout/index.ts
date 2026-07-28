import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';
import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: req.headers.get("Authorization")! } },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Accès admin requis" }),
        { status: 403, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const returnUrl = String(body.returnUrl || "").trim();
    const env: StripeEnv = body.environment === "live" ? "live" : "sandbox";

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Email invalide" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }
    if (!returnUrl) {
      return new Response(
        JSON.stringify({ error: "returnUrl requis" }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const session = await stripeRequest<any>(env, "POST", "/checkout/sessions", {
      mode: "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer_email: email,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: "Test PayPal — EbookStudio (1 €)" },
          unit_amount: 100,
        },
        quantity: 1,
      }],
      payment_intent_data: { description: "Test PayPal EbookStudio" },
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("test-paypal-checkout error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message || "Erreur serveur" }),
      { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
