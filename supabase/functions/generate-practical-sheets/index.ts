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

    const systemPrompt = `Tu es un auteur spécialisé en ${theme}.

Ta mission : Créer ${count} fiches pratiques destinées à un ebook illustré.

Contraintes importantes :
- ${toneDesc}
- Pas de jargon technique
- Chaque fiche doit tenir sur UNE page (texte concis)
- Structure claire et aérée

IMPORTANT: Tu dois répondre UNIQUEMENT en JSON valide avec la structure suivante, sans aucun texte avant ou après :
{
  "sheets": [
    {
      "id": 1,
      "title": "Titre court et apaisant",
      "content": "Texte principal (5 à 7 phrases max, explication simple et bienveillante)",
      "remember": "1 à 2 phrases clés à retenir",
      "exercise": "Action concrète et simple à faire",
      "closing": "Phrase de clôture douce et rassurante",
      "imagePrompt": "Prompt en anglais pour générer une illustration correspondant à cette fiche. Style: ${visualStyle || 'Soft watercolor illustration style.'}"
    }
  ]
}`;

    const userPrompt = `Thème principal : ${theme}
${topicsSection}

Génère exactement ${count} fiches pratiques complètes en JSON.`;

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
