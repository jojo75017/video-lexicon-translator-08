/**
 * Statut public de l'opération fondateur : 15 jours ou 15 places à 47 €.
 *
 * Lecture seule, sans authentification : la page de commande affiche le
 * nombre de places réellement restantes. Le comptage est partagé avec le
 * paiement (`_shared/offreFondateur.ts`) pour éviter deux vérités.
 *
 * Aucune écriture, aucun changement de tarif ni de droit d'accès.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";
import { getFondateurStatus } from "../_shared/offreFondateur.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const db = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const status = await getFondateurStatus(db);

  return new Response(JSON.stringify(status), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
});
