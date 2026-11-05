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
    const raw = await req.text();
    if (!(await verifySvix(req, raw))) {
      return new Response(JSON.stringify({ error: "Signature invalide" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const payload = JSON.parse(raw);
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
      const { data: touched } = await supabase
        .from("email_send_log")
        .update(update)
        .eq("provider_message_id", messageId)
        .select("id");
      if (!touched || touched.length === 0) {
        await supabase.from("email_send_log").update(update).eq("message_id", messageId);
      }
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

// Vérifie la signature Resend (format Svix). Sans secret configuré, tout est refusé.
async function verifySvix(req: Request, body: string): Promise<boolean> {
  const secret = Deno.env.get("RESEND_WEBHOOK_SECRET");
  const id = req.headers.get("svix-id"), ts = req.headers.get("svix-timestamp"), sig = req.headers.get("svix-signature");
  if (!secret || !id || !ts || !sig) return false;
  if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return false;
  const keyBytes = Uint8Array.from(atob(secret.replace(/^whsec_/, "")), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${id}.${ts}.${body}`));
  const expected = btoa(String.fromCharCode(...new Uint8Array(mac)));
  return sig.split(" ").some((p) => p.split(",")[1] === expected);
}
