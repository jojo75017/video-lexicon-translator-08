// V3 — Checkout embarqué pour l'achat d'UN pack premium à la carte.
// Paiement unique (one-time) via la gateway Lovable Payments.
// Les prix sont définis côté serveur pour éviter toute manipulation client.

import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// Catalogue serveur des packs à la carte (montants en centimes EUR).
// DOIT rester aligné avec V3_UPSELL_PACKS dans src/data/roadmapV3.ts.
const PACKS: Record<string, { label: string; amount: number }> = {
  cover: { label: "Pack Visuel & Conversion", amount: 6700 },
  marketing: { label: "Pack Lancement & Visibilité", amount: 14700 },
  social: { label: "Pack Trafic Social & Viralité", amount: 8700 },
  transcription: { label: "Transcription Audio / Vidéo → Texte", amount: 6700 },
  monetisation: { label: "Pack Revenus & Scaling", amount: 9900 },
  editorial: { label: "Pack Qualité Éditoriale Pro", amount: 6700 },
  distribution: { label: "Pack Distribution Large (Wide)", amount: 9700 },
  promotion: { label: "Pack Promotion Éditeur", amount: 9700 },
  boost_lancement: { label: "Pack Boost de Lancement", amount: 1700 },
  puzzle_book: { label: "Livres de Jeux & Énigmes — Accès à vie", amount: 2700 },
  cherche_trouve: { label: "Coloriages Cherche & Trouve — Accès à vie", amount: 2700 },
  short_stories: { label: "Histoires Courtes & Contes Illustrés — Accès à vie", amount: 2700 },
  "market-research": { label: "Pack Étude de Marché Pro", amount: 9700 },
  "documentation-studio": { label: "Documentation Studio AI", amount: 19700 },
  // Studio BD & Jeunesse — offre d'entrée 17 € puis upsell Pro 47 €.
  bd_comic: { label: "Studio BD & Jeunesse — Accès à vie", amount: 1700 },
  bd_comic_pro: { label: "Studio BD & Jeunesse Pro — Illustrations étendues", amount: 4700 },
  // Cover Studio KDP Pro — upsell indépendant (3 générations IA incluses une seule fois).
  cover_studio_pro: { label: "Cover Studio KDP Pro — Accès à vie", amount: 6700 },
  // Ebook Version Longue — accès anticipé V4, paiement unique.
  ebook_version_longue: { label: "Ebook Version Longue V4 — Accès à vie", amount: 4700 },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { packId, email, environment, returnUrl } = await req.json();

    const env: StripeEnv = environment === "live" ? "live" : "sandbox";
    const trimmedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error("Email valide requis");
    }
    const packDef = PACKS[packId];
    if (!packDef) throw new Error("Pack inconnu");
    if (typeof returnUrl !== "string" || !/^https?:\/\//.test(returnUrl)) {
      throw new Error("returnUrl invalide");
    }

    // Résoudre / créer le client Stripe (via gateway).
    const found = await stripeRequest(env, "GET", "/customers", { email: trimmedEmail, limit: 1 });
    const customerId: string = found?.data?.[0]?.id
      ?? (await stripeRequest(env, "POST", "/customers", { email: trimmedEmail })).id;

    // Enregistrer la commande pour suivi (réutilise la table des commandes V3).
    const supabase = getSupabase();
    const { data: order, error: orderErr } = await supabase
      .from("v3_installment_orders")
      .insert({
        email: trimmedEmail,
        plan: `pack_${packId}`,
        installments_total: 1,
        installments_paid: 0,
        amount_total: packDef.amount / 100,
        currency: "EUR",
        status: "pending",
        stripe_customer_id: customerId,
        environment: env,
      })
      .select("id")
      .single();
    if (orderErr) throw new Error(`DB: ${orderErr.message}`);
    const orderId = order.id as string;

    const session = await stripeRequest(env, "POST", "/checkout/sessions", {
      mode: "payment",
      ui_mode: "embedded_page",
      customer: customerId,
      return_url: returnUrl,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: packDef.amount,
          product_data: { name: packDef.label },
        },
      }],
      "payment_intent_data[description]": packDef.label,
      "payment_intent_data[metadata][order_id]": orderId,
      metadata: {
        kind: "v3_upsell_pack",
        pack_id: packId,
        email: trimmedEmail,
        order_id: orderId,
      },
    });

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
    console.error("v3-upsell-checkout error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
