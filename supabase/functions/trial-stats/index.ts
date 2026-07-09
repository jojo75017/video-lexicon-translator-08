import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return new Response(JSON.stringify({ error: "Non authentifié" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Session invalide" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (isAdmin !== true) {
      return new Response(JSON.stringify({ error: "Accès refusé" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayISO = startOfToday.toISOString();

    // Demandes d'essai aujourd'hui : subscribers créés aujourd'hui en statut trialing/trial_expired
    const { count: trialsToday } = await supabase
      .from("subscribers")
      .select("id", { count: "exact", head: true })
      .gte("created_at", todayISO)
      .in("status", ["trialing", "trial_expired"]);

    // Emails collectés (total leads uniques)
    const { count: emailsCollected } = await supabase
      .from("funnel_leads")
      .select("id", { count: "exact", head: true });

    // Total d'essais démarrés (toutes dates)
    const { count: totalTrials } = await supabase
      .from("subscribers")
      .select("id", { count: "exact", head: true });

    // Essais convertis en abonnements (payants)
    const { count: converted } = await supabase
      .from("subscribers")
      .select("id", { count: "exact", head: true })
      .in("status", ["active"]);

    const { count: lifetime } = await supabase
      .from("subscribers")
      .select("id", { count: "exact", head: true })
      .eq("plan_type", "lifetime");

    const customers = (converted || 0) + (lifetime || 0);
    const conversionRate = totalTrials && totalTrials > 0
      ? Math.round((customers / totalTrials) * 1000) / 10
      : 0;

    return new Response(
      JSON.stringify({
        ok: true,
        trials_today: trialsToday || 0,
        emails_collected: emailsCollected || 0,
        total_trials: totalTrials || 0,
        customers,
        conversion_rate: conversionRate,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("trial-stats error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message || "Erreur serveur" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
