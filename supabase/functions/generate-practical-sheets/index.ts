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
    const { theme, customTopics, numberOfSheets, tone, visualStyle } = await req.json();

    if (!theme) {
      return new Response(
        JSON.stringify({ error: 'Le thème est requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const count = Math.min(Math.max(parseInt(numberOfSheets) || 5, 1), 10);
    
    // Build tone description
    const toneDescriptions: Record<string, string> = {
      'doux': 'Ton doux, humain, rassurant. Phrases courtes, respirantes. Aucune injonction, aucune pression. Langage simple, accessible.',
      'motivant': 'Ton motivant et énergique. Phrases dynamiques et inspirantes. Encouragements positifs. Langage accessible mais stimulant.',
      'expert': 'Ton expert et pédagogique. Explications claires et structurées. Vocabulaire précis mais accessible. Approche professionnelle.',
      'amical': 'Ton amical et chaleureux. Comme un ami bienveillant. Langage courant et naturel. Approche décontractée mais respectueuse.',
    };

    const toneDesc = toneDescriptions[tone] || toneDescriptions['doux'];

    // Build topics section
    const topicsSection = customTopics 
      ? `\nSujets IMPOSÉS pour les fiches (respecter cet ordre) :\n${customTopics}`
      : `\nGénère ${count} sujets logiques et progressifs pour ce thème.`;

    // Detect if this is a recipe book
    const isRecipeBook = theme.toLowerCase().includes('recette') || 
                         theme.toLowerCase().includes('cuisine') ||
                         theme.toLowerCase().includes('gastronomie') ||
                         theme.toLowerCase().includes('culinaire');

    let systemPrompt: string;
    let userPrompt: string;

    if (isRecipeBook) {
      // RECIPE-SPECIFIC PROMPT - 300+ words per recipe
      systemPrompt = `Tu es un chef cuisinier expert et auteur de livres de cuisine gastronomique.

Ta mission : Créer ${count} fiches de recettes DÉTAILLÉES et COMPLÈTES pour un livre de cuisine premium.

EXIGENCES DE LONGUEUR CRITIQUES :
- Chaque fiche DOIT contenir MINIMUM 300 MOTS (objectif : 350-400 mots)
- Le champ "content" doit être le plus long avec l'histoire, la culture et les détails gastronomiques
- Ne jamais faire de contenu court ou résumé

STRUCTURE OBLIGATOIRE pour chaque recette :
1. "content" (MINIMUM 200 mots) : 
   - Paragraphe 1 : Histoire et origine du plat (où, quand, pourquoi ce plat est né)
   - Paragraphe 2 : Importance culturelle et traditions associées
   - Paragraphe 3 : Description sensorielle détaillée (arômes, textures, saveurs, couleurs)
   - Paragraphe 4 : Ingrédients clés avec leur rôle dans le plat

2. "remember" (MINIMUM 60 mots) :
   - 10 à 12 étapes de préparation NUMÉROTÉES et détaillées
   - Temps de préparation et cuisson
   - Astuces de chef pour chaque étape critique

3. "exercise" (MINIMUM 40 mots) :
   - Accord mets-vins précis avec cépage et région
   - Suggestions d'accompagnements
   - Variations possibles

4. "closing" (20-30 mots) :
   - Conseil final du chef ou anecdote

${toneDesc}

IMPORTANT: Réponds UNIQUEMENT en JSON valide :
{
  "sheets": [
    {
      "id": 1,
      "title": "Nom du plat authentique",
      "content": "MINIMUM 200 MOTS : Histoire complète, origine, importance culturelle, description sensorielle détaillée, ingrédients clés...",
      "remember": "MINIMUM 60 MOTS : 1. Première étape... 2. Deuxième étape... [10-12 étapes numérotées]",
      "exercise": "MINIMUM 40 MOTS : Accord vin + accompagnements + variations",
      "closing": "Conseil du chef ou anecdote (20-30 mots)",
      "imagePrompt": "Detailed food photography prompt in English: [dish name], professional food styling, ${visualStyle || 'warm ambient lighting, rustic wooden table, garnished presentation'}"
    }
  ]
}`;

      userPrompt = `Thème : ${theme}
${topicsSection}

RAPPEL CRITIQUE : Chaque fiche DOIT avoir MINIMUM 300 MOTS au total.
Le champ "content" seul doit avoir minimum 200 mots.

Génère exactement ${count} fiches de recettes COMPLÈTES et DÉTAILLÉES en JSON.`;

    } else {
      // STANDARD PROMPT for non-recipe books
      systemPrompt = `Tu es un auteur spécialisé en ${theme}.

Ta mission : Créer ${count} fiches pratiques destinées à un ebook illustré.

Contraintes importantes :
- ${toneDesc}
- Pas de jargon technique
- Chaque fiche doit contenir un contenu riche et informatif (minimum 150 mots)
- Structure claire et aérée

IMPORTANT: Tu dois répondre UNIQUEMENT en JSON valide avec la structure suivante, sans aucun texte avant ou après :
{
  "sheets": [
    {
      "id": 1,
      "title": "Titre court et apaisant",
      "content": "Texte principal détaillé (minimum 100 mots, explication complète et bienveillante)",
      "remember": "3 à 5 points clés à retenir",
      "exercise": "Action concrète et simple à faire avec instructions détaillées",
      "closing": "Phrase de clôture douce et rassurante",
      "imagePrompt": "Prompt en anglais pour générer une illustration correspondant à cette fiche. Style: ${visualStyle || 'Soft watercolor illustration style.'}"
    }
  ]
}`;

      userPrompt = `Thème principal : ${theme}
${topicsSection}

Génère exactement ${count} fiches pratiques complètes en JSON.`;
    }

    console.log(`Generating ${count} practical sheets for theme: ${theme}`);

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Erreur lors de la génération des fiches');
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    
    // Clean and parse JSON
    let result;
    try {
      const cleanedContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse response:', parseError);
      console.error('Raw content:', rawContent);
      throw new Error('Erreur lors du parsing de la réponse');
    }

    console.log(`Successfully generated ${result.sheets?.length || 0} sheets`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-practical-sheets:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
