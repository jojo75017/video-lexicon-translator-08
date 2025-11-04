import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();
    console.log('Validating subscription for:', email);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !subscriber) {
      console.log('Subscriber not found');
      return new Response(
        JSON.stringify({ valid: false, message: 'Abonnement non trouvé' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier si expiré
    if (subscriber.expires_at && new Date(subscriber.expires_at) < new Date()) {
      await supabase
        .from('subscribers')
        .update({ status: 'expired' })
        .eq('id', subscriber.id);

      return new Response(
        JSON.stringify({ valid: false, message: 'Abonnement expiré' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (subscriber.status !== 'active') {
      return new Response(
        JSON.stringify({ valid: false, message: 'Abonnement inactif' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Subscription valid');
    return new Response(
      JSON.stringify({ 
        valid: true, 
        subscriber: {
          email: subscriber.email,
          plan_type: subscriber.plan_type,
          expires_at: subscriber.expires_at,
          chapters_generated: subscriber.chapters_generated,
          ebook_plans_generated: subscriber.ebook_plans_generated,
          subchapters_generated: subscriber.subchapters_generated,
          covers_generated: subscriber.covers_generated
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-subscription:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});