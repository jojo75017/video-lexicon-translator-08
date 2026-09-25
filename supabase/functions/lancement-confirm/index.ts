// Tunnel de lancement : confirmation d'un paiement d'abonnement.
// La page de remerciement appelle cette fonction avec l'identifiant de session
// Stripe. Rien n'est accordé sans paiement réellement confirmé côté Stripe.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { type StripeEnv, stripeRequest } from "../_shared/stripe.ts";
import { grantV3SubscriptionAccess, sendV3AccessEmail } from "../_shared/v3Access.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });

function admin() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

const PAYPAL_BASE = "https://api-m.paypal.com";

/** Interroge PayPal pour connaître l'état réel de l'abonnement. */
async function fetchPaypalStatus(subscriptionId: string): Promise<string | null> {
  const id = Deno.env.get("PAYPAL_CLIENT_ID");
  const secret = Deno.env.get("PAYPAL_CLIENT_SECRET");
  if (!id || !secret) return null;
  try {
    const auth = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${id}:${secret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!auth.ok) {
      console.error("PayPal OAuth indisponible:", auth.status);
      return null;
    }
    const { access_token } = await auth.json();
    const res = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    if (!res.ok) return null;
    const sub = await res.json();
    return String(sub?.status ?? "") || null;
  } catch (e) {
    console.error("PayPal statut abonnement:", (e as Error).message);
    return null;
  }
}

/** Confirmation d'un abonnement réglé via PayPal (tunnel de lancement). */
async function confirmPaypal(subscriptionId: string): Promise<Response> {
  const supabase = admin();
  const { data: row } = await supabase
    .from("paypal_subscriptions")
    .select("email, plan_id, interval, status")
    .eq("paypal_subscription_id", subscriptionId)
    .maybeSingle();

  if (!row) return json({ status: "pending", email: null });

  const record = row as { email: string; plan_id: string; interval: string; status: string };
  const email = String(record.email ?? "").trim().toLowerCase();
  const wasActive = String(record.status ?? "").toLowerCase() === "active";
  let active = wasActive;

  // Le webhook n'est pas toujours arrivé : on demande l'état à PayPal.
  if (!active) {
    const remote = await fetchPaypalStatus(subscriptionId);
    if (remote === "ACTIVE" || remote === "APPROVED") {
      active = true;
      await supabase
        .from("paypal_subscriptions")
        .update({ status: "active", last_payment_at: new Date().toISOString() })
        .eq("paypal_subscription_id", subscriptionId);
    }
  }

  if (!active || !email) return json({ status: "pending", email: email || null });

  const priceId = `v3_${record.plan_id}_${record.interval === "year" ? "annual" : "monthly"}`;
  const { code, info } = await grantV3SubscriptionAccess(email, priceId);
  const planLabel = info?.label || "Abonnement EbookStudio V3";

  // On n'envoie jamais deux fois l'email d'accès.
  const emailSent = wasActive ? false : await sendV3AccessEmail(email, planLabel, code);

  return json({
    status: "paid",
    email,
    plan: info?.plan ?? null,
    planLabel,
    accessCode: code,
    emailSent,
    alreadyActive: wasActive,
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  try {
    const { sessionId, subscriptionId } = await req.json();

    // Retour PayPal : on réconcilie l'abonnement au lieu d'une session Stripe.
    if (typeof subscriptionId === "string" && subscriptionId.length > 0) {
      if (!/^[A-Za-z0-9-]{5,64}$/.test(subscriptionId)) {
        return json({ error: "Abonnement PayPal invalide" }, 400);
      }
      return await confirmPaypal(subscriptionId);
    }

    if (typeof sessionId !== "string" || !/^cs_(test|live)_[A-Za-z0-9_]+$/.test(sessionId)) {
      return json({ error: "Session de paiement invalide" }, 400);
    }

    const env: StripeEnv = sessionId.startsWith("cs_test_") ? "sandbox" : "live";
    const session = await stripeRequest<any>(env, "GET", `/checkout/sessions/${sessionId}`);

    const paid =
      session?.payment_status === "paid" ||
      session?.payment_status === "no_payment_required" ||
      session?.status === "complete";

    const email = String(
      session?.customer_details?.email || session?.customer_email || session?.metadata?.email || "",
    ).trim().toLowerCase();
    const priceId = String(session?.metadata?.plan || "");

    if (!paid) {
      return json({ status: "pending", email: email || null });
    }
    if (!email) {
      return json({ status: "paid", email: null, warning: "email_absent" });
    }

    const supabase = admin();
    const orderId = session?.metadata?.order_id as string | undefined;

    // Première confirmation ? On ne renvoie jamais deux fois l'email d'accès.
    let alreadyActive = false;
    if (orderId) {
      const { data: order } = await supabase
        .from("v3_installment_orders")
        .select("status")
        .eq("id", orderId)
        .maybeSingle();
      alreadyActive = String((order as { status?: string } | null)?.status || "") === "active";
      if (!alreadyActive) {
        await supabase
          .from("v3_installment_orders")
          .update({
            status: "active",
            installments_paid: 1,
            stripe_subscription_id: session.subscription || null,
            stripe_customer_id: session.customer || null,
            grace_until: null,
          })
          .eq("id", orderId);
      }
    }

    const { code, info } = await grantV3SubscriptionAccess(email, priceId);
    const planLabel = info?.label || "Abonnement EbookStudio V3";

    let emailSent = false;
    if (!alreadyActive) {
      emailSent = await sendV3AccessEmail(email, planLabel, code);
    }

    return json({
      status: "paid",
      email,
      plan: info?.plan ?? null,
      planLabel,
      accessCode: code,
      emailSent,
      alreadyActive,
    });
  } catch (e) {
    console.error("lancement-confirm error:", (e as Error).message);
    return json({ error: "Confirmation impossible pour le moment" }, 500);
  }
});
