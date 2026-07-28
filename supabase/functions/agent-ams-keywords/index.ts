import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Body {
  title: string;
  subtitle?: string;
  author?: string;
  genre?: string;
  audience?: string;
  synopsis?: string;
  language?: string;
  marketplace?: string;
}

const SYSTEM = `Tu es un expert en publicité Amazon Ads (AMS) pour livres KDP.
Ton rôle: générer une liste massive de mots-clés Amazon Ads ultra-ciblés à fort taux de conversion,
répartis en catégories exploitables directement dans une campagne Sponsored Products.

RÈGLES STRICTES:
- Aucune marque déposée hors auteurs publics reconnus du même genre.
- Chaque mot-clé doit être une expression de recherche plausible sur Amazon (2 à 6 mots).
- Pas de doublons, pas de mots-clés génériques (ex: "livre", "book").
- Réponds UNIQUEMENT en JSON valide, aucun texte avant/après.`;

function buildPrompt(b: Body) {
  return `Livre à promouvoir sur Amazon (${b.marketplace || 'amazon.fr'}):
- Titre: ${b.title}
- Sous-titre: ${b.subtitle || '-'}
- Auteur: ${b.author || '-'}
- Genre / catégorie: ${b.genre || '-'}
- Public cible: ${b.audience || '-'}
- Langue: ${b.language || 'français'}
- Résumé: ${b.synopsis || '-'}

Génère 5 catégories de mots-clés (40 par catégorie minimum, 50 idéalement):
1. "auteurs_concurrents" — noms d'auteurs du même genre que les fans achèteraient aussi (ex: "livre style Marc Levy").
2. "titres_similaires" — variantes/titres proches recherchés sur Amazon.
3. "long_tail" — expressions longues très ciblées (intention d'achat forte).
4. "occasions" — cadeaux, saisons, événements ("cadeau fête des mères", "lecture d'été").
5. "emotions_benefices" — bénéfices émotionnels ("livre qui fait du bien", "roman qui bouleverse").

Pour chaque mot-clé, ajoute:
- "kw": l'expression exacte (minuscules)
- "match": "exact" | "phrase" | "broad" (recommandation)
- "score": pertinence 1-10 (intention d'achat + spécificité)
- "bid": suggestion d'enchère en € (0.15 à 0.90 selon compétition estimée)

Format JSON strict:
{
  "auteurs_concurrents": [{"kw":"...","match":"phrase","score":8,"bid":0.35}, ...],
  "titres_similaires": [...],
  "long_tail": [...],
  "occasions": [...],
  "emotions_benefices": [...],
  "negative_keywords": ["gratuit", "pdf", ...],
  "campaign_tips": ["conseil 1", "conseil 2", "conseil 3"]
}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const body = (await req.json()) as Body;
    if (!body?.title || body.title.length < 2) {
      return new Response(JSON.stringify({ error: 'Titre requis' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: buildPrompt(body) },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!resp.ok) {
      const t = await resp.text();
      return new Response(JSON.stringify({ error: 'AI Gateway error', status: resp.status, details: t }), {
        status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    let parsed: any;
    try { parsed = JSON.parse(content); } catch { parsed = { raw: content }; }
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
