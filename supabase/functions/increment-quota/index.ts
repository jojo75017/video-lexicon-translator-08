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
    const { email, action, count = 1 } = await req.json();
    console.log('Increment quota request:', { email, action, count });

    if (!email || !action) {
      return new Response(
        JSON.stringify({ error: 'Email et action requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Mapper l'action vers le champ de la base de données
    const fieldMap: Record<string, string> = {
      'ebook_plan': 'ebook_plans_generated',
      'chapter': 'chapters_generated',
      'subchapter': 'subchapters_generated',
      'cover': 'covers_generated',
    };

    const field = fieldMap[action];
    if (!field) {
      return new Response(
        JSON.stringify({ error: 'Action invalide' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer l'abonnement actuel
    const { data: subscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .eq('status', 'active')
      .single();

    if (fetchError || !subscriber) {
      console.error('Subscriber not found:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Abonnement non trouvé' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Incrémenter le compteur
    const currentValue = subscriber[field] || 0;
    const newValue = currentValue + count;

    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ 
        [field]: newValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la mise à jour du quota' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Quota incremented:', { email, action, field, newValue });
    return new Response(
      JSON.stringify({ 
        success: true,
        field,
        previousValue: currentValue,
        newValue
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in increment-quota:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
