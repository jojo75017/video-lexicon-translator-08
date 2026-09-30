/**
 * Statut public de l'opération fondateur : 15 jours ou 15 places à 47 €.
 *
 * Lecture seule, sans authentification : la page de commande affiche le
 * nombre de places réellement restantes. On compte uniquement les commandes
 * d'accès à vie (`v2_1x`) réglées depuis le début de l'opération.
 *
 * Aucune écriture, aucun changement de tarif ni de droit d'accès.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/** Doit rester identique à `src/data/offreFondateur.ts`. */
const START_ISO = "2026-09-30T00:00:00Z";
const END_ISO = "2026-10-15T21:59:59Z";
const SEATS = 15;
const PLAN = "v2_1x";

/** Statuts qui signifient « réellement payé ». */
const PAID = ["active", "completed", "paid"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
    });

  try {
    const db = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // Commandes d'accès à vie réglées depuis l'ouverture de l'opération.
    const { data: orders, error: ordersError } = await db
      .from("v3_installment_orders")
      .select("email, status, created_at")
      .eq("plan", PLAN)
      .in("status", PAID)
      .gte("created_at", START_ISO);
    if (ordersError) throw new Error(ordersError.message);

    // Commandes du tunnel (PayPal / hors Stripe) sur le même produit.
    const { data: funnel } = await db
      .from("funnel_orders")
      .select("email, status, created_at")
      .eq("status", "paid")
      .gte("created_at", START_ISO);

    // Un même acheteur ne consomme qu'une seule place.
    const buyers = new Set<string>();
    for (const row of orders ?? []) {
      const e = String((row as { email?: string }).email ?? "").trim().toLowerCase();
      if (e) buyers.add(e);
    }
    for (const row of funnel ?? []) {
      const e = String((row as { email?: string }).email ?? "").trim().toLowerCase();
      if (e) buyers.add(e);
    }

    const sold = buyers.size;
    const remaining = Math.max(0, SEATS - sold);
    const expired = Date.now() > new Date(END_ISO).getTime();
    const soldOut = remaining === 0;

    return respond({
      sold,
      remaining,
      seats: SEATS,
      closed: expired || soldOut,
      reason: soldOut ? "sold_out" : expired ? "expired" : "open",
      endsAt: END_ISO,
    });
  } catch (err) {
    console.error("offre-fondateur-status error", err);
    // En cas d'incident, l'offre reste ouverte : on ne bloque jamais une vente.
    return respond({
      sold: 0,
      remaining: SEATS,
      seats: SEATS,
      closed: false,
      reason: "open",
      endsAt: END_ISO,
    });
  }
});
