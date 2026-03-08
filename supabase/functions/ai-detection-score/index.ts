import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const { content, action } = await req.json();
    if (!content) return new Response(JSON.stringify({ error: "Contenu requis" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY non configurée");

    if (action === 'detect') {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: `Tu es un expert en détection de texte généré par IA. Analyse le texte et retourne UNIQUEMENT un JSON valide :
{
  "score": <0-100 où 100 = très probablement IA>,
  "humanScore": <0-100 où 100 = très humain>,
  "markers": ["liste des marqueurs IA détectés"],
  "repetitivePatterns": ["motifs répétitifs trouvés"],
  "vocabularyAnalysis": { "richness": <1-10>, "diversity": <1-10>, "naturalness": <1-10> },
  "structureAnalysis": { "paragraphVariety": <1-10>, "sentenceLengthVariety": <1-10>, "transitionQuality": <1-10> },
  "verdict": "Probablement IA|Mixte|Probablement Humain",
  "recommendations": ["suggestions pour humaniser"]
}` },
            { role: "user", content: `Analyse ce texte pour détecter s'il est généré par IA :\n\n${content.substring(0, 5000)}` }
          ],
          tools: [{
            type: "function",
            function: {
              name: "ai_detection_result",
              description: "Résultat de l'analyse de détection IA",
              parameters: {
                type: "object",
                properties: {
                  score: { type: "number" },
                  humanScore: { type: "number" },
                  markers: { type: "array", items: { type: "string" } },
                  repetitivePatterns: { type: "array", items: { type: "string" } },
                  vocabularyAnalysis: { type: "object", properties: { richness: { type: "number" }, diversity: { type: "number" }, naturalness: { type: "number" } }, required: ["richness", "diversity", "naturalness"] },
                  structureAnalysis: { type: "object", properties: { paragraphVariety: { type: "number" }, sentenceLengthVariety: { type: "number" }, transitionQuality: { type: "number" } }, required: ["paragraphVariety", "sentenceLengthVariety", "transitionQuality"] },
                  verdict: { type: "string", enum: ["Probablement IA", "Mixte", "Probablement Humain"] },
                  recommendations: { type: "array", items: { type: "string" } }
                },
                required: ["score", "humanScore", "markers", "verdict", "recommendations"],
                additionalProperties: false
              }
            }
          }],
          tool_choice: { type: "function", function: { name: "ai_detection_result" } }
        })
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Limite atteinte, réessayez dans quelques instants" }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        if (status === 402) return new Response(JSON.stringify({ error: "Crédits insuffisants" }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        throw new Error(`Gateway error: ${status}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      const result = toolCall ? JSON.parse(toolCall.function.arguments) : { score: 50, humanScore: 50, verdict: "Mixte", markers: [], recommendations: [] };

      return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'humanize') {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: `Tu es un rédacteur humain expert. Réécris le texte pour le rendre INDÉTECTABLE par les outils anti-IA.

RÈGLES STRICTES :
- Varier la longueur des phrases (3 mots à 30 mots)
- Utiliser des expressions familières naturelles
- Ajouter des hésitations, parenthèses, digressions comme un vrai humain
- INTERDIRE : "Il est important de noter", "En effet", "De plus", "Par conséquent", "Il convient de"
- Ajouter des anecdotes personnelles inventées mais crédibles
- Varier le vocabulaire (synonymes, registres différents)
- Inclure des questions rhétoriques
- Garder le MÊME sens et la MÊME longueur (+/- 10%)
- NE PAS ajouter de commentaire, retourner UNIQUEMENT le texte réécrit` },
            { role: "user", content: `Réécris ce texte pour le rendre indétectable par les outils anti-IA :\n\n${content}` }
          ]
        })
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 429) return new Response(JSON.stringify({ error: "Limite atteinte" }), { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        if (status === 402) return new Response(JSON.stringify({ error: "Crédits insuffisants" }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        throw new Error(`Gateway error: ${status}`);
      }

      const data = await response.json();
      const humanized = data.choices?.[0]?.message?.content || content;

      return new Response(JSON.stringify({ humanizedContent: humanized }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: "Action invalide (detect|humanize)" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Erreur interne" }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
