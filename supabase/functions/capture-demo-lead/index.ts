import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Email invalide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailLower = email.trim().toLowerCase();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Only insert if the email is not already a subscriber (avoid downgrading existing plans)
    const { data: existing } = await supabaseAdmin
      .from('subscribers')
      .select('id')
      .eq('email', emailLower)
      .maybeSingle();

    if (!existing) {
      const { error: insertError } = await supabaseAdmin
        .from('subscribers')
        .insert({ email: emailLower, plan_type: 'demo', status: 'demo_lead' });
      if (insertError) {
        console.error('Error inserting demo lead:', insertError);
        return new Response(JSON.stringify({ error: 'Erreur lors de l\'enregistrement' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Fire the welcome email (best effort)
    try {
      await supabaseAdmin.functions.invoke('send-welcome-email', { body: { email: emailLower } });
    } catch (e) {
      console.error('send-welcome-email failed:', e);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('capture-demo-lead error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
