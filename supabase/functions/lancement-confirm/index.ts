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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  try {
    const { sessionId } = await req.json();
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
