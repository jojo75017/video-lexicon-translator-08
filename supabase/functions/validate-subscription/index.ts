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
    console.log('Access code provided:', normalizedCode ? 'yes' : 'no');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Sans code d'accès (cache local incomplet), on accepte une session
    // authentifiée dont l'email correspond : le code est alors renvoyé au client.
    let sessionVerified = false;
    if (!normalizedCode) {
      const authHeader = req.headers.get('Authorization') ?? '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
      if (token) {
        const { data: userData } = await supabase.auth.getUser(token);
        const tokenEmail = userData?.user?.email?.trim().toLowerCase();
        if (tokenEmail && normalizedEmail && tokenEmail === normalizedEmail) {
          sessionVerified = true;
        }
      }
      if (!sessionVerified) {
        return new Response(
          JSON.stringify({ valid: false, message: 'Code d\'accès requis' }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }


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

    // Vérifier si essai expiré
    if (subscriber.status === 'trialing' && subscriber.trial_ends_at && new Date(subscriber.trial_ends_at) < new Date()) {
      await supabase
        .from('subscribers')
        .update({ status: 'trial_expired' })
        .eq('id', subscriber.id);

      return new Response(
        JSON.stringify({ valid: false, message: 'Votre essai gratuit de 7 jours est terminé. Consultez l’offre actuelle pour continuer à créer.' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier si expiré (plan payant)
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

    if (subscriber.status !== 'active' && subscriber.status !== 'trialing') {
      return new Response(
        JSON.stringify({ valid: false, message: subscriber.status === 'trial_expired' ? 'Essai terminé. Consultez l’offre actuelle pour continuer.' : 'Abonnement inactif' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Subscription valid for:', normalizedEmail);
    return new Response(
      JSON.stringify({ 
        valid: true, 
        subscriber: {
          email: subscriber.email,
          access_code: subscriber.access_code,
          plan_type: subscriber.plan_type,
          plan_tier: subscriber.plan_tier,
          status: subscriber.status,
          license_type: subscriber.license_type,
          expires_at: subscriber.expires_at,
          trial_ends_at: subscriber.trial_ends_at,
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
