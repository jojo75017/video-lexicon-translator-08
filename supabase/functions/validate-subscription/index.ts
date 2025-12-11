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
    const { email, access_code } = await req.json();
    
    // Normalize inputs
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedCode = access_code?.trim().toUpperCase();
    
    console.log('Validating subscription for:', normalizedEmail);
    console.log('Access code provided:', normalizedCode);

    if (!normalizedCode) {
      return new Response(
        JSON.stringify({ valid: false, message: 'Code d\'accès requis' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // First, find subscriber by email only
    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .select('*')
      .ilike('email', normalizedEmail)
      .single();

    if (error || !subscriber) {
      console.log('Subscriber not found for email:', normalizedEmail);
      return new Response(
        JSON.stringify({ valid: false, message: 'Aucun abonnement trouvé pour cet email' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found subscriber, stored code:', subscriber.access_code);
    
    // Compare access codes (case-insensitive)
    const storedCode = subscriber.access_code?.trim().toUpperCase();
    if (storedCode !== normalizedCode) {
      console.log('Code mismatch. Expected:', storedCode, 'Got:', normalizedCode);
      return new Response(
        JSON.stringify({ valid: false, message: 'Code d\'accès incorrect' }),
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
        JSON.stringify({ valid: false, message: 'Abonnement expiré. Veuillez renouveler.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (subscriber.status !== 'active') {
      return new Response(
        JSON.stringify({ valid: false, message: 'Abonnement inactif' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Subscription valid for:', normalizedEmail);
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
