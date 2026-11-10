import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Enregistre l'email d'un visiteur qui valide son email avant le paiement
// Stripe (étape 1 du checkout abonnement). Aucun email n'est envoyé ici :
// c'est une simple trace « intention de commande » pour relance manuelle.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const plan_name = String(body.plan_name || "").trim().slice(0, 120) || null;
    const price_id = String(body.price_id || "").trim().slice(0, 120) || null;
    const page_path = String(body.page_path || "").trim().slice(0, 200) || null;

    if (!isValidEmail(email)) {
      return new Response(JSON.stringify({ error: "Email invalide" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Une seule trace par couple email + formule : on met à jour la date si
    // le visiteur repasse par le checkout.
    const { data: existing } = await supabase
      .from("checkout_intents")
      .select("id")
      .eq("email", email)
      .eq("plan_name", plan_name)
      .maybeSingle();

    if (existing?.id) {
      await supabase
        .from("checkout_intents")
        .update({ created_at: new Date().toISOString(), page_path })
        .eq("id", existing.id);
    } else {
      const { error } = await supabase
        .from("checkout_intents")
        .insert({ email, plan_name, price_id, page_path });
      if (error) throw error;
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("capture-checkout-intent error:", e);
    return new Response(
      JSON.stringify({ error: (e as Error).message || "Erreur serveur" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
