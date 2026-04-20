// Log client errors to error_logs table + send email alert if severity >= critical or rate threshold passed
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ADMIN_EMAIL = "boubetgeorges@gmail.com";
const ALERT_THRESHOLD_PER_HOUR = 5;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      error_type,
      error_message,
      error_stack,
      context,
      url,
      user_email,
      user_id,
      severity = "error",
    } = body || {};

    if (!error_type || !error_message) {
      return new Response(
        JSON.stringify({ error: "error_type and error_message required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const userAgent = req.headers.get("user-agent") || null;

    // Insert error log
    const { data: inserted, error: insertError } = await supabase
      .from("error_logs")
      .insert({
        error_type: String(error_type).slice(0, 200),
        error_message: String(error_message).slice(0, 2000),
        error_stack: error_stack ? String(error_stack).slice(0, 5000) : null,
        context: context || {},
        url: url ? String(url).slice(0, 500) : null,
        user_email: user_email ? String(user_email).slice(0, 200) : null,
        user_id: user_id || null,
        user_agent: userAgent,
        severity: ["info", "warning", "error", "critical"].includes(severity) ? severity : "error",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error log failed:", insertError);
      return new Response(JSON.stringify({ error: insertError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if alert should be sent
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await supabase
      .from("error_logs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", oneHourAgo);

    const isCritical = severity === "critical";
    const aboveThreshold = (count || 0) >= ALERT_THRESHOLD_PER_HOUR;

    let alertSent = false;
    if (isCritical || aboveThreshold) {
      // Check if we already alerted in last hour to avoid spam
      const { count: recentAlerts } = await supabase
        .from("error_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", oneHourAgo)
        .eq("alerted", true);

      if ((recentAlerts || 0) === 0) {
        const resendKey = Deno.env.get("RESEND_API_KEY");
        if (resendKey) {
          try {
            await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${resendKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "EbookStudio Pro <onboarding@resend.dev>",
                to: [ADMIN_EMAIL],
                subject: isCritical
                  ? `🚨 CRITIQUE: ${error_type}`
                  : `⚠️ Pic d'erreurs (${count}/h)`,
                html: `
                  <h2>${isCritical ? "Erreur critique" : "Pic d'erreurs détecté"}</h2>
                  <p><strong>Type:</strong> ${error_type}</p>
                  <p><strong>Message:</strong> ${error_message}</p>
                  <p><strong>URL:</strong> ${url || "N/A"}</p>
                  <p><strong>Utilisateur:</strong> ${user_email || "Anonyme"}</p>
                  <p><strong>Total dernière heure:</strong> ${count}</p>
                  <p><a href="https://www.ebookstudio.fr/admin">Voir dans le dashboard admin</a></p>
                `,
              }),
            });
            // Mark as alerted
            await supabase
              .from("error_logs")
              .update({ alerted: true })
              .eq("id", inserted.id);
            alertSent = true;
          } catch (e) {
            console.error("Email alert failed:", e);
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, id: inserted.id, alert_sent: alertSent }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e: any) {
    console.error("log-client-error fatal:", e);
    return new Response(JSON.stringify({ error: e?.message || "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
