// Ouvre l'espace Stripe où l'abonné mensuel gère / arrête son abonnement.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { stripeRequest, type StripeEnv } from "../_shared/stripe.ts";

const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);
  try {
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "");
    const { data: { user } } = await admin.auth.getUser(token);
    if (!user?.email) return json({ error: "Non authentifié" }, 401);

    let returnUrl: string | undefined;
    try {
      const body = await req.json();
      if (typeof body?.returnUrl === "string" && /^https:\/\/((www\.)?ebookstudio\.fr|[a-z0-9-]+\.lovable\.app)(\/|$)/.test(body.returnUrl) && body.returnUrl.length < 500) returnUrl = body.returnUrl;
    } catch { /* corps vide */ }

    const { data: order } = await admin.from("v3_installment_orders")
      .select("stripe_customer_id, environment")
      .ilike("email", user.email)
      .like("plan", "v3m_%")
      .not("stripe_customer_id", "is", null)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (!order?.stripe_customer_id) return json({ error: "Aucun abonnement mensuel trouvé" }, 404);

    const env: StripeEnv = order.environment === "live" ? "live" : "sandbox";
    const portal = await stripeRequest<{ url: string }>(env, "POST", "/billing_portal/sessions", {
      customer: order.stripe_customer_id,
      ...(returnUrl ? { return_url: returnUrl } : {}),
    });
    return json({ url: portal.url });
  } catch (e) {
    console.error("portal error", e);
    return json({ error: "Impossible d'ouvrir la gestion de l'abonnement pour le moment." }, 500);
  }
});
