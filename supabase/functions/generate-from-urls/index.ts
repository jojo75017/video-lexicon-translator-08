import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  extractedContent: {
    youtube?: { title: string; content: string; url: string };
    article?: { title: string; content: string; url: string };
    website?: { title: string; content: string; url: string };
  };
  ebookTitle?: string;
  targetAudience?: string;
  numberOfChapters?: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      extractedContent, 
      ebookTitle,
      targetAudience = "Débutants et intermédiaires",
      numberOfChapters = 7
    }: GenerateRequest = await req.json();

    if (!extractedContent || Object.keys(extractedContent).length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Aucun contenu source fourni" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Préparer le contexte des sources
    let sourcesContext = "";
    const sourcesList: string[] = [];

    if (extractedContent.youtube) {
      sourcesContext += `\n\n=== SOURCE YOUTUBE ===\nTitre: ${extractedContent.youtube.title}\nURL: ${extractedContent.youtube.url}\nContenu:\n${extractedContent.youtube.content.slice(0, 8000)}`;
      sourcesList.push(`YouTube: ${extractedContent.youtube.title}`);
    }

    if (extractedContent.article) {
      sourcesContext += `\n\n=== SOURCE ARTICLE ===\nTitre: ${extractedContent.article.title}\nURL: ${extractedContent.article.url}\nContenu:\n${extractedContent.article.content.slice(0, 8000)}`;
      sourcesList.push(`Article: ${extractedContent.article.title}`);
    }

    if (extractedContent.website) {
      sourcesContext += `\n\n=== SOURCE SITE WEB ===\nTitre: ${extractedContent.website.title}\nURL: ${extractedContent.website.url}\nContenu:\n${extractedContent.website.content.slice(0, 8000)}`;
      sourcesList.push(`Site: ${extractedContent.website.title}`);
    }

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Clé API OpenAI non configurée" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Tu es un expert en création de guides pratiques et ebooks à partir de sources diverses.

Ta mission: Transformer le contenu des sources fournies en un GUIDE PRATIQUE structuré et actionnable.

RÈGLES ABSOLUES:
1. SYNTHÉTISER et RESTRUCTURER le contenu - ne pas copier mot à mot
2. Créer une STRUCTURE LOGIQUE avec des étapes claires
3. Ajouter des CONSEILS PRATIQUES et des EXEMPLES concrets
4. Utiliser un ton ENGAGEANT et ACCESSIBLE
5. Inclure des CHECKLISTS et POINTS D'ACTION
6. Éviter le jargon technique excessif
7. Créer du contenu ORIGINAL basé sur les sources

FORMAT DE SORTIE (JSON):
{
  "title": "Titre accrocheur du guide",
  "subtitle": "Sous-titre explicatif",
  "summary": "Résumé du guide en 2-3 phrases",
  "targetAudience": "Public cible",
  "chapters": [
    {
      "number": 1,
      "title": "Titre du chapitre",
      "content": "Contenu complet du chapitre (minimum 500 mots)",
      "keyPoints": ["Point clé 1", "Point clé 2"],
      "actionItems": ["Action à faire 1", "Action à faire 2"]
    }
  ],
  "conclusion": "Conclusion motivante avec appel à l'action",
  "sources": ["Liste des sources utilisées"]
}`;

    const userPrompt = `Crée un guide pratique de ${numberOfChapters} chapitres à partir des sources suivantes.

${ebookTitle ? `TITRE SOUHAITÉ: ${ebookTitle}` : "Propose un titre accrocheur basé sur le contenu."}
PUBLIC CIBLE: ${targetAudience}
NOMBRE DE CHAPITRES: ${numberOfChapters}

SOURCES À ANALYSER ET SYNTHÉTISER:
${sourcesContext}

IMPORTANT:
- Chaque chapitre doit faire minimum 500 mots
- Inclus des conseils pratiques et des exemples concrets
- Structure le contenu de manière progressive (du basique vers l'avancé)
- Ajoute des checklists et points d'action à chaque chapitre

Génère le guide complet au format JSON.`;

    console.log("Génération du guide pratique en cours...");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 8000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur OpenAI:", response.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: "Erreur lors de la génération" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content || "";

    // Parser le JSON généré
    let guide;
    try {
      // Nettoyer le texte si nécessaire
      let jsonText = generatedText;
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonText = jsonMatch[0];
      }
      guide = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Erreur parsing JSON:", parseError);
      // Retourner le texte brut si le parsing échoue
      return new Response(
        JSON.stringify({ 
          success: true, 
          guide: {
            title: ebookTitle || "Guide Pratique",
            rawContent: generatedText,
            sources: sourcesList
          },
          warning: "Le format JSON n'a pas pu être parsé, contenu brut retourné"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ajouter les sources
    guide.sources = sourcesList;

    console.log("Guide généré avec succès:", guide.title);

    return new Response(
      JSON.stringify({ 
        success: true, 
        guide,
        tokensUsed: data.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erreur generate-from-urls:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
