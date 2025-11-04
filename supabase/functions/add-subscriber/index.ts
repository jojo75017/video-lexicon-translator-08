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
    const { email, plan_type = 'starter', expires_at } = await req.json();
    console.log('Adding subscriber:', { email, plan_type });

    if (!email || !email.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Email invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Générer un code d'accès unique
    const generateAccessCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let code = 'EBK-';
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const accessCode = generateAccessCode();

    // Vérifier si l'abonné existe déjà
    const { data: existing } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (existing) {
      // Mettre à jour l'abonné existant (ne pas changer le code d'accès)
      const { data, error } = await supabase
        .from('subscribers')
        .update({
          status: 'active',
          plan_type,
          expires_at: expires_at || null,
        })
        .eq('email', email)
        .select()
        .single();

      if (error) {
        console.error('Update error:', error);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la mise à jour' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Subscriber updated');
      return new Response(
        JSON.stringify({ 
          success: true, 
          subscriber: data, 
          message: 'Abonnement réactivé',
          access_code: data.access_code 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Créer un nouvel abonné avec code d'accès
    const { data, error } = await supabase
      .from('subscribers')
      .insert({
        email,
        plan_type,
        status: 'active',
        expires_at: expires_at || null,
        access_code: accessCode,
      })
      .select()
      .single();

    if (error) {
      console.error('Insert error:', error);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la création' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Subscriber created with access code:', accessCode);
    return new Response(
      JSON.stringify({ 
        success: true, 
        subscriber: data, 
        message: 'Abonnement créé',
        access_code: accessCode 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in add-subscriber:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});