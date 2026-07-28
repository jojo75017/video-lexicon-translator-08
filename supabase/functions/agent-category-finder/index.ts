import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

interface Body {
  title: string;
  subtitle?: string;
  synopsis: string;
  genre?: string;
  audience?: string;
  keywords?: string;
  marketplace?: string;
  format?: string; // ebook / broche / both
}

const SYSTEM = `Tu es un expert des catégories Amazon KDP (plus de 19 000 catégories et sous-catégories sur amazon.com, amazon.fr, amazon.co.uk, amazon.de).
Ta mission : trouver les MEILLEURES catégories KDP pour un livre donné afin de maximiser sa visibilité et ses chances de devenir best-seller.
Tu connais la structure exacte des chemins Amazon (Livres > Catégorie > Sous-catégorie > Sous-sous-catégorie).
Tu privilégies les catégories de niche à faible concurrence mais avec du volume, plutôt que les catégories généralistes ultra-saturées.
Réponds UNIQUEMENT en JSON valide, aucun texte avant/après.`;

function prompt(b: Body) {
  return `Marché: ${b.marketplace || 'amazon.fr'}
Titre: ${b.title}
Sous-titre: ${b.subtitle || '-'}
Genre déclaré: ${b.genre || '-'}
Public cible: ${b.audience || '-'}
Mots-clés: ${b.keywords || '-'}
Format: ${b.format || 'ebook + broché'}
Synopsis / résumé:
${b.synopsis}

Analyse ce livre et recommande les MEILLEURES catégories KDP Amazon. KDP permet 3 catégories maximum par format (ebook / broché), tu dois donc identifier les 3 top + 5 alternatives de qualité.

Renvoie exactement ce JSON :

{
  "positionnement": "Résumé en 2 phrases du positionnement idéal de ce livre sur Amazon",
  "top_3_categories": [
    {
      "rang": 1,
      "chemin_complet": "Livres > Catégorie > Sous-catégorie > Sous-sous-catégorie",
      "code_bisac": "code BISAC estimé (ex: FIC027000)",
      "concurrence": "faible|moyenne|forte",
      "volume_estime": "faible|moyen|fort",
      "raison": "Pourquoi cette catégorie est idéale pour ce livre",
      "chance_bestseller": "1-10",
      "requete_kdp": "Terme exact à taper dans KDP lors du choix de catégorie"
    }
  ],
  "categories_alternatives": [
    {"chemin_complet":"...","concurrence":"...","volume_estime":"...","raison":"..."}
  ],
  "categories_a_eviter": [
    {"chemin":"...","pourquoi":"trop saturée / hors sujet / etc"}
  ],
  "mots_cles_backend_suggeres": ["kw1","kw2","kw3","kw4","kw5","kw6","kw7"],
  "conseil_strategique": "Conseil pratique sur comment combiner les 3 catégories choisies pour maximiser les chances de devenir #1 dans une sous-catégorie",
  "gain_temps_estime": "Ex: 5-7 heures économisées vs recherche manuelle",
  "double_chances_bestseller": "Explication concrète de pourquoi ces choix doublent tes chances"
}

Sois précis, chirurgical. Utilise les vrais chemins Amazon existants. Priorise les niches à faible concurrence. Fournis 3 top + 5 alternatives minimum.`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const key = Deno.env.get('LOVABLE_API_KEY');
    if (!key) return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY missing' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const body = (await req.json()) as Body;
    if (!body?.title || !body?.synopsis) {
      return new Response(JSON.stringify({ error: 'Titre et synopsis requis' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
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
