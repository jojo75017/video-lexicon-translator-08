import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.78.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'EBK-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Non authentifié' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is admin
    const { data: roles, error: rolesError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (rolesError || !roles || roles.length === 0) {
      console.error('Admin verification failed:', rolesError);
      return new Response(
        JSON.stringify({ error: 'Accès refusé - droits administrateur requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    console.log('Admin verified:', user.email);

    // Parse request body
    const { email, plan_type, expires_at } = await req.json();

    if (!email || !plan_type) {
      return new Response(
        JSON.stringify({ error: 'Email et plan_type requis' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Format d\'email invalide' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Use service role for database operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if subscriber exists
    const { data: existingSubscriber, error: checkError } = await supabaseAdmin
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking subscriber:', checkError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la vérification' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let accessCode: string;

    if (existingSubscriber) {
      // Update existing subscriber
      const { error: updateError } = await supabaseAdmin
        .from('subscribers')
        .update({
          status: 'active',
          plan_type: plan_type,
          expires_at: expires_at || null,
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        console.error('Error updating subscriber:', updateError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la mise à jour' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      accessCode = existingSubscriber.access_code;
      console.log('Subscriber updated:', email);
    } else {
      // Create new subscriber
      accessCode = generateAccessCode();

      const { error: insertError } = await supabaseAdmin
        .from('subscribers')
        .insert({
          email,
          access_code: accessCode,
          plan_type,
          status: 'active',
          expires_at: expires_at || null
        });

      if (insertError) {
        console.error('Error creating subscriber:', insertError);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la création' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('New subscriber created:', email);
    }

    return new Response(
      JSON.stringify({
        success: true,
        accessCode,
        message: existingSubscriber 
          ? 'Abonnement mis à jour avec succès' 
          : 'Nouvel abonné créé avec succès'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Add subscriber error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});