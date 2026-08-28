// PayPal Subscription creator — creates a PayPal Product+Plan on demand
// and starts a subscription for the chosen V3 plan (Plume / Édition / Studio Pro)
// in monthly or yearly interval. Returns the PayPal approval URL.

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PAYPAL_BASE = "https://api-m.paypal.com"; // Live

const PLANS = {
  plume:   { name: "EbookStudio — Plume", monthly: 27, yearly: 270 },
  edition: { name: "EbookStudio — Édition", monthly: 47, yearly: 470 },
} as const;

type PlanId = keyof typeof PLANS;
type Interval = "month" | "year";

async function getAccessToken(): Promise<string> {
  const id = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  if (!id || !secret) throw new Error("PayPal credentials missing");
  const auth = btoa(`${id}:${secret}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`OAuth failed: ${JSON.stringify(body)}`);
  return body.access_token;
}

/** Remise permanente réservée aux acheteurs V2 (accès à vie V2 déjà payé). */
const LEGACY_V2_DISCOUNT = 0.2;

const priceFor = (planId: PlanId, interval: Interval, legacyV2: boolean) => {
  const base = interval === "month" ? PLANS[planId].monthly : PLANS[planId].yearly;
  return legacyV2 ? Math.round(base * (1 - LEGACY_V2_DISCOUNT) * 100) / 100 : base;
};

/** Vérifie côté serveur qu'un email a bien réglé la V2 (plans `v2_*`). */
async function isLegacyV2Buyer(
  supabase: ReturnType<typeof createClient>,
  email: string,
): Promise<boolean> {
  const { data } = await supabase
    .from("v3_installment_orders")
    .select("plan, status")
    .ilike("email", email)
    .in("status", ["active", "completed", "paid"]);
  return (data ?? []).some((r: any) => String(r.plan ?? "").startsWith("v2"));
}

async function ensurePlan(
  supabase: ReturnType<typeof createClient>,
  planId: PlanId,
  interval: Interval,
  token: string,
  legacyV2 = false,
): Promise<string> {
  const lookupKey = `v3_${planId}_${interval}${legacyV2 ? "_legacy" : ""}`;
  const { data: cached } = await supabase
    .from("paypal_plan_cache")
    .select("paypal_plan_id")
    .eq("lookup_key", lookupKey)
    .maybeSingle();
  if (cached?.paypal_plan_id) return cached.paypal_plan_id as string;

  const plan = PLANS[planId];
  const amount = priceFor(planId, interval, legacyV2);

  // 1. Create Product
  const prodRes = await fetch(`${PAYPAL_BASE}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `prod-${lookupKey}-${Date.now()}`,
    },
    body: JSON.stringify({
      name: legacyV2 ? `${plan.name} — Ancien client V2` : plan.name,
      description: `Abonnement ${interval === "month" ? "mensuel" : "annuel"} EbookStudio V3`,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });
  const prodBody = await prodRes.json();
  if (!prodRes.ok) throw new Error(`Product create failed: ${JSON.stringify(prodBody)}`);
  const productId = prodBody.id as string;

  // 2. Create Plan
  const planRes = await fetch(`${PAYPAL_BASE}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `plan-${lookupKey}-${Date.now()}`,
    },
    body: JSON.stringify({
      product_id: productId,
      name: `${plan.name} — ${interval === "month" ? "Mensuel" : "Annuel"}`,
      status: "ACTIVE",
      billing_cycles: [{
        frequency: {
          interval_unit: interval === "month" ? "MONTH" : "YEAR",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 1,
        total_cycles: 0, // infinite
        pricing_scheme: {
          fixed_price: { value: amount.toFixed(2), currency_code: "EUR" },
        },
      }],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 2,
      },
    }),
  });
  const planBody = await planRes.json();
  if (!planRes.ok) throw new Error(`Plan create failed: ${JSON.stringify(planBody)}`);
  const paypalPlanId = planBody.id as string;

  await supabase.from("paypal_plan_cache").insert({
    lookup_key: lookupKey,
    paypal_product_id: productId,
    paypal_plan_id: paypalPlanId,
    amount,
    currency: "EUR",
    interval,
  });

  return paypalPlanId;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { planId, interval, email, returnUrl, cancelUrl, legacyV2 } = await req.json();

    if (!PLANS[planId as PlanId]) throw new Error("Invalid planId");
    if (interval !== "month" && interval !== "year") throw new Error("Invalid interval");
    if (!email || !String(email).includes("@")) throw new Error("Invalid email");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // La remise ancien client est revérifiée en base : impossible de l'obtenir
    // en modifiant la requête côté navigateur.
    const wantsLegacy = legacyV2 === true;
    const legacyOk = wantsLegacy ? await isLegacyV2Buyer(supabase, String(email)) : false;
    if (wantsLegacy && !legacyOk) {
      throw new Error("Remise ancien client V2 non applicable à cet email");
    }

    const token = await getAccessToken();
    const paypalPlanId = await ensurePlan(supabase, planId as PlanId, interval as Interval, token, legacyOk);

    // Optional: link to authenticated user
    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const jwt = authHeader.replace("Bearer ", "");
      const { data } = await supabase.auth.getUser(jwt);
      if (data.user) userId = data.user.id;
    }

    const amount = priceFor(planId as PlanId, interval as Interval, legacyOk);
    // Fallback origin: use the caller's origin/referer, else the request URL host.
    const callerOrigin =
      req.headers.get("origin") ||
      (req.headers.get("referer") ? new URL(req.headers.get("referer")!).origin : null) ||
      new URL(req.url).origin;
    const finalReturn = returnUrl || `${callerOrigin}/v3/paypal-retour`;
    const finalCancel = cancelUrl || `${callerOrigin}/v3/forfaits?paypal=cancelled`;

    // Create subscription
    const subRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `sub-${Date.now()}-${crypto.randomUUID()}`,
      },
      body: JSON.stringify({
        plan_id: paypalPlanId,
        subscriber: { email_address: email },
        application_context: {
          brand_name: "EbookStudio",
          locale: "fr-FR",
          shipping_preference: "NO_SHIPPING",
          user_action: "SUBSCRIBE_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          return_url: finalReturn,
          cancel_url: finalCancel,
        },
        custom_id: JSON.stringify({ planId, interval, email, userId, legacyV2: legacyOk }),
      }),
    });
    const subBody = await subRes.json();
    if (!subRes.ok) {
      console.error("Subscription create failed", subBody);
      return new Response(
        JSON.stringify({ error: "PayPal error", details: subBody }),
        { status: subRes.status, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }

    const approveLink = (subBody.links || []).find((l: any) => l.rel === "approve");
    if (!approveLink) throw new Error("No approval link returned by PayPal");

    // Persist pending row
    await supabase.from("paypal_subscriptions").insert({
      user_id: userId,
      email,
      plan_id: planId,
      plan_name: plan.name,
      interval,
      amount,
      currency: "EUR",
      paypal_subscription_id: subBody.id,
      paypal_plan_id: paypalPlanId,
      status: "pending",
      metadata: { create_response: subBody },
    });

    return new Response(
      JSON.stringify({
        subscriptionId: subBody.id,
        approvalUrl: approveLink.href,
      }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("paypal-subscribe error", e);
    return new Response(
      JSON.stringify({ error: e.message || String(e) }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  }
});
