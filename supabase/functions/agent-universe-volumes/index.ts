import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Génère un tome (volume) d'un univers narratif à partir d'une Bible d'univers.
// Utilise Lovable AI Gateway (google/gemini-2.5-flash par défaut).

interface TomeBrief {
  index: number;
  workingTitle?: string;
  goal?: string;
  focusCharacters?: string[];
  keyEvents?: string[];
  cliffhanger?: string;
}

interface UniverseBible {
  title: string;
  genre?: string;
  worldRules?: string;
  narrativeStyle?: string;
  characters?: any;
  locations?: any;
  timeline?: any;
  plotThreads?: any;
  mainThemes?: any;
}

interface RequestBody {
  bible: UniverseBible;
  tome: TomeBrief;
  chaptersPerTome: number;
  tier: 'standard' | 'pro';
  previousTomes?: Array<{ index: number; title: string; synopsis: string }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = (await req.json()) as RequestBody;
    if (!body?.bible || !body?.tome) {
      return new Response(JSON.stringify({ error: 'bible et tome requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY manquante' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isPro = body.tier === 'pro';
    const wordsPerChapter = isPro ? '1500-2500' : '600-1000';
    const chapters = Math.min(body.chaptersPerTome || 10, isPro ? 30 : 15);

    const prevSummary =
      (body.previousTomes || [])
        .map((t) => `- Tome ${t.index} « ${t.title} » : ${t.synopsis}`)
        .join('\n') || '(aucun tome précédent)';

    const sys = `Tu es un auteur professionnel de sagas romanesques. Tu écris en français, style ${
      body.bible.narrativeStyle || 'romanesque immersif'
    }. Tu respectes IMPÉRATIVEMENT la Bible d'univers fournie (règles du monde, timeline, personnages, lieux). Tu ne contredis JAMAIS les tomes précédents. Tu réponds STRICTEMENT en JSON valide, sans texte hors JSON, sans backticks.`;

    const prompt = `BIBLE D'UNIVERS
Titre saga : ${body.bible.title}
Genre : ${body.bible.genre || 'non précisé'}
Règles du monde : ${body.bible.worldRules || '(à respecter comme fournies)'}
Thèmes : ${JSON.stringify(body.bible.mainThemes || [])}
Personnages : ${JSON.stringify(body.bible.characters || [])}
Lieux : ${JSON.stringify(body.bible.locations || [])}
Timeline : ${JSON.stringify(body.bible.timeline || [])}
Fils narratifs : ${JSON.stringify(body.bible.plotThreads || [])}

TOMES PRÉCÉDENTS
${prevSummary}

TOME À ÉCRIRE
Numéro : ${body.tome.index}
Titre de travail : ${body.tome.workingTitle || '(à proposer)'}
Objectif narratif : ${body.tome.goal || 'faire progresser la saga'}
Personnages centraux : ${(body.tome.focusCharacters || []).join(', ') || '(à choisir)'}
Événements clés attendus : ${(body.tome.keyEvents || []).join(' | ') || '(à concevoir)'}
Cliffhanger de fin : ${body.tome.cliffhanger || '(à concevoir, cohérent avec la saga)'}

Génère UN TOME complet, cohérent avec la Bible et les tomes précédents.
Longueur cible par chapitre : ${wordsPerChapter} mots.
Nombre de chapitres : ${chapters}.
${isPro ? 'Ajoute pour chaque chapitre 2 à 4 scènes détaillées (lieu, personnages présents, tension, dialogue clé).' : 'Résume chaque chapitre en un paragraphe dense (pas de scènes détaillées).'}

Réponds STRICTEMENT en JSON avec ce format :
{
  "title": "titre définitif du tome",
  "synopsis": "synopsis long du tome (200-400 mots)",
  "chapters": [
    { "number": 1, "title": "...", "summary": "...", "scenes": [${
      isPro ? '{ "location": "...", "characters": ["..."], "tension": "...", "keyDialogue": "..." }' : ''
    }] }
  ],
  "cliffhanger": "cliffhanger final",
  "hooksNextTome": ["accroche 1", "accroche 2"]
}`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: sys },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) {
        return new Response(JSON.stringify({ error: 'Trop de requêtes, réessayez dans un instant.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (res.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits IA épuisés. Rechargez pour continuer.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'AI gateway error', detail: text.slice(0, 400) }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await res.json();
    const raw: string = data?.choices?.[0]?.message?.content ?? '';
    const cleaned = raw.replace(/^```json\s*|\s*```$/g, '').trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : { title: body.tome.workingTitle || `Tome ${body.tome.index}`, synopsis: cleaned, chapters: [] };
    }

    return new Response(JSON.stringify({ tome: parsed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
