import { requireAdmin } from "../_shared/authGuard.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const guard = await requireAdmin(req);
  if (guard instanceof Response) return guard;
  const key = (Deno.env.get("STRIPE_SECRET_KEY") || "").trim();
  if (!key) return new Response(JSON.stringify({ error: "no key" }), { headers: cors, status: 500 });
  const r = await fetch("https://api.stripe.com/v1/account", { headers: { Authorization: `Bearer ${key}` } });
  const j = await r.json();
  return new Response(JSON.stringify({
    status: r.status,
    key_mode: key.startsWith("sk_live") ? "live" : key.startsWith("sk_test") ? "test" : "other",
    account_id: j.id,
    charges_enabled: j.charges_enabled,
    payouts_enabled: j.payouts_enabled,
  }), { headers: cors });
});
