// Embedded Stripe Checkout for V3 monthly subscriptions.
// Uses the shared gateway helper (stripeRequest) — the "keys" in env are
// Lovable connector identifiers, not real Stripe secrets.
import { stripeRequest, type StripeEnv } from "../_shared/stripe.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_PRICES = new Set([
  "v3_debutant_monthly",
  "v3_expert_monthly",
  "v3_auteur_monthly",
]);

async function resolveOrCreateCustomer(
  env: StripeEnv,
  opts: { email?: string; userId?: string },
): Promise<string | undefined> {
  if (!opts.email && !opts.userId) return undefined;
  if (opts.userId && !/^[a-zA-Z0-9_-]+$/.test(opts.userId)) {
    throw new Error("Invalid userId");
  }
  if (opts.userId) {
    const found = await stripeRequest<any>(env, "GET", "/customers/search", {
      query: `metadata['userId']:'${opts.userId}'`,
      limit: 1,
    });
    if (found?.data?.length) return found.data[0].id;
  }
  if (opts.email) {
    const existing = await stripeRequest<any>(env, "GET", "/customers", {
      email: opts.email,
      limit: 1,
    });
    if (existing?.data?.length) {
      const c = existing.data[0];
      if (opts.userId && c.metadata?.userId !== opts.userId) {
        await stripeRequest(env, "POST", `/customers/${c.id}`, {
          metadata: { userId: opts.userId },
        });
      }
      return c.id;
    }
  }
  const created = await stripeRequest<any>(env, "POST", "/customers", {
    ...(opts.email && { email: opts.email }),
    ...(opts.userId && { metadata: { userId: opts.userId } }),
  });
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: cors });
  }

  try {
    const body = await req.json();
    const { priceId, email, userId, environment, returnUrl } = body ?? {};

    if (!priceId || !ALLOWED_PRICES.has(priceId)) {
      throw new Error("Prix invalide");
    }
    const env: StripeEnv = environment === "live" ? "live" : "sandbox";
    if (!returnUrl || typeof returnUrl !== "string") {
      throw new Error("returnUrl requis");
    }

    // Resolve human-readable priceId → real Stripe price via lookup_key
    const prices = await stripeRequest<any>(env, "GET", "/prices/search", {
      query: `lookup_key:'${priceId}'`,
      limit: 1,
    });
    if (!prices?.data?.length) throw new Error("Prix Stripe introuvable");
    const stripePriceId = prices.data[0].id;

    const customerId = await resolveOrCreateCustomer(env, { email, userId });

    const params: Record<string, any> = {
      mode: "subscription",
      ui_mode: "embedded",
      return_url: returnUrl,
      "line_items[0][price]": stripePriceId,
      "line_items[0][quantity]": 1,
    };
    if (customerId) params.customer = customerId;
    if (userId) {
      params["metadata[userId]"] = userId;
      params["subscription_data[metadata][userId]"] = userId;
      params["metadata[plan]"] = priceId;
    }

    // Flatten in-place: stripeRequest already flattens objects, so we can
    // rebuild a normal object graph for readability.
    const session = await stripeRequest<any>(env, "POST", "/checkout/sessions", {
      mode: "subscription",
      ui_mode: "embedded",
      return_url: returnUrl,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      ...(customerId && { customer: customerId }),
      ...(userId && {
        metadata: { userId, plan: priceId },
        subscription_data: { metadata: { userId, plan: priceId } },
      }),
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("v3-subscription-checkout error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message ?? "Erreur inconnue" }),
      { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
    );
  }
});
