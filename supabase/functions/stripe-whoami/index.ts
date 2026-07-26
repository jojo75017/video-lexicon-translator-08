Deno.serve(async () => {
  const cors = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  const key = (Deno.env.get("STRIPE_SECRET_KEY") || "").trim();
  if (!key) return new Response(JSON.stringify({ error: "no key" }), { headers: cors, status: 500 });
  const r = await fetch("https://api.stripe.com/v1/account", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const j = await r.json();
  return new Response(JSON.stringify({
    status: r.status,
    key_prefix: key.slice(0, 8),
    key_mode: key.startsWith("sk_live") ? "live" : key.startsWith("sk_test") ? "test" : key.startsWith("rk_live") ? "restricted_live" : key.startsWith("rk_test") ? "restricted_test" : "unknown",
    account_id: j.id,
    email: j.email,
    business_name: j.business_profile?.name || j.settings?.dashboard?.display_name,
    country: j.country,
    default_currency: j.default_currency,
    charges_enabled: j.charges_enabled,
    payouts_enabled: j.payouts_enabled,
    error: j.error,
  }, null, 2), { headers: cors });
});
