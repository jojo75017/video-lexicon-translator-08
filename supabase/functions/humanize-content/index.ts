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
    const {
      content,
      intensity = 'medium',
      style = 'natural',
      preserveKeywords = [],
      userProvider,
      userApiKey,
      userModel,
    } = await req.json();

    if (!content || content.trim().length < 50) {
      return new Response(
        JSON.stringify({ error: 'Le contenu doit faire au moins 50 caractères' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount > 4000) {
      return new Response(
        JSON.stringify({
          error:
            `Texte trop long pour un seul appel (${wordCount} mots). Humanisez chapitre par chapitre ` +
            `(4 000 mots maximum), ou utilisez « Corriger mon livre » pour le livre entier.`,
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const byoKey = typeof userApiKey === 'string' && userApiKey.length > 20 ? userApiKey : null;
    if (!LOVABLE_API_KEY && !byoKey) {
      throw new Error('Aucune clé IA disponible');
    }


    // Intensité de l'humanisation
    const intensityPrompts: Record<string, string> = {
      light: `Effectue des modifications légères pour rendre le texte plus naturel:
- Ajouter quelques contractions occasionnelles
- Varier légèrement la longueur des phrases
- Garder la structure globale intacte`,
      medium: `Réécris le texte pour le rendre plus humain et naturel:
- Varier significativement la structure des phrases
- Ajouter des expressions idiomatiques françaises
- Utiliser un vocabulaire plus varié et moins "parfait"
- Inclure des transitions naturelles entre les idées
- Éviter les formulations trop lisses ou génériques`,
      strong: `Transforme complètement ce texte pour qu'il paraisse écrit par un humain:
- Restructurer entièrement les paragraphes
- Ajouter des anecdotes, exemples concrets ou métaphores
- Utiliser un ton conversationnel avec des expressions familières (mais professionnelles)
- Inclure des parenthèses, des tirets, des questions rhétoriques
- Varier radicalement le rythme (phrases courtes puis longues)
- Ajouter des opinions nuancées ou des hésitations naturelles
- Éviter TOUTE formulation qui sonne comme de l'IA`
    };

    // Styles d'écriture
    const stylePrompts: Record<string, string> = {
      natural: 'Style d\'écriture naturel et fluide, comme un auteur professionnel.',
      conversational: 'Ton conversationnel et accessible, comme si tu parlais à un ami.',
      academic: 'Style académique mais accessible, avec des nuances et de la profondeur.',
      journalistic: 'Style journalistique moderne, engageant et direct.',
      storytelling: 'Style narratif captivant, avec des accroches et du suspense.'
    };

    const keywordsInstruction = preserveKeywords.length > 0 
      ? `\n\nIMPORTANT: Préserve ces mots-clés importants dans le texte réécrit: ${preserveKeywords.join(', ')}`
      : '';

    const systemPrompt = `Tu es un expert en réécriture de contenu. Ta mission est de transformer du texte généré par IA en texte qui paraît authentiquement écrit par un humain.

${intensityPrompts[intensity] || intensityPrompts.medium}

${stylePrompts[style] || stylePrompts.natural}
${keywordsInstruction}

RÈGLES CRITIQUES:
1. JAMAIS de phrases qui commencent par "Il est important de noter que" ou similaires
2. JAMAIS de listes parfaitement structurées sauf si absolument nécessaire
3. JAMAIS de transitions trop lisses comme "En outre", "De plus", "Par ailleurs" en excès
4. TOUJOURS varier la longueur des paragraphes
5. INCLURE des imperfections naturelles (mais pas de fautes d'orthographe)
6. Le texte final doit passer les détecteurs d'IA comme Originality.ai ou GPTZero

Retourne UNIQUEMENT le texte réécrit, sans commentaires ni explications.`;

    console.log(`Humanizing ${wordCount} words · intensity: ${intensity}, style: ${style}, byok: ${!!byoKey}`);

    const userPrompt = `Réécris ce texte pour le rendre plus humain:\n\n${content}`;
    const maxTokens = Math.min(8000, Math.max(1200, Math.round(wordCount * 2.2)));

    /** Appel BYOK (clé de l'abonné). Renvoie null si la clé n'est pas exploitable. */
    async function callByok(): Promise<string | null> {
      if (!byoKey) return null;
      const provider = String(userProvider || (byoKey.startsWith('AIza') ? 'gemini' : byoKey.startsWith('sk-or-') ? 'openrouter' : 'openai'));
      try {
        if (provider === 'gemini') {
          const r = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${encodeURIComponent(byoKey)}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: systemPrompt }] },
                contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
                generationConfig: { temperature: 0.9, maxOutputTokens: maxTokens },
              }),
            },
          );
          if (!r.ok) { console.error('BYOK gemini error', r.status, await r.text()); return null; }
          const d = await r.json();
          return d.candidates?.[0]?.content?.parts?.[0]?.text || null;
        }

        const endpoint = provider === 'openrouter'
          ? 'https://openrouter.ai/api/v1/chat/completions'
          : 'https://api.openai.com/v1/chat/completions';
        const model = userModel || (provider === 'openrouter' ? 'google/gemini-2.5-flash' : 'gpt-4o-mini');
        const r = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${byoKey}` },
          body: JSON.stringify({
            model,
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
            temperature: 0.9,
            max_tokens: maxTokens,
          }),
        });
        if (!r.ok) { console.error('BYOK error', provider, r.status, await r.text()); return null; }
        const d = await r.json();
        return d.choices?.[0]?.message?.content || null;
      } catch (e) {
        console.error('BYOK exception', e);
        return null;
      }
    }

    let humanizedContent: string | null = await callByok();

    if (!humanizedContent) {
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Clé IA refusée. Vérifiez votre clé dans Paramètres > Clés API.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.9,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Crédits épuisés. Ajoutez votre clé IA dans Paramètres > Clés API.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        const errorText = await response.text();
        console.error('AI Gateway error:', response.status, errorText);
        throw new Error(`Erreur API: ${response.status}`);
      }

      const data = await response.json();
      humanizedContent = data.choices?.[0]?.message?.content;
    }


    if (!humanizedContent) {
      throw new Error('Pas de contenu généré');
    }

    // Calculer les statistiques de modification
    const originalWords = content.split(/\s+/).length;
    const humanizedWords = humanizedContent.split(/\s+/).length;
    const wordDifference = Math.abs(humanizedWords - originalWords);
    const changePercentage = Math.round((wordDifference / originalWords) * 100);

    console.log('Content humanized successfully');

    return new Response(
      JSON.stringify({
        humanizedContent,
        stats: {
          originalLength: content.length,
          humanizedLength: humanizedContent.length,
          originalWords,
          humanizedWords,
          changePercentage,
          intensity,
          style
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in humanize-content:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur lors de l\'humanisation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
