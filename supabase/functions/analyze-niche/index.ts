import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { niche } = await req.json();

    if (!niche || niche.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Niche requise' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const prompt = `Tu es un expert en édition de livres et en marketing Amazon KDP. Analyse la niche suivante pour un ebook : "${niche.trim()}"

Réponds en JSON avec exactement cette structure :
{
  "forces": [
    { "text": "description de la force 1" },
    { "text": "description de la force 2" },
    { "text": "description de la force 3" },
    { "text": "description de la force 4" }
  ],
  "pointsAttention": [
    { "text": "description du point d'attention 1" },
    { "text": "description du point d'attention 2" },
    { "text": "description du point d'attention 3" }
  ],
  "demarquer": [
    { "text": "conseil détaillé pour se démarquer 1" },
    { "text": "conseil détaillé pour se démarquer 2" },
    { "text": "conseil détaillé pour se démarquer 3" }
  ]
}

Sois précis et concret dans chaque point. Parle directement au lecteur avec "tu/ton". Chaque texte doit faire 1-3 phrases.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Tu es un expert en édition de livres numériques et marketing KDP Amazon. Réponds uniquement en JSON valide.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`AI API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse AI response as JSON');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-niche:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
