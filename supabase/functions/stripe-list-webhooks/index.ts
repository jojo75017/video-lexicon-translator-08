import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) {
    return new Response(JSON.stringify({ error: "no key" }), {
      status: 500,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
  const r = await fetch("https://api.stripe.com/v1/webhook_endpoints?limit=20", {
    headers: { Authorization: `Bearer ${key}` },
  });
  const j = await r.json();
  const list = (j.data ?? []).map((w: any) => ({
    id: w.id,
    url: w.url,
    status: w.status,
    events_count: w.enabled_events?.length,
    events: w.enabled_events,
    api_version: w.api_version,
    livemode: w.livemode,
  }));
  return new Response(JSON.stringify({ count: list.length, webhooks: list, error: j.error }, null, 2), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
