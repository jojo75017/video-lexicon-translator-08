import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const lovableAiHttpError = (status: number) => {
  if (status === 402) {
    return { status, error: 'Crédits épuisés. Veuillez ajouter des crédits.' };
  }
  if (status === 429) {
    return { status, error: 'Limite de requêtes atteinte. Veuillez réessayer dans quelques instants.' };
  }
  return { status: 500, error: `Erreur API: ${status}` };
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, actionType, prompt, numberOfChapters, ebookTitle, authorName, apiKey, type, content, openaiApiKey, useOpenAI, maxTokens } = await req.json();
    console.log('Content generation request:', { email, actionType, type });

    // Handle KDP analytics (uses OpenAI for reliability)
    if (type === 'kdp-analytics') {
      console.log('Processing KDP analytics (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un expert en analyse KDP Amazon. Réponds toujours en JSON valide sans markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI error:', errorText);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse KDP' }),
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

      console.log('KDP analytics completed');
      return new Response(
        JSON.stringify({ content: JSON.stringify(analysis) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle KDP market analysis (uses OpenAI for reliability)
    if (type === 'kdp-market-analysis') {
      console.log('Processing KDP market analysis...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un expert en analyse de marché Amazon KDP. Tu fournis des analyses détaillées basées sur les tendances du marché ebook. Réponds toujours en JSON valide sans markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI error:', errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.', code: 'RATE_LIMITED' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse du marché KDP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      // Return the content directly - the client will parse it
      console.log('KDP market analysis completed');
      return new Response(
        JSON.stringify({ content: analysisText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (type === 'title-volume-analysis') {
      console.log('Processing title volume analysis (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un expert en analyse de volumes de titres. Réponds toujours en JSON valide sans markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI error:', errorText);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
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

    // Handle style analysis (uses OpenAI for reliability)
    if (type === 'style-analysis') {
      console.log('Processing style analysis (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un expert en écriture et style littéraire. Tu analyses le texte et fournis des suggestions concrètes pour améliorer le style. Réponds toujours en JSON valide.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI error:', errorText);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse de style' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      let cleanContent = analysisText;
      try {
        cleanContent = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        JSON.parse(cleanContent);
      } catch {
        // Keep as is if not valid JSON
      }

      console.log('Style analysis completed');
      return new Response(
        JSON.stringify({ content: cleanContent }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle enhance-dictation (uses OpenAI for reliability)
    if (type === 'enhance-dictation') {
      console.log('Processing dictation enhancement (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un éditeur littéraire expert. Améliore le texte dicté en corrigeant la grammaire, la ponctuation et en améliorant le style tout en conservant le sens original. Ne fournis que le texte amélioré, sans commentaires.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI error:', errorText);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'amélioration du texte' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const enhancedText = data.choices[0].message.content;

      console.log('Dictation enhancement completed');
      return new Response(
        JSON.stringify({ content: enhancedText }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle niche analysis (uses OpenAI for reliability)
    if (type === 'niche-analysis') {
      console.log('Processing niche analysis (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'OpenAI API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'Tu es un expert en analyse de niches. Réponds toujours en JSON valide sans markdown.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI error:', errorText);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        return new Response(
          JSON.stringify({ error: 'Erreur lors de l\'analyse de niche' }),
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

      console.log('Niche analysis completed');
      return new Response(
        JSON.stringify({ content: JSON.stringify(analysis) }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle KDP research (bestsellers, titles, categories, niche analysis)
    if (type === 'kdp-research') {
      console.log('Processing KDP research...');
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Lovable API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const systemPrompt = `Tu es un expert en analyse de marché Amazon KDP et en optimisation SEO pour les ebooks. 
Tu fournis des données réalistes et exploitables basées sur les tendances actuelles du marché.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans \`\`\`, sans commentaires.
Génère des données riches, variées et professionnelles.`;

      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Lovable AI error for KDP research:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Limite de requêtes atteinte. Réessayez dans quelques instants.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Crédits épuisés. Veuillez recharger vos crédits.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        return new Response(
          JSON.stringify({ error: 'Erreur lors de la recherche KDP' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      const researchText = data.choices[0].message.content;
      
      console.log('KDP research completed successfully');
      return new Response(
        JSON.stringify({ content: researchText }),
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

    // Handle series-bible generation (uses OpenAI for reliability)
    if (type === 'series-bible') {
      console.log('Processing series bible generation (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not found');
        return new Response(
          JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Calling OpenAI for series-bible...');
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 4000,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('OpenAI response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI error:', response.status, errorText);
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          return new Response(
            JSON.stringify({ error: `Erreur API: ${response.status}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        console.log('OpenAI data received');
        const generatedContent = data.choices?.[0]?.message?.content;
        
        if (!generatedContent) {
          console.error('No content in response:', JSON.stringify(data));
          return new Response(
            JSON.stringify({ error: 'Réponse vide de l\'IA' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Series bible generated successfully');
        return new Response(
          JSON.stringify({ content: generatedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('Series bible error:', err);
        const errorMessage = err.name === 'AbortError' ? 'Timeout - génération trop longue' : err.message;
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle characters extraction (uses OpenAI for reliability)
    if (type === 'characters') {
      console.log('Processing characters extraction (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not found for characters');
        return new Response(
          JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const hasContent = content && content.trim().length > 50;
      
      const charactersPrompt = hasContent 
        ? `Tu es un expert en analyse littéraire. Analyse le contenu suivant et extrait une liste de 4 à 6 personnages (maximum 6) : personnages principaux + secondaires.

TITRE: ${ebookTitle || 'Sans titre'}

CONTENU:
${content}

Règles:
- Inclus aussi les personnages mentionnés brièvement (même une seule fois)
- Si le texte contient moins de 4 personnages nommés, complète avec des personnages secondaires plausibles et cohérents

Pour chaque personnage, fournis:
- Son nom exact
- Son rôle dans l'histoire (protagonist, antagonist, secondary, mentor, ally, love_interest, comic_relief, narrator, other)
- Une brève description de qui il est et ce qu'il fait`
        : `Tu es un expert en création littéraire. Basé sur le titre suivant, PROPOSE une liste de personnages pertinents pour cette histoire.

TITRE DE L'EBOOK: ${ebookTitle}

Crée 4 à 6 personnages intéressants et cohérents avec le thème du titre. Pour chaque personnage, fournis:
- Un nom approprié au genre/thème
- Son rôle dans l'histoire (protagonist, antagonist, secondary, mentor, ally, love_interest, comic_relief, narrator, other)
- Une description détaillée de qui il est, sa personnalité, ses motivations`;

      const jsonInstruction = `

Réponds UNIQUEMENT avec un JSON valide (sans markdown, sans balises) dans ce format exact:
{
  "characters": [
    {
      "name": "Nom du personnage",
      "role": "protagonist",
      "description": "Description du personnage et de son rôle dans l'histoire"
    }
  ]
}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown.' },
              { role: 'user', content: charactersPrompt + jsonInstruction }
            ],
            max_tokens: 2000,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI error (characters):', response.status, errorText);
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          return new Response(
            JSON.stringify({ error: `Erreur API: ${response.status}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        const resultText = data.choices?.[0]?.message?.content || '';
        
        let result;
        try {
          const cleanJson = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          result = JSON.parse(cleanJson);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Raw:', resultText);
          result = { characters: [] };
        }

        console.log('Characters extraction completed:', result.characters?.length || 0, 'found');
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('Characters extraction error:', err);
        const errorMessage = err.name === 'AbortError' ? 'Timeout - génération trop longue' : err.message;
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle character profile generation (uses OpenAI for reliability)
    if (type === 'character-profile') {
      console.log('Processing character profile generation (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not found for character-profile');
        return new Response(
          JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const characterName = body.characterName || 'Sans nom';
      const characterRole = body.characterRole || 'secondary';
      const characterDescription = body.characterDescription || '';
      const otherCharacters = body.otherCharacters || '';

      const roleLabels: Record<string, string> = {
        protagonist: 'Protagoniste principal',
        antagonist: 'Antagoniste',
        secondary: 'Personnage secondaire',
        mentor: 'Mentor / Guide',
        ally: 'Allié',
        love_interest: 'Intérêt amoureux',
        comic_relief: 'Comic relief',
        narrator: 'Narrateur',
        other: 'Autre'
      };

      const profilePrompt = `Tu es un expert en création de personnages littéraires. Génère une fiche complète pour ce personnage.

PERSONNAGE: ${characterName}
RÔLE: ${roleLabels[characterRole] || characterRole}
DESCRIPTION EXISTANTE: ${characterDescription || 'Aucune'}
TITRE DU LIVRE: ${ebookTitle || 'Non spécifié'}
AUTRES PERSONNAGES DU LIVRE: ${otherCharacters || 'Aucun'}

Crée une fiche détaillée et cohérente avec les informations existantes. Sois créatif mais réaliste.

Réponds UNIQUEMENT avec un JSON valide (sans markdown) dans ce format exact:
{
  "profile": {
    "physicalDescription": "Description physique détaillée (apparence, taille, traits distinctifs, style vestimentaire)",
    "psychology": "Traits de personnalité, forces, faiblesses, peurs profondes, motivations internes",
    "narrativeArc": "Évolution du personnage au fil de l'histoire: point de départ, transformation, point d'arrivée",
    "objectives": "Objectifs principaux (ce qu'il veut consciemment) et besoins profonds (ce dont il a vraiment besoin)",
    "relationships": "Relations avec les autres personnages (alliés, ennemis, tensions, liens affectifs)"
  }
}`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown.' },
              { role: 'user', content: profilePrompt }
            ],
            max_tokens: 2000,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI error (character-profile):', response.status, errorText);
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          return new Response(
            JSON.stringify({ error: `Erreur API: ${response.status}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        const resultText = data.choices?.[0]?.message?.content || '';
        
        let result;
        try {
          const cleanJson = resultText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          result = JSON.parse(cleanJson);
        } catch (parseError) {
          console.error('JSON parse error:', parseError, 'Raw:', resultText);
          result = { profile: {} };
        }

        console.log('Character profile generated for:', characterName);
        return new Response(
          JSON.stringify(result),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('Character profile error:', err);
        const errorMessage = err.name === 'AbortError' ? 'Timeout - génération trop longue' : err.message;
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle next-tome generation (uses OpenAI for reliability)
    if (type === 'next-tome') {
      console.log('Processing next tome generation (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not found');
        return new Response(
          JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Calling OpenAI for next-tome...');
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un expert en création littéraire. Génère uniquement du JSON valide sans markdown.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 4000,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('OpenAI response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI error:', response.status, errorText);
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          return new Response(
            JSON.stringify({ error: `Erreur API: ${response.status}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        console.log('OpenAI data received');
        const generatedContent = data.choices?.[0]?.message?.content;
        
        if (!generatedContent) {
          console.error('No content in response:', JSON.stringify(data));
          return new Response(
            JSON.stringify({ error: 'Réponse vide de l\'IA' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Next tome generated successfully');
        return new Response(
          JSON.stringify({ content: generatedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('Next tome error:', err);
        const errorMessage = err.name === 'AbortError' ? 'Timeout - génération trop longue' : err.message;
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle tome-chapters generation (uses OpenAI for reliability)
    if (type === 'tome-chapters') {
      console.log('Processing tome chapters generation (OpenAI)...');
      const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
      
      if (!OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY not found');
        return new Response(
          JSON.stringify({ error: 'Clé API OpenAI non configurée' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Calling OpenAI for tome-chapters...');
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 min timeout
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu es un expert en création littéraire et planification de livres. Génère uniquement du JSON valide sans balises markdown.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 4000,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('OpenAI response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI error:', response.status, errorText);
          if (response.status === 429) {
            return new Response(
              JSON.stringify({ error: 'Trop de requêtes. Réessayez dans quelques instants.' }),
              { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          return new Response(
            JSON.stringify({ error: `Erreur API: ${response.status}` }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        console.log('OpenAI data received');
        const generatedContent = data.choices?.[0]?.message?.content;
        
        if (!generatedContent) {
          console.error('No content in response:', JSON.stringify(data));
          return new Response(
            JSON.stringify({ error: 'Réponse vide de l\'IA' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Tome chapters generated successfully');
        return new Response(
          JSON.stringify({ content: generatedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('Tome chapters error:', err);
        const errorMessage = err.name === 'AbortError' ? 'Timeout - génération trop longue' : err.message;
        return new Response(
          JSON.stringify({ error: errorMessage }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle comic book scenario generation (uses Lovable AI)
    if (type === 'comic-scenario') {
      console.log('Processing comic scenario generation (Lovable AI)...');
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      
      if (!LOVABLE_API_KEY) {
        return new Response(
          JSON.stringify({ error: 'Lovable API key not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const systemPrompt = `Tu es un scénariste expert de bandes dessinées pour enfants et adolescents. 
Tu crées des scénarios visuels riches et des dialogues percutants adaptés à l'âge du public.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans \`\`\`, sans commentaires.`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);
        
        const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt }
            ],
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Lovable AI error for comic scenario:', response.status, errorText);
          
          const { status, error: errMsg } = lovableAiHttpError(response.status);
          return new Response(
            JSON.stringify({ error: errMsg }),
            { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        const scenarioText = data.choices?.[0]?.message?.content;
        
        if (!scenarioText) {
          console.error('No content in Lovable AI response:', JSON.stringify(data));
          return new Response(
            JSON.stringify({ error: "Réponse vide de l'IA" }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('Comic scenario generated successfully');
        return new Response(
          JSON.stringify({ content: scenarioText }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error('Comic scenario generation error:', err);
        const errorMessage = err?.name === 'AbortError' ? 'Timeout - génération trop longue' : err?.message;
        return new Response(
          JSON.stringify({ error: errorMessage || 'Erreur inconnue' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle encyclopedia / atlas generation
    // We use OpenAI here (via OPENAI_API_KEY secret) to avoid Lovable AI credit issues.
    if (type === 'encyclopedia' || type === 'atlas') {
      console.log(`Processing ${type} generation (OpenAI)...`);

      const openaiKey = (apiKey as string | undefined) ?? Deno.env.get('OPENAI_API_KEY');
      if (!openaiKey) {
        return new Response(
          JSON.stringify({ error: 'Clé API OpenAI requise' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const systemPrompt =
        type === 'encyclopedia'
          ? "Tu es un expert naturaliste. Génère des fiches encyclopédiques détaillées et précises. Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans balises markdown."
          : "Tu es un expert en géographie naturelle et écologie. Génère des fiches atlas détaillées. Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ou après, sans balises markdown.";

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 180000);

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: prompt },
            ],
            // 50 fiches peuvent être longues
            max_tokens: 6000,
            temperature: 0.4,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('OpenAI error:', response.status, errorText);
          return new Response(
            JSON.stringify({ error: 'Erreur lors de la génération du contenu' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const data = await response.json();
        const generatedContent = data?.choices?.[0]?.message?.content;

        if (!generatedContent) {
          console.error('No content in OpenAI response:', JSON.stringify(data));
          return new Response(
            JSON.stringify({ error: "Réponse vide de l'IA" }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`${type} generated successfully`);
        return new Response(
          JSON.stringify({ content: generatedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error(`${type} generation error:`, err);
        const errorMessage = err?.name === 'AbortError' ? 'Timeout - génération trop longue' : err?.message;
        return new Response(
          JSON.stringify({ error: errorMessage || 'Erreur inconnue' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle documentary book generation (structure, chapters, regeneration)
    // Prioritize user's OpenAI key if provided, fallback to Lovable AI
    if (type === 'documentary-structure' || type === 'documentary-chapter' || type === 'documentary-chapter-regen') {
      console.log(`Processing ${type} generation...`);
      console.log(`useOpenAI flag: ${useOpenAI}, has openaiApiKey: ${!!openaiApiKey}`);

      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      const userOpenAIKey = (useOpenAI && openaiApiKey) ? openaiApiKey : null;
      
      console.log(`User OpenAI key provided: ${!!userOpenAIKey}`);
      
      const systemPrompt = type === 'documentary-structure'
        ? `Tu es un auteur documentaire professionnel spécialisé dans la création de livres factuels de haute qualité.
Tu génères des structures complètes avec introduction, chapitres détaillés, conclusion, bibliographie et glossaire.
Réponds UNIQUEMENT avec du JSON valide, sans markdown, sans balises code.`
        : `Tu es un rédacteur documentaire expert.
Tu écris du contenu factuel, bien documenté, engageant et adapté à l'audience cible.
Réponds avec du texte formaté de manière professionnelle, bien structuré avec des paragraphes clairs.`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 min timeout

        let response;
        let usedProvider = 'none';

        // PRIORITY 1: Use user's OpenAI key if provided
        if (userOpenAIKey) {
          console.log(`Using user's OpenAI key for ${type}...`);
          usedProvider = 'user-openai';
          
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${userOpenAIKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
              ],
              max_tokens: maxTokens || (type === 'documentary-structure' ? 8000 : 2500),
              temperature: 0.7,
            }),
            signal: controller.signal,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`User OpenAI key failed:`, response.status, errorText);
            clearTimeout(timeoutId);
            return new Response(
              JSON.stringify({ error: `Erreur avec votre clé API OpenAI (${response.status}). Vérifiez votre quota/facturation.` }),
              { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }
        // PRIORITY 2: Try Lovable AI (free credits)
        else if (LOVABLE_API_KEY) {
          console.log(`Using Lovable AI for ${type}...`);
          usedProvider = 'lovable';
          
          response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${LOVABLE_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'google/gemini-2.5-flash',
              messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: prompt },
              ],
            }),
            signal: controller.signal,
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Lovable AI failed:`, response.status, errorText);
            clearTimeout(timeoutId);
            return new Response(
              JSON.stringify({ error: 'Crédits Lovable épuisés. Configurez votre clé API OpenAI dans Paramètres.' }),
              { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } else {
          clearTimeout(timeoutId);
          return new Response(
            JSON.stringify({ error: 'Aucune clé API disponible. Configurez votre clé OpenAI dans les Paramètres.' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        clearTimeout(timeoutId);

        const data = await response.json();
        const generatedContent = data?.choices?.[0]?.message?.content;

        if (!generatedContent) {
          console.error('No content in documentary response:', JSON.stringify(data));
          return new Response(
            JSON.stringify({ error: "Réponse vide de l'IA" }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log(`${type} generated successfully via ${usedProvider}`);
        return new Response(
          JSON.stringify({ content: generatedContent }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (err) {
        console.error(`${type} generation error:`, err);
        const errorMessage = err?.name === 'AbortError' ? 'Timeout - génération trop longue' : err?.message;
        return new Response(
          JSON.stringify({ error: errorMessage || 'Erreur inconnue' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Use provided API key if present, otherwise fallback to project secret
    const openaiKey = (apiKey as string | undefined) ?? Deno.env.get('OPENAI_API_KEY');

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: 'Clé API OpenAI requise' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(apiKey ? 'Using provided OpenAI API key for generation' : 'Using OPENAI_API_KEY secret for generation');

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
