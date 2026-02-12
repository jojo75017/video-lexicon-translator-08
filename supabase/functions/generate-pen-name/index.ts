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
    const { title, category, tone, targetMarket } = await req.json();

    if (!title) {
      return new Response(
        JSON.stringify({ error: "Le titre de l'ebook est requis" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY non configurée");

    const systemPrompt = `Tu es un expert en branding d'auteurs et en stratégie éditoriale Amazon KDP. Tu génères des noms de plume professionnels, mémorables et adaptés au genre littéraire.

Critères d'un bon nom de plume :
- Facile à prononcer et retenir
- Cohérent avec le genre (ex: un nom sophistiqué pour la romance, autoritaire pour le business)
- Disponible comme nom d'auteur (éviter les noms de célébrités)
- Fonctionne bien sur une couverture de livre
- Adapté au marché cible (francophone, anglophone, international)

Génère exactement 8 noms de plume en JSON strict :
{
  "penNames": [
    {
      "name": "Prénom Nom",
      "style": "Classique / Moderne / Mystérieux / Autoritaire / Élégant / Créatif",
      "pourquoi": "Explication courte de pourquoi ce nom fonctionne pour ce genre",
      "scoreImpact": 85,
      "marche": "FR / EN / International",
      "initiales": "P.N."
    }
  ],
  "conseilsStrategie": [
    "Conseil 1 sur l'utilisation d'un nom de plume",
    "Conseil 2",
    "Conseil 3"
  ],
  "tendancesGenre": "Analyse courte des tendances de noms dans ce genre"
}`;

    const userPrompt = `Génère 8 noms de plume pour cet ebook :

Titre : ${title}
${category ? `Catégorie : ${category}` : ''}
${tone ? `Tonalité souhaitée : ${tone}` : ''}
${targetMarket ? `Marché cible : ${targetMarket}` : 'Marché cible : Francophone'}

Propose des noms variés : classiques, modernes, avec initiales, etc.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.9,
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requêtes atteinte, réessayez." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found");
      }
    } catch (e) {
      result = {
        penNames: [],
        conseilsStrategie: [],
        tendancesGenre: content
      };
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Error in generate-pen-name:", error);
    return new Response(
      JSON.stringify({ error: error.name === 'AbortError' ? 'Timeout' : error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
