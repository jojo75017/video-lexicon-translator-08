// V3 Pack Tout Complet — checkout embarqué via la gateway Lovable Payments.
// Formules : 1×547€ (paiement unique) / 3×189€ / 4×144€ (échéancier mensuel).
// Les échéances sont gérées via un abonnement Stripe mensuel ; le webhook
// `payments-webhook` annule l'abonnement et bascule en accès à vie une fois
// toutes les échéances payées (voir métadonnées installments_total).

import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getFondateurStatus } from "../_shared/offreFondateur.ts";

function requiredEnv(key: string) { const value = Deno.env.get(key); if (!value) throw new Error(`${key} is not configured`); return value; }

function getSupabase() {
  return createClient(
    requiredEnv("SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

// `first` = surplus en centimes ajouté à la 1re échéance seulement, pour que
// le total payé soit exactement le prix rond (ex. 32,34 + 32,33 + 32,33 = 97,00).
import { NEW_OFFER_PAYMENTS } from "../_shared/newOfferPayments.ts";

const PLANS: Record<
  string,
  { label: string; total: number; installments: number; monthly: number; first?: number }
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
  ...NEW_OFFER_PAYMENTS,
};


async function resolveOrCreateCustomer(
  stripe: ReturnType<typeof createStripeClient>,
  options: { email?: string; userId?: string },
): Promise<string> {
  if (options.userId && !/^[a-zA-Z0-9_-]+$/.test(options.userId)) throw new Error("Invalid userId");
  if (options.userId) {
    const found = await stripe.customers.search({ query: `metadata['userId']:'${options.userId}'`, limit: 1 });
    if (found.data.length) return found.data[0].id;
  }
  if (options.email) {
    const existing = await stripe.customers.list({ email: options.email, limit: 1 });
    if (existing.data.length) {
      const customer = existing.data[0];
      if (options.userId && customer.metadata?.userId !== options.userId) await stripe.customers.update(customer.id, { metadata: { ...customer.metadata, userId: options.userId } });
      return customer.id;
    }
  }
  const created = await stripe.customers.create({ ...(options.email && { email: options.email }), ...(options.userId && { metadata: { userId: options.userId } }) });
  return created.id;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { plan, email, environment, returnUrl, src, ref } = await req.json();

    if (environment !== "live" && environment !== "sandbox") throw new Error("Environnement de paiement invalide");
    const env: StripeEnv = environment;
    const stripe = createStripeClient(env);
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

    const isNewOffer = normalizedPlan.startsWith("auteur97_") || normalizedPlan.startsWith("edition247_");
    const supabase = getSupabase();
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    const { data: authData } = token ? await supabase.auth.getUser(token) : { data: { user: null } };
    const customerId = await resolveOrCreateCustomer(stripe, { email: trimmedEmail, userId: authData.user?.id });

    // Enregistrer la commande (suivi des échéances).
    // Anti double débit : si la même personne a déjà une session ouverte pour
    // la même formule (actualisation, retour arrière), on la réutilise.
    if (isNewOffer) {
      const since = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data: prev } = await supabase
        .from("v3_installment_orders")
        .select("id, stripe_session_id, status")
        .eq("email", trimmedEmail).eq("plan", normalizedPlan).eq("environment", env)
        .gte("created_at", since).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (prev?.status && prev.status !== "pending") {
        throw new Error("Un paiement pour cette formule vient déjà d'être validé avec cet email. Connectez-vous à votre espace client.");
      }
      if (prev?.stripe_session_id) {
        try {
          const s = await stripe.checkout.sessions.retrieve(prev.stripe_session_id);
          if (s?.status === "open" && s.client_secret && s.metadata?.purchase_model === "one_time") {
            return new Response(JSON.stringify({ clientSecret: s.client_secret, orderId: prev.id, reused: true }),
              { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
          }
          if (s?.status === "complete") {
            throw new Error("Ce paiement est déjà enregistré. Connectez-vous à votre espace client.");
          }
        } catch (e) {
          if (e instanceof Error && e.message.includes("déjà")) throw e;
        }
      }
    }


    // Opération fondateur : les formules d'accès à vie ne sont vendables que
    // dans la limite des places et de la date. Le contrôle est fait ici, côté
    // serveur, pour qu'un lien direct ou une page obsolète ne puisse pas
    // créer une vente après fermeture.
    if (normalizedPlan.startsWith("v2_")) {
      const status = await getFondateurStatus(supabase);
      if (status.closed) {
        throw new Error(
          status.reason === "sold_out"
            ? "Les 15 places à 47 € sont toutes prises. L'offre est définitivement close ; les abonnements restent disponibles."
            : "L'offre à vie à 47 € est terminée. Les abonnements restent disponibles.",
        );
      }
    }
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
      plan_label: planDef.label,
      ...(isNewOffer ? { purchase_model: "one_time" } : {}),
      ...(authData.user ? { userId: authData.user.id } : {}),
    };
    const srcTag = clean(src);
    const refTag = clean(ref);
    if (srcTag) commonMeta.src = srcTag;
    if (refTag) commonMeta.ref = refTag;

    let sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0];
    if (planDef.installments === 1) {
      // Paiement unique 547€.
      sessionParams = {
        mode: "payment",
        ui_mode: "embedded_page",
        locale: "fr",
        // PayPal forcé explicitement : la configuration dynamique de moyens
        // de paiement du compte ne le remontait pas sur /commander.
        payment_method_types: ["card", "paypal"],
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
        payment_intent_data: { description: planDef.label, metadata: { order_id: orderId } },
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
        }, ...(planDef.first ? [{
          // Ajustement d'arrondi facturé une seule fois, sur la 1re échéance.
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: planDef.first,
            product_data: { name: "Ajustement d'arrondi (1re échéance)" },
          },
        }] : [])],
        subscription_data: { metadata: commonMeta },
        metadata: commonMeta,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

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
