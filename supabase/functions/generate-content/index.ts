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
    const { email, actionType, prompt, numberOfChapters, ebookTitle, authorName, apiKey, type, content } = await req.json();
    console.log('Content generation request:', { email, actionType, type });

    // Handle KDP analytics (uses Lovable AI - no API key needed)
    if (type === 'kdp-analytics') {
      console.log('Processing KDP analytics...');
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Lovable API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lovable AI error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse KDP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Parse JSON from response
      let analysis;
      try {
        const cleanJson = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw:', analysisText);
        return new Response(
          JSON.stringify({ error: 'Erreur de parsing des données' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('KDP analytics completed');
      return new Response(
        JSON.stringify({ content: JSON.stringify(analysis) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle title volume analysis (uses Lovable AI - no API key needed)
    if (type === 'title-volume-analysis') {
      console.log('Processing title volume analysis...');
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Lovable API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lovable AI error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse de volume' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      let analysis;
      try {
        const cleanJson = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw:', analysisText);
        return new Response(
          JSON.stringify({ error: 'Erreur de parsing des données' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Title volume analysis completed');
      return new Response(
        JSON.stringify({ content: JSON.stringify(analysis) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle niche analysis (uses Lovable AI - no API key needed)
    if (type === 'niche-analysis') {
      console.log('Processing niche analysis...');
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Lovable API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lovable AI error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse de niche' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Parse JSON from response
      let analysis;
      try {
        const cleanJson = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw:', analysisText);
        return new Response(
          JSON.stringify({ error: 'Erreur de parsing des données' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Niche analysis completed');
      return new Response(
        JSON.stringify({ content: JSON.stringify(analysis) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle narrative analysis (uses Lovable AI - no API key needed)
    if (type === 'narrative-analysis') {
      console.log('Processing narrative analysis...');
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Lovable API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const narrativePrompt = `Tu es un expert en analyse narrative et cohérence littéraire. Analyse le contenu suivant d'un ebook et détecte toutes les incohérences narratives.

CONTENU À ANALYSER:
${content}

Recherche spécifiquement:
1. PERSONNAGES: Noms qui changent, descriptions contradictoires, personnages qui disparaissent
2. LIEUX: Incohérences géographiques, descriptions contradictoires de lieux
3. CHRONOLOGIE: Événements dans le mauvais ordre, anachronismes, dates contradictoires
4. OBJETS: Objets qui apparaissent/disparaissent sans explication
5. INTRIGUE: Trous dans l'histoire, sous-intrigues abandonnées

Réponds UNIQUEMENT avec un JSON valide (sans markdown) dans ce format exact:
{
  "issues": [
    {
      "type": "character|location|timeline|object|plot",
      "severity": "warning|error",
      "chapter": "nom du chapitre",
      "description": "description du problème",
      "suggestion": "suggestion pour corriger"
    }
  ],
  "characters_mentioned": [
    { "name": "nom", "chapters": ["chapitre1", "chapitre2"] }
  ],
  "locations_mentioned": [
    { "name": "lieu", "chapters": ["chapitre1"] }
  ],
  "timeline_events": [
    { "event": "description de l'événement", "chapter": "chapitre" }
  ],
  "overall_score": 85
}

Le score overall_score doit être entre 0 et 100 (100 = parfaitement cohérent).`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'user', content: narrativePrompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lovable AI error:', errorText);
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse narrative' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Parse JSON from response
      let analysis;
      try {
        // Remove markdown code blocks if present
        const cleanJson = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        analysis = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Raw:', analysisText);
        analysis = {
          issues: [],
          characters_mentioned: [],
          locations_mentioned: [],
          timeline_events: [],
          overall_score: 75
        };
      }

      console.log('Narrative analysis completed');
      return new Response(
        JSON.stringify({ analysis }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Clé API OpenAI requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiKey = apiKey as string;

    // Utilisation directe avec la clé API fournie - pas de vérification d'abonnement
    console.log('Using provided OpenAI API key for generation');

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

    console.log('Content generated successfully');
    return new Response(
      JSON.stringify({ content: generatedContent }),
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
