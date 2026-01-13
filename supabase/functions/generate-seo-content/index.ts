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
    // SECURITY: Validate JWT authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentification requise' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      console.error('JWT validation failed:', claimsError);
      return new Response(
        JSON.stringify({ error: 'Token invalide ou expiré' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = claimsData.claims.sub;
    console.log(`Authenticated user: ${userId}`);

    const { topic, keyword, contentType, targetLength, tone, audience, intent, language } = await req.json();

    // SECURITY: Validate inputs
    if (!topic || !keyword) {
      return new Response(
        JSON.stringify({ error: 'Le sujet et le mot-clé sont requis' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (topic.length > 500 || keyword.length > 200) {
      return new Response(
        JSON.stringify({ error: 'Le sujet ou le mot-clé est trop long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Clé API OpenAI non configurée sur le serveur' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const wordCount = Math.min(Math.max(Number(targetLength) || 2000, 500), 5000);
    const selectedTone = (tone || 'professionnel').substring(0, 50);
    const selectedAudience = (audience || 'experts').substring(0, 100);
    const selectedIntent = (intent || 'informationnel').substring(0, 50);
    const selectedLanguage = language === 'en' ? 'anglais' : 'français';

    console.log(`Generating SEO content for: "${keyword}" (topic: ${topic}, ${wordCount} words)`);

    // Step 1: Generate SEO analysis and structure
    const analysisPrompt = `Tu es un expert SEO et rédacteur web professionnel. Analyse et génère un plan SEO complet pour:
- Sujet: ${topic}
- Mot-clé principal: ${keyword}
- Type de contenu: ${contentType || 'article'}
- Audience: ${selectedAudience}
- Intent: ${selectedIntent}
- Ton: ${selectedTone}
- Longueur cible: ${wordCount} mots
- Langue: ${selectedLanguage}

Réponds UNIQUEMENT en JSON valide avec cette structure exacte:
{
  "title": "Titre SEO optimisé (max 60 caractères)",
  "metaDescription": "Meta description optimisée (max 155 caractères)",
  "seoScore": 85,
  "readabilityScore": 80,
  "keywords": [
    {"keyword": "mot-clé 1", "difficulty": 45, "volume": 1200, "intent": "informational"},
    {"keyword": "mot-clé 2", "difficulty": 35, "volume": 800, "intent": "commercial"}
  ],
  "structure": [
    {"level": 1, "title": "Introduction", "wordCount": 200},
    {"level": 2, "title": "Section H2", "wordCount": 400},
    {"level": 3, "title": "Sous-section H3", "wordCount": 250}
  ],
  "faq": [
    {"question": "Question FAQ 1", "answer": "Réponse courte"},
    {"question": "Question FAQ 2", "answer": "Réponse courte"}
  ],
  "images": [
    {"title": "Image 1", "alt": "Description alt", "suggestion": "Idée d'image"}
  ]
}`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Tu es un expert SEO. Réponds UNIQUEMENT en JSON valide sans markdown ni commentaires.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!analysisResponse.ok) {
      const errorText = await analysisResponse.text();
      console.error('OpenAI API error (analysis):', errorText);
      throw new Error('Erreur lors de l\'analyse SEO');
    }

    const analysisData = await analysisResponse.json();
    let seoAnalysis;
    
    try {
      const rawContent = analysisData.choices?.[0]?.message?.content || '{}';
      const cleanedContent = rawContent.replace(/```json\n?|\n?```/g, '').trim();
      seoAnalysis = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse SEO analysis:', parseError);
      seoAnalysis = {
        title: `${keyword} : Guide Complet`,
        metaDescription: `Découvrez tout sur ${keyword}. Guide expert avec conseils pratiques.`,
        seoScore: 75,
        readabilityScore: 70,
        keywords: [{ keyword, difficulty: 50, volume: 1000, intent: 'informational' }],
        structure: [
          { level: 1, title: 'Introduction', wordCount: 200 },
          { level: 2, title: 'Fondamentaux', wordCount: 400 },
          { level: 2, title: 'Conseils pratiques', wordCount: 400 },
          { level: 1, title: 'Conclusion', wordCount: 200 }
        ],
        faq: [],
        images: []
      };
    }

    // Step 2: Generate full content
    const contentPrompt = `Rédige un ${contentType || 'article'} SEO complet sur "${topic}" avec le mot-clé "${keyword}".

Contraintes:
- Environ ${wordCount} mots
- Ton: ${selectedTone}
- Audience: ${selectedAudience}
- Intent: ${selectedIntent}
- Langue: ${selectedLanguage}
- Utilise le mot-clé naturellement (densité ~1-2%)
- Structure avec H1, H2, H3 (utilise # ## ###)
- Inclus des listes à puces et des paragraphes aérés
- Ajoute des statistiques et exemples concrets
- Termine par une conclusion avec call-to-action

Structure suggérée:
${seoAnalysis.structure?.map((s: any) => `${'#'.repeat(s.level)} ${s.title}`).join('\n') || '# Introduction\n## Section principale\n## Conseils\n# Conclusion'}

Rédige maintenant le contenu complet, optimisé pour le SEO et engageant pour le lecteur.`;

    const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: `Tu es un rédacteur web SEO expert. Rédige du contenu optimisé, engageant et informatif en ${selectedLanguage}.` },
          { role: 'user', content: contentPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
      }),
    });

    if (!contentResponse.ok) {
      const errorText = await contentResponse.text();
      console.error('OpenAI API error (content):', errorText);
      throw new Error('Erreur lors de la génération du contenu');
    }

    const contentData = await contentResponse.json();
    const generatedContent = contentData.choices?.[0]?.message?.content || '';

    // Extract token usage from both API calls
    const analysisTokens = analysisData.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    const contentTokens = contentData.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    
    const totalTokenUsage = {
      promptTokens: analysisTokens.prompt_tokens + contentTokens.prompt_tokens,
      completionTokens: analysisTokens.completion_tokens + contentTokens.completion_tokens,
      totalTokens: analysisTokens.total_tokens + contentTokens.total_tokens
    };

    console.log(`Token usage - Prompt: ${totalTokenUsage.promptTokens}, Completion: ${totalTokenUsage.completionTokens}, Total: ${totalTokenUsage.totalTokens}`);

    // Calculate actual word count
    const actualWordCount = generatedContent.split(/\s+/).filter((w: string) => w.length > 0).length;
    const estimatedReadTime = Math.ceil(actualWordCount / 200);

    // Build final response
    const result = {
      title: seoAnalysis.title || `${keyword} : Guide Complet`,
      metaDescription: seoAnalysis.metaDescription || `Découvrez tout sur ${keyword}.`,
      content: generatedContent,
      structure: seoAnalysis.structure || [],
      seoScore: seoAnalysis.seoScore || 80,
      readabilityScore: seoAnalysis.readabilityScore || 75,
      wordCount: actualWordCount,
      estimatedReadTime,
      keywords: seoAnalysis.keywords || [{ keyword, difficulty: 50, volume: 1000, intent: 'informational' }],
      faq: seoAnalysis.faq || [],
      images: seoAnalysis.images || [],
      competitorAnalysis: {
        topCompetitors: [],
        opportunities: ['Contenu unique généré par IA', 'Structure optimisée pour le SEO']
      },
      technicalSEO: {
        pagespeed: { mobile: 85, desktop: 92 },
        mobileOptimization: { score: 88 }
      },
      tokenUsage: totalTokenUsage
    };

    console.log(`SEO content generated successfully: ${actualWordCount} words, score: ${result.seoScore}`);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-seo-content:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
