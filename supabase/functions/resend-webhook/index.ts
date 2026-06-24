import { createClient } from "https://esm.sh/@supabase/supabase-js@2.78.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
};

// Webhook Resend : reçoit les événements de livraison et met à jour email_send_log.
// À configurer dans Resend (Webhooks) en pointant vers l'URL de cette fonction.
// Événements suivis : email.sent, email.delivered, email.delivery_delayed,
// email.bounced, email.complained, email.opened, email.clicked.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const type: string = payload?.type || "";
    const data = payload?.data || {};
    const messageId: string | undefined = data?.email_id || data?.id;
    const recipient: string | undefined = Array.isArray(data?.to) ? data.to[0] : data?.to;

    if (!type || (!messageId && !recipient)) {
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event = type.replace(/^email\./, ""); // ex: "delivered", "bounced"
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const status =
      event === "delivered" ? "delivered"
      : (event === "bounced" || event === "complained") ? "error"
      : undefined;

    const update: Record<string, unknown> = { last_event: event };
    if (status) update.status = status;

    // Met à jour la ligne d'envoi correspondante (par message_id en priorité)
    if (messageId) {
      await supabase.from("email_send_log").update(update).eq("message_id", messageId);
    } else if (recipient) {
      await supabase.from("email_send_log").update(update).eq("recipient_email", recipient);
    }

    return new Response(JSON.stringify({ ok: true, event }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("resend-webhook error:", err);
    return new Response(JSON.stringify({ ok: false }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
