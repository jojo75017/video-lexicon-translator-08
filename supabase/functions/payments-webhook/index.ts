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
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      default:
        // Ignore subscription.* etc. — we only do one-time payment
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
