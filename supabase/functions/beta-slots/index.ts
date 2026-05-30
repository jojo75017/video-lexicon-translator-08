import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TOTAL_SLOTS = 5;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { count, error } = await admin
      .from('beta_promo_codes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'used');

    if (error) throw error;

    const used = count ?? 0;
    const remaining = Math.max(0, TOTAL_SLOTS - used);

    return new Response(
      JSON.stringify({ total: TOTAL_SLOTS, used, remaining }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('beta-slots error:', error);
    return new Response(
      JSON.stringify({ total: TOTAL_SLOTS, used: 0, remaining: TOTAL_SLOTS }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  }
});
