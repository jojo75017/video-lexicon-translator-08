import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Body {
  niche: string;
  competitors: string; // free text: titres, auteurs, ASIN, URLs
  yourAngle?: string;
  marketplace?: string;
}

const SYSTEM = `Tu es un expert en stratégie éditoriale KDP Amazon et en reverse-engineering de best-sellers.
Ta mission: analyser les concurrents d'un auteur pour révéler leurs recettes de succès et donner un plan d'action concret.
Base ton analyse sur ce que tu connais du marché du livre Amazon (patterns de titres, catégories, prix, mots-clés de niche, tactiques marketing des auteurs à succès).
Réponds UNIQUEMENT en JSON valide, aucun texte avant/après.`;

function prompt(b: Body) {
  return `Marché: ${b.marketplace || 'amazon.fr'}
Niche/genre de l'auteur: ${b.niche}
Concurrents à analyser (titres/auteurs/ASIN/URLs): ${b.competitors}
Positionnement de l'auteur (facultatif): ${b.yourAngle || '-'}

Produis une analyse concurrentielle structurée:

{
  "positionnement_concurrents": [
    {"nom":"...","angle":"pitch en 1 phrase","force":"ce qui marche","faiblesse":"angle mort exploitable"}
  ],
  "patterns_titres": ["pattern 1", "pattern 2", "pattern 3", "pattern 4", "pattern 5"],
  "categories_kdp_recommandees": ["catégorie 1 → sous-catégorie", "..."],
  "prix_positionnement": {
    "fourchette_ebook": "de X€ à Y€",
    "fourchette_broche": "de X€ à Y€",
    "prix_optimal_lancement": "0,99€ / 2,99€ / 4,99€ avec justification"
  },
  "mots_cles_niche": ["kw1", "kw2", "..."],
  "tactiques_marketing_observees": [
    {"tactique":"...","exemple":"comment un concurrent l'utilise","how_to":"comment tu peux le faire"}
  ],
  "opportunites_gap": [
    {"opportunite":"angle inexploité","pourquoi":"raison","action":"étape concrète"}
  ],
  "plan_action_30j": [
    {"semaine":1,"action":"...","livrable":"..."},
    {"semaine":2,"action":"...","livrable":"..."},
    {"semaine":3,"action":"...","livrable":"..."},
    {"semaine":4,"action":"...","livrable":"..."}
  ],
  "score_competition": {"niveau":"faible|moyen|fort","note":"1-10","conseil":"..."}
}

Sois précis, actionnable, aucun blabla générique. 5+ mots-clés, 5+ patterns titres, 3+ opportunités.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const body = (await req.json()) as Body;
    if (!body?.niche || !body?.competitors) {
      return new Response(JSON.stringify({ error: 'Niche et concurrents requis' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const resp = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: prompt(body) }],
        response_format: { type: 'json_object' },
      }),
    });
    if (!resp.ok) {
      const t = await resp.text();
      return new Response(JSON.stringify({ error: 'AI error', status: resp.status, details: t }), { status: resp.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    let parsed: any; try { parsed = JSON.parse(content); } catch { parsed = { raw: content }; }
    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
