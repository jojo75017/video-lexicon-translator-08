// Embedded Stripe Checkout for V3 monthly subscriptions.
// Uses the shared gateway helper (stripeRequest) — the "keys" in env are
// Lovable connector identifiers, not real Stripe secrets.
import { stripeRequest, type StripeEnv } from "../_shared/stripe.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ALLOWED_PRICES = new Set([
  // V3 subscriptions — 2 forfaits (activation octobre 2026)
  "v3_plume_monthly",
  "v3_plume_annual",
  "v3_edition_monthly",
  "v3_edition_annual",
  // Tarifs « ancien client V2 » (-20 % à vie) — droit revérifié en base
  "v3_plume_monthly_legacy",
  "v3_plume_annual_legacy",
  "v3_edition_monthly_legacy",
  "v3_edition_annual_legacy",
  // Version audio d'un livre (paiement unique)
  "v3_audio_single",
  // Compléments (paiement unique)
  "v3_addon_bookperfect_once",
  "v3_addon_translations_once",
  "v3_addon_audio_premium_once",
  "v3_addon_publishers_once",
  "v3_addon_serenity_once",
  // Legacy / upsells
  "v3_upsell_selection_month",
  "v3_upsell_aplus_month",
  "v3_upsell_lookinside_month",
  "v3_upsell_bookbub_month",
  "v3_upsell_newsletter_month",
  "v3_upsell_relecture_once",
  "v3_upsell_docstudio_once",
  "bookperfect_launch_once",
]);

/** Vérifie qu'un email/userId a bien réglé la V2 (plans `v2_*` payés). */
async function isLegacyV2Buyer(email?: string, userId?: string): Promise<boolean> {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  let target = email;
  if (!target && userId) {
    const { data } = await supabase.auth.admin.getUserById(userId);
    target = data?.user?.email ?? undefined;
  }
  if (!target) return false;
  const { data } = await supabase
    .from("v3_installment_orders")
    .select("plan, status")
    .ilike("email", target)
    .in("status", ["active", "completed", "paid"]);
  return (data ?? []).some((r: any) => String(r.plan ?? "").startsWith("v2"));
}

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
    const { priceId, email, userId, environment, returnUrl, firstMonthFree, refCode } = body ?? {};

    if (!priceId || !ALLOWED_PRICES.has(priceId)) {
      throw new Error("Prix invalide");
    }
    // Un prix `_legacy` n'est accepté que si le droit ancien client V2 est
    // confirmé côté base : le front ne peut pas s'octroyer la remise.
    if (String(priceId).endsWith("_legacy")) {
      const ok = await isLegacyV2Buyer(email, userId);
      if (!ok) throw new Error("Tarif ancien client V2 non applicable à ce compte");
    }

    const env: StripeEnv = environment === "live" ? "live" : "sandbox";
    if (!returnUrl || typeof returnUrl !== "string") {
      throw new Error("returnUrl requis");
    }

    // Code de parrainage optionnel (stocké côté Stripe pour calcul de commission).
    const cleanRefCode =
      typeof refCode === "string" && /^[A-Za-z0-9_-]{1,40}$/.test(refCode) ? refCode : null;

    // Resolve human-readable priceId → real Stripe price via lookup_key
    const prices = await stripeRequest<any>(env, "GET", "/prices/search", {
      query: `lookup_key:'${priceId}'`,
      limit: 1,
    });
    if (!prices?.data?.length) throw new Error("Prix Stripe introuvable");
    const stripePrice = prices.data[0];
    const stripePriceId = stripePrice.id;
    const isRecurring = stripePrice.type === "recurring";

    const customerId = await resolveOrCreateCustomer(env, { email, userId });

    // Offre de lancement « premier mois offert » : la première facture tombe
    // le 1er novembre 2026, jamais avant. Réservée aux abonnements.
    const TRIAL_END_UNIX = Math.floor(Date.UTC(2026, 10, 1, 7, 0, 0) / 1000);
    const wantsTrial =
      firstMonthFree === true && isRecurring && TRIAL_END_UNIX > Math.floor(Date.now() / 1000);

    const subscriptionData: Record<string, unknown> = {};
    if (userId) subscriptionData.metadata = { userId, plan: priceId };
    if (wantsTrial) subscriptionData.trial_end = TRIAL_END_UNIX;

    const session = await stripeRequest<any>(env, "POST", "/checkout/sessions", {
      mode: isRecurring ? "subscription" : "payment",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      ...(customerId && { customer: customerId }),
      ...(userId && { metadata: { userId, plan: priceId } }),
      ...(isRecurring && Object.keys(subscriptionData).length > 0 && {
        subscription_data: subscriptionData,
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
