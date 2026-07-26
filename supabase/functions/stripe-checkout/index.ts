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
    // Promo d'été jusqu'au 31 août 2026 : 5900 (tarif normal 6700 à rétablir après).
    amount: 5900,
  },
  serenity: {
    name: "Pack Sérénité",
    description: "Session Zoom 1-à-1 + support prioritaire + audit ebook",
    amount: 3000,
  },
  extended_license: {
    name: "Licence Commerciale Étendue",
    description: "Usage freelance / agence + projets clients illimités",
    amount: 6700,
  },
  v3_base: {
    name: "Publication Assistée Pro V3 — Base",
    description: "Écrire, illustrer, formater et publier sur KDP (accès à vie)",
    amount: 19700,
  },
  v3_pro: {
    name: "Publication Assistée Pro V3 — Pack Pro Vendeur",
    description: "La Base + les 4 packs essentiels (accès à vie)",
    amount: 34700,
  },
  v3_order_bump: {
    name: "Pack Guides Avancés KDP (Order Bump)",
    description: "3 guides avancés : Ads rentables, scaling multi-livres & niches cachées",
    amount: 4700,
  },
  bookperfect: {
    name: "BookPerfect AI — Directeur Éditorial",
    description: "Analyse éditoriale IA de votre manuscrit + export Word corrigé (accès à vie)",
    amount: 9700,
  },
  bookperfect_launch: {
    name: "BookPerfect AI — Offre de lancement",
    description: "BookPerfect AI, directeur éditorial IA (tarif de lancement, accès à vie)",
    amount: 6700,
  },
};

// Produit de base selon le plan choisi
const PLAN_BASE_PRODUCT: Record<string, string> = {
  "v3-base": "v3_base",
  "v3-pro": "v3_pro",
  "bookperfect": "bookperfect",
  "bookperfect_launch": "bookperfect_launch",
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
    // Le produit de base dépend du plan choisi (V3 = v3_base / v3_pro, sinon pro_lifetime V2)
    const baseProduct = PLAN_BASE_PRODUCT[planId] || "pro_lifetime";
    const requestedItems: string[] = [baseProduct];
    if (Array.isArray(addons)) {
      for (const addon of addons) {
        if (typeof addon === "string" && PRODUCT_CATALOG[addon] && addon !== baseProduct) {
          requestedItems.push(addon);
        }
      }
    }

    // Résolution via lookup_key : chaque item est un vrai Product + Price catalogué
    // dans Stripe (visible dans le dashboard). Créé automatiquement au 1er passage,
    // réutilisé ensuite. Si le montant change (ex: fin de la promo été), un nouveau
    // Price est créé et le lookup_key est transféré dessus (l'ancien est désactivé).
    async function resolveCatalogPrice(key: string): Promise<string> {
      const product = PRODUCT_CATALOG[key];
      // Suffixe le lookup_key avec le montant pour que la promo 59€ et le tarif
      // normal 67€ soient DEUX prix distincts (les deux visibles dans le catalogue).
      const lookupKey = `${key}_${product.amount}`;

      const existing = await stripe.prices.list({
        lookup_keys: [lookupKey],
        active: true,
        limit: 1,
        expand: ["data.product"],
      });
      if (existing.data.length > 0) return existing.data[0].id;

      // Créer le Product s'il n'existe pas (recherche par metadata.catalog_key)
      let productId: string | undefined;
      const products = await stripe.products.search({
        query: `metadata['catalog_key']:'${key}' AND active:'true'`,
        limit: 1,
      });
      if (products.data.length > 0) {
        productId = products.data[0].id;
      } else {
        const created = await stripe.products.create({
          name: product.name,
          description: product.description,
          metadata: { catalog_key: key },
        });
        productId = created.id;
      }

      const price = await stripe.prices.create({
        product: productId,
        currency: "eur",
        unit_amount: product.amount,
        lookup_key: lookupKey,
        transfer_lookup_key: true,
        nickname: product.name,
      });
      return price.id;
    }

    const resolvedPrices = await Promise.all(requestedItems.map(resolveCatalogPrice));
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolvedPrices.map((priceId) => ({
      price: priceId,
      quantity: 1,
    }));

    const totalAmount = requestedItems.reduce((sum, key) => sum + PRODUCT_CATALOG[key].amount, 0);
    console.log("Line items:", requestedItems, "Prices:", resolvedPrices, "Total:", totalAmount / 100, "€");

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
