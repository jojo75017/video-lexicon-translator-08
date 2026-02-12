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
    const { title, subtitle, authorName, genre, style } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: 'Titre requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Tu es un directeur artistique spécialisé dans les couvertures de livres Amazon KDP. 
Tu génères des prompts de couverture ULTRA-DÉTAILLÉS et CINÉMATOGRAPHIQUES pour créer des couvertures photoréalistes exceptionnelles.

Tu dois retourner un JSON strict avec cette structure :
{
  "prompt": "Le prompt détaillé en anglais pour la génération d'image (min 200 mots, très descriptif, style photographique professionnel)",
  "promptFr": "Résumé en français du concept visuel (2-3 phrases)",
  "conceptTitle": "Titre court du concept artistique",
  "moodboard": ["mot-clé ambiance 1", "mot-clé ambiance 2", "mot-clé ambiance 3", "mot-clé ambiance 4", "mot-clé ambiance 5"],
  "colorPalette": ["#couleur1", "#couleur2", "#couleur3", "#couleur4"],
  "photographyStyle": "Description du style photo (ex: portrait cinématographique, paysage épique, macro artistique)",
  "lightingSetup": "Description de l'éclairage recommandé"
}

RÈGLES CRITIQUES :
- Le prompt DOIT être en ANGLAIS pour de meilleurs résultats avec les modèles d'image
- Le prompt doit spécifier un objectif photo (Canon EOS R5, 85mm f/1.4, etc.)
- Mentionner le type d'éclairage précis (Rembrandt lighting, golden hour, etc.)
- Inclure des textures réalistes et des matériaux tangibles
- Décrire la composition avec le placement du titre et du nom d'auteur
- Le prompt doit créer une couverture BOOK COVER avec le titre "${title}" visible
- Interdire tout rendu cartoon, illustration ou digital art
- Penser PHOTOGRAPHIE ÉDITORIALE haut de gamme (Vogue, National Geographic)`;

    const userMessage = `Crée un prompt de couverture grandiose pour ce livre :

TITRE : "${title}"
${subtitle ? `SOUS-TITRE : "${subtitle}"` : ''}
AUTEUR : "${authorName || 'Auteur'}"
GENRE : ${genre || 'non-fiction'}
STYLE SOUHAITÉ : ${style || 'professionnel et moderne'}

Le prompt doit être ÉPOUSTOUFLANT et produire une couverture digne des plus grands éditeurs (Gallimard, Penguin Random House, HarperCollins).`;

    console.log('Generating cover prompt for:', title);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.9,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    // Parse JSON from response
    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.error('JSON parse error, creating fallback:', parseError);
      result = {
        prompt: content,
        promptFr: 'Concept artistique généré par IA',
        conceptTitle: 'Vision Artistique',
        moodboard: ['professionnel', 'élégant', 'moderne', 'impactant', 'raffiné'],
        colorPalette: ['#1a1a2e', '#e94560', '#f5f5dc', '#0f3460'],
        photographyStyle: 'Portrait éditorial cinématographique',
        lightingSetup: 'Éclairage Rembrandt avec rim light'
      };
    }

    console.log('Cover prompt generated successfully');

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-cover-prompt:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
