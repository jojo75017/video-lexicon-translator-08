// PayPal Webhook — updates paypal_subscriptions on activation, payment, cancel.
// Uses PayPal's webhook verification endpoint (server-side verification).

import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, paypal-transmission-id, paypal-transmission-time, paypal-transmission-sig, paypal-cert-url, paypal-auth-algo",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PAYPAL_BASE = "https://api-m.paypal.com";

async function getAccessToken(): Promise<string> {
  const id = Deno.env.get("PAYPAL_CLIENT_ID")!;
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET")!;
  const auth = btoa(`${id}:${secret}`);
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const body = await res.json();
  return body.access_token;
}

async function verifyWebhook(req: Request, rawBody: string, token: string): Promise<boolean> {
  const webhookId = Deno.env.get("PAYPAL_WEBHOOK_ID");
  if (!webhookId) {
    console.warn("PAYPAL_WEBHOOK_ID not set — skipping signature verification");
    return true; // allow through until user configures the webhook ID
  }
  const res = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: req.headers.get("paypal-auth-algo"),
      cert_url: req.headers.get("paypal-cert-url"),
      transmission_id: req.headers.get("paypal-transmission-id"),
      transmission_sig: req.headers.get("paypal-transmission-sig"),
      transmission_time: req.headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
  });
  const out = await res.json();
  return out.verification_status === "SUCCESS";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawBody = await req.text();
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const token = await getAccessToken();
    const verified = await verifyWebhook(req, rawBody, token);
    if (!verified) {
      console.error("PayPal webhook signature invalid");
      return new Response("Invalid signature", { status: 401 });
    }

    const event = JSON.parse(rawBody);
    const type = event.event_type as string;
    const resource = event.resource || {};

    console.log("PayPal webhook", type, resource.id);

    switch (type) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "BILLING.SUBSCRIPTION.CREATED": {
        await supabase
          .from("paypal_subscriptions")
          .update({
            status: type === "BILLING.SUBSCRIPTION.ACTIVATED" ? "active" : "pending",
            paypal_payer_id: resource.subscriber?.payer_id ?? null,
            next_billing_at: resource.billing_info?.next_billing_time ?? null,
            updated_at: new Date().toISOString(),
          })
          .eq("paypal_subscription_id", resource.id);
        break;
      }
      case "PAYMENT.SALE.COMPLETED":
      case "PAYMENT.CAPTURE.COMPLETED": {
        const subId = resource.billing_agreement_id || resource.custom_id || null;
        if (subId) {
          await supabase
            .from("paypal_subscriptions")
            .update({
              status: "active",
              last_payment_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("paypal_subscription_id", subId);
        }
        break;
      }
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.SUSPENDED": {
        await supabase
          .from("paypal_subscriptions")
          .update({
            status: type.includes("CANCELLED") ? "cancelled" :
                    type.includes("EXPIRED")   ? "expired"   : "suspended",
            cancelled_at: type.includes("CANCELLED") ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
          })
          .eq("paypal_subscription_id", resource.id);
        break;
      }
      case "BILLING.SUBSCRIPTION.PAYMENT.FAILED": {
        await supabase
          .from("paypal_subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("paypal_subscription_id", resource.id);
        break;
      }
      default:
        console.log("Unhandled PayPal event", type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("paypal-webhook error", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
