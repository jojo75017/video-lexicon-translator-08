import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { email, actionType, prompt, numberOfChapters, ebookTitle, authorName } = await req.json();
    console.log('Content generation request:', { email, actionType });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier l'abonnement
    const { data: subscriber, error: subError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('email', email)
      .single();

    if (subError || !subscriber) {
      console.error('Subscriber not found:', subError);
      return new Response(
        JSON.stringify({ error: 'Abonnement non trouvé. Veuillez contacter le support.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier le statut
    if (subscriber.status !== 'active') {
      return new Response(
        JSON.stringify({ error: 'Votre abonnement a expiré. Veuillez renouveler.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier l'expiration
    if (subscriber.expires_at && new Date(subscriber.expires_at) < new Date()) {
      await supabase
        .from('subscribers')
        .update({ status: 'expired' })
        .eq('id', subscriber.id);

      return new Response(
        JSON.stringify({ error: 'Votre abonnement a expiré. Veuillez renouveler.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Limites par plan
    const limits: Record<string, Record<string, number>> = {
      starter: { chapters_generated: 50, ebook_plans_generated: 5, subchapters_generated: 100, covers_generated: 10 },
      pro: { chapters_generated: 200, ebook_plans_generated: 20, subchapters_generated: 500, covers_generated: 50 },
      agency: { chapters_generated: 999999, ebook_plans_generated: 999999, subchapters_generated: 999999, covers_generated: 999999 }
    };

    const planLimits = limits[subscriber.plan_type];
    const currentUsage = subscriber[actionType as keyof typeof subscriber] as number;

    if (currentUsage >= planLimits[actionType]) {
      return new Response(
        JSON.stringify({ 
          error: `Limite atteinte pour votre plan ${subscriber.plan_type}. Passez au plan supérieur pour continuer.` 
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Appeler OpenAI
    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Vous êtes un expert en création de contenu pour ebooks. Répondez en français avec un contenu de haute qualité.' 
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la génération du contenu' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Incrémenter le compteur
    const updateField: Record<string, number> = {};
    updateField[actionType] = currentUsage + 1;

    await supabase
      .from('subscribers')
      .update(updateField)
      .eq('id', subscriber.id);

    console.log('Content generated successfully');
    return new Response(
      JSON.stringify({ content: generatedContent, usage: currentUsage + 1, limit: planLimits[actionType] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});