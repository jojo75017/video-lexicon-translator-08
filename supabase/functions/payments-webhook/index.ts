// Stripe webhook handler for Lovable Payments.
// Marks funnel_orders as 'paid' on checkout.session.completed.
// The DB trigger handle_funnel_order_paid creates the affiliate commission automatically.
// Sends an access email via Resend.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook, stripeRequest } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

async function sendAccessEmail(email: string, firstName: string | null) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) return;
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
    <h1 style="color:#008296">🎉 Paiement reçu — Bienvenue !</h1>
    <p>${greeting}</p>
    <p>Votre paiement de <strong>67 €</strong> a bien été confirmé.</p>
    <p><strong>Votre accès EbookStudio est maintenant actif pour 12 mois.</strong></p>
    <p style="text-align:center;margin:24px 0">
      <a href="https://www.ebookstudio.fr/auth"
         style="display:inline-block;background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">
        Accéder à mon espace
      </a>
    </p>
    <p>Identifiants : utilisez l'email <strong>${email}</strong> pour vous connecter (création de mot de passe au 1er accès).</p>
    <p>L'équipe EbookStudio</p>
  </div>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "EbookStudio <contact@ebookstudio.fr>",
        to: [email],
        subject: "🎉 Paiement reçu — Votre accès EbookStudio",
        html,
      }),
    });
  } catch (e) {
    console.error("Access email failed:", e);
  }
}

async function handleCheckoutCompleted(session: any) {
  const orderId = session.metadata?.order_id;
  if (!orderId) {
    console.warn("checkout.session.completed without order_id metadata");
    return;
  }
  const supabase = getSupabase();
  const { data: order, error } = await supabase
    .from("funnel_orders")
    .update({ status: "paid", paid_at: new Date().toISOString() })
    .eq("id", orderId)
    .select("email, first_name, status")
    .single();
  if (error) {
    console.error("Order update failed:", error);
    return;
  }
  console.log("Order paid:", orderId);

  // Add subscriber row (12 months access)
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  await supabase.from("subscribers").upsert({
    email: order.email,
    status: "active",
    plan_type: "annual",
    plan_tier: "standard",
    expires_at: expiresAt.toISOString(),
  }, { onConflict: "email" });

  await sendAccessEmail(order.email, order.first_name);
}

// ===== V3 Pack Tout Complet — paiement unique ou échéancier =====

// Octroie l'accès à vie EbookStudio (statut actif, pas d'expiration).
async function grantV3Lifetime(email: string) {
  const supabase = getSupabase();
  await supabase.from("subscribers").upsert({
    email,
    status: "active",
    plan_type: "lifetime",
    plan_tier: "pro",
    expires_at: null,
  }, { onConflict: "email" });
}

// Bloque l'accès (échéances en échec après la période de grâce).
async function suspendAccess(email: string) {
  const supabase = getSupabase();
  await supabase.from("subscribers")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("email", email);
}

// Email de confirmation pour l'offre "accès à vie" (tunnel /commander).
async function sendLifetimeAccessEmail(email: string, planLabel: string) {
  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) return;
  const html = `
  <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#232F3E;background:#FAFAFA;padding:24px;border-radius:12px">
    <h1 style="color:#008296">🎉 Bienvenue dans EbookStudio Pro</h1>
    <p>Bonjour,</p>
    <p>Votre paiement est confirmé (<strong>${planLabel}</strong>).</p>
    <p><strong>Votre accès à vie est actif — aucun abonnement, aucune date d'expiration.</strong></p>
    <p style="text-align:center;margin:24px 0">
      <a href="https://www.ebookstudio.fr/auth"
         style="display:inline-block;background:#FF9E2D;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold">
        Accéder à mon espace
      </a>
    </p>
    <p>Connectez-vous avec l'email <strong>${email}</strong> (création du mot de passe au 1er accès).</p>
    <p>Première étape conseillée : créer votre premier livre depuis le tableau de bord.</p>
    <p>L'équipe EbookStudio</p>
  </div>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "EbookStudio <contact@ebookstudio.fr>",
        to: [email],
        subject: "🎉 Votre accès à vie EbookStudio Pro est actif",
        html,
      }),
    });
  } catch (e) {
    console.error("Lifetime access email failed:", e);
  }
}

async function handleV3CheckoutCompleted(session: any) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return;
  const supabase = getSupabase();
  const installmentsTotal = Number(session.metadata?.installments_total || "1");
  const email = (session.metadata?.email || session.customer_email || "").toLowerCase();
  const subscriptionId = session.subscription || null;
  const plan = String(session.metadata?.plan || "");
  const isV2Lifetime = plan.startsWith("v2_");

  if (installmentsTotal <= 1) {
    // Paiement unique : accès à vie immédiat, commande terminée.
    await supabase.from("v3_installment_orders").update({
      status: "completed",
      installments_paid: 1,
      completed_at: new Date().toISOString(),
    }).eq("id", orderId);
    if (email) await grantV3Lifetime(email);
  } else {
    // Échéancier : 1re échéance encaissée, accès ouvert dès maintenant.
    await supabase.from("v3_installment_orders").update({
      status: "active",
      installments_paid: 1,
      stripe_subscription_id: subscriptionId,
      grace_until: null,
    }).eq("id", orderId);
    if (email) await grantV3Lifetime(email);
  }

  if (email && isV2Lifetime) {
    const label = installmentsTotal <= 1
      ? "EbookStudio Pro — accès à vie, 59 € payés en une fois"
      : `EbookStudio Pro — accès à vie, ${installmentsTotal} échéances`;
    await sendLifetimeAccessEmail(email, label);
  }
}


async function handleV3InvoicePaid(invoice: any, env: StripeEnv) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  const supabase = getSupabase();
  const { data: order } = await supabase
    .from("v3_installment_orders")
    .select("id, email, installments_total, installments_paid, status")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();
  if (!order) return;

  // La 1re échéance est déjà comptée au checkout ; on ignore la facture initiale.
  if (invoice.billing_reason === "subscription_create") return;

  const paid = (order.installments_paid as number) + 1;
  const total = order.installments_total as number;

  if (paid >= total) {
    // Toutes les échéances réglées → annuler l'abonnement + accès à vie définitif.
    try {
      await stripeRequest(env, "DELETE", `/subscriptions/${subscriptionId}`);
    } catch (e) {
      console.error("Cancel subscription failed:", e);
    }
    await supabase.from("v3_installment_orders").update({
      status: "completed",
      installments_paid: total,
      grace_until: null,
      completed_at: new Date().toISOString(),
    }).eq("id", order.id);
    if (order.email) await grantV3Lifetime(order.email as string);
  } else {
    await supabase.from("v3_installment_orders").update({
      status: "active",
      installments_paid: paid,
      grace_until: null,
    }).eq("id", order.id);
  }
}

async function handleV3InvoiceFailed(invoice: any) {
  const subscriptionId = invoice.subscription;
  if (!subscriptionId) return;
  const supabase = getSupabase();
  const graceUntil = new Date();
  graceUntil.setDate(graceUntil.getDate() + 3);
  await supabase.from("v3_installment_orders").update({
    status: "past_due",
    grace_until: graceUntil.toISOString(),
  }).eq("stripe_subscription_id", subscriptionId);
}

async function handleV3SubscriptionDeleted(subscription: any) {
  const supabase = getSupabase();
  const { data: order } = await supabase
    .from("v3_installment_orders")
    .select("id, email, status")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();
  if (!order) return;
  // Si la commande n'est pas déjà terminée, l'échéancier a échoué → coupure d'accès.
  if (order.status !== "completed") {
    await supabase.from("v3_installment_orders").update({ status: "cancelled" }).eq("id", order.id);
    if (order.email) await suspendAccess(order.email as string);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook with invalid env:", rawEnv);
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    console.log("Webhook event:", event.type, event.id);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const plan = session.metadata?.plan;
        if (plan === "bookperfect_launch_once") {
          const email = (session.customer_email || session.customer_details?.email || "").toLowerCase();
          if (email) {
            const amount = typeof session.amount_total === "number" ? session.amount_total / 100 : null;
            const { error } = await getSupabase().from("module_entitlements").insert({
              email,
              module: "bookperfect",
              status: "active",
              amount,
              currency: session.currency || "eur",
              environment: env,
              stripe_session_id: session.id,
            });
            if (error) console.error("BookPerfect entitlement insert failed:", error);
            else console.log("Granted BookPerfect entitlement to:", email);
          }
          break;
        }
        if (session.metadata?.kind === "v3_full_pack") {
          await handleV3CheckoutCompleted(session);
        } else {
          await handleCheckoutCompleted(session);
        }
        break;
      }
      case "invoice.paid":
      case "invoice.payment_succeeded":
        await handleV3InvoicePaid(event.data.object, env);
        break;
      case "invoice.payment_failed":
        await handleV3InvoiceFailed(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleV3SubscriptionDeleted(event.data.object);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Webhook error:", e);
    return new Response("Webhook error", { status: 400 });
  }
});
