const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function headers(apiKey: string) {
  if (apiKey.startsWith('lovc_')) {
    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableKey) throw new Error('LOVABLE_API_KEY manquant pour le mode gateway Firecrawl.');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${lovableKey}`,
      'X-Connection-Api-Key': apiKey,
    };
  }
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
}

function baseUrl(apiKey: string) {
  return apiKey.startsWith('lovc_')
    ? 'https://connector-gateway.lovable.dev/firecrawl'
    : 'https://api.firecrawl.dev';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ configured: false, error: 'Firecrawl non configuré.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const h = headers(apiKey);
    const base = baseUrl(apiKey);

    // Try v2 then v1 for credit usage
    let creditData: any = null;
    let creditStatus = 0;
    for (const path of ['/v2/team/credit-usage', '/v1/team/credit-usage']) {
      const r = await fetch(`${base}${path}`, { headers: h });
      creditStatus = r.status;
      if (r.ok) {
        creditData = await r.json();
        break;
      }
    }

    // Optional: monthly limit
    let limitData: any = null;
    for (const path of ['/v2/team/credit-usage/limit', '/v1/team/credit-usage/limit']) {
      const r = await fetch(`${base}${path}`, { headers: h });
      if (r.ok) {
        limitData = await r.json();
        break;
      }
    }

    if (!creditData) {
      return new Response(
        JSON.stringify({ configured: true, error: `Firecrawl a répondu ${creditStatus}` }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const d = creditData?.data ?? creditData;
    const l = limitData?.data ?? limitData ?? {};

    const remaining = d?.remaining_credits ?? d?.remainingCredits ?? d?.credits_remaining ?? null;
    const planCredits = d?.plan_credits ?? d?.planCredits ?? l?.plan_credits ?? l?.planCredits ?? l?.credit_limit ?? null;
    const billingPeriodStart = d?.billing_period_start ?? d?.billingPeriodStart ?? l?.billing_period_start ?? l?.billingPeriodStart ?? null;
    const billingPeriodEnd = d?.billing_period_end ?? d?.billingPeriodEnd ?? l?.billing_period_end ?? l?.billingPeriodEnd ?? null;
    const used = planCredits != null && remaining != null ? Math.max(0, planCredits - remaining) : null;
    const pct = planCredits && used != null ? Math.min(100, Math.round((used / planCredits) * 100)) : null;

    return new Response(
      JSON.stringify({
        configured: true,
        mode: apiKey.startsWith('lovc_') ? 'gateway' : 'direct',
        remaining,
        planCredits,
        used,
        pct,
        billingPeriodStart,
        billingPeriodEnd,
        raw: { credit: d, limit: l },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ configured: true, error: (e as Error).message }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
