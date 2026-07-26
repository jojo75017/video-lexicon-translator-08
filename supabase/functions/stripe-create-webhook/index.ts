import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const STRIPE_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
const WEBHOOK_URL = 'https://xvdgazrewsuaqtalqxue.supabase.co/functions/v1/stripe-webhook';

const EVENTS = [
  'checkout.session.completed',
  'checkout.session.async_payment_succeeded',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'charge.refunded',
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Check existing endpoints first
    const listRes = await fetch('https://api.stripe.com/v1/webhook_endpoints?limit=100', {
      headers: { Authorization: `Bearer ${STRIPE_KEY}` },
    });
    const list = await listRes.json();
    if (!listRes.ok) throw new Error(list.error?.message || 'list failed');

    const existing = (list.data || []).find((w: any) => w.url === WEBHOOK_URL);
    if (existing) {
      return new Response(JSON.stringify({
        ok: true,
        already_exists: true,
        endpoint_id: existing.id,
        url: existing.url,
        status: existing.status,
        events: existing.enabled_events,
        secret_available: false,
        message: "L'endpoint existe déjà. Le signing secret n'est visible qu'à la création — recréez-le depuis Stripe si besoin.",
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Create new endpoint
    const params = new URLSearchParams();
    params.set('url', WEBHOOK_URL);
    params.set('description', 'Lovable ebookstudio auto-created');
    EVENTS.forEach((e, i) => params.append(`enabled_events[${i}]`, e));

    const createRes = await fetch('https://api.stripe.com/v1/webhook_endpoints', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const created = await createRes.json();
    if (!createRes.ok) throw new Error(created.error?.message || 'create failed');

    return new Response(JSON.stringify({
      ok: true,
      created: true,
      endpoint_id: created.id,
      url: created.url,
      status: created.status,
      events: created.enabled_events,
      signing_secret: created.secret, // whsec_...
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
