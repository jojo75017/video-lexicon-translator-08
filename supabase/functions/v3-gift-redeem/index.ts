// V3 — Activation d'une carte cadeau par le bénéficiaire.
// VERROU : l'email vient du JWT (utilisateur connecté), jamais du client.
// Crée une commande Base payée (v3_installment_orders) pour ce seul email,
// puis marque la carte comme utilisée (code mort).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function adminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // 1. Authentifier le bénéficiaire — l'email provient du serveur d'auth.
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Connexion requise" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    const email = userData?.user?.email?.trim().toLowerCase();
    if (userErr || !email) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { code, environment } = await req.json();
    const env = environment === "live" ? "live" : "sandbox";
    const cleanCode = typeof code === "string" ? code.trim().toUpperCase() : "";
    if (!cleanCode) throw new Error("Code requis");

    const supabase = adminClient();
    const { data: card } = await supabase
      .from("v3_gift_cards").select("*").eq("code", cleanCode).maybeSingle();

    if (!card) throw new Error("Code introuvable.");
    if (card.environment !== env) throw new Error("Code non valide dans cet environnement.");
    if (card.status === "redeemed") throw new Error("Cette carte cadeau a déjà été utilisée.");
    if (card.status !== "active") throw new Error("Cette carte n'est pas encore active (paiement non confirmé).");

    // 2. Créer l'entitlement Base pour CET email uniquement.
    const { error: orderErr } = await supabase
      .from("v3_installment_orders")
      .insert({
        email,
        plan: "base_gift",
        installments_total: 1,
        installments_paid: 1,
        amount_total: card.amount_paid,
        currency: card.currency,
        status: "paid",
        environment: env,
      });
    if (orderErr) throw new Error(`DB: ${orderErr.message}`);

    // 3. Marquer la carte comme utilisée — code mort.
    await supabase
      .from("v3_gift_cards")
      .update({ status: "redeemed", redeemed_by_email: email, redeemed_at: new Date().toISOString() })
      .eq("id", card.id);

    return new Response(
      JSON.stringify({ ok: true, email }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Activation impossible";
    console.error("v3-gift-redeem error:", message);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
