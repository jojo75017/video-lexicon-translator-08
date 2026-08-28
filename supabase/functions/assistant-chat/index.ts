import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * Assistant Ebookstudio — répond aux questions des abonnés et propose
 * 1 à 3 boutons d'action qui ouvrent directement le bon onglet de la plateforme.
 * Sortie structurée : { reply: string, actions: [{ label, route }] }
 */

interface CatalogItem { label: string; route: string }

const MODEL_PRIMARY = 'google/gemini-2.5-flash';
const MODEL_FALLBACK = 'google/gemini-2.5-flash-lite';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const schema = {
  type: 'object',
  additionalProperties: false,
  required: ['reply', 'actions'],
  properties: {
    reply: { type: 'string' },
    actions: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['label', 'route'],
        properties: { label: { type: 'string' }, route: { type: 'string' } },
      },
    },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return jsonResponse({ error: 'LOVABLE_API_KEY manquante' }, 500);

    const body = await req.json().catch(() => null);
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    const catalog: CatalogItem[] = Array.isArray(body?.catalog) ? body.catalog.slice(0, 120) : [];
    if (!messages || messages.length === 0) {
      return jsonResponse({ error: 'messages requis' }, 400);
    }

    const cleanHistory = messages
      .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .slice(-12)
      .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

    const catalogText = catalog
      .filter((c) => typeof c?.label === 'string' && typeof c?.route === 'string')
      .map((c) => `- ${c.label} => ${c.route}`)
      .join('\n');

    const systemPrompt = `Tu es l'assistant officiel d'Ebookstudio (plateforme française de création de livres et de publication Amazon KDP).

RÈGLES ABSOLUES
- Réponds TOUJOURS en français correct. Jamais de latin, de faux latin, de pseudo-langue ni de mots inventés.
- 3 à 6 lignes maximum, ton chaleureux, direct, concret. Pas de blabla marketing.
- Chaque réponse doit orienter l'abonné vers l'endroit exact de la plateforme qui résout sa question.
- Tu proposes 1 à 3 actions, choisies UNIQUEMENT dans le catalogue ci-dessous, en recopiant la route exactement. N'invente jamais une route.
- Si la question ne concerne pas la plateforme, réponds brièvement et propose l'action la plus proche.
- Tarifs actuels : Plume 27 €/mois (270 €/an) et Édition 47 €/mois (470 €/an) — il n'existe que ces deux forfaits, 2 mois offerts en annuel, -20 % à vie pour les anciens clients V2. N'annonce aucun autre tarif.
- Maximum 40 chapitres par livre.
- Erreur « Non authentifié » = session expirée : recharger la page puis relancer l'étape.
- Erreur « limite de requêtes » = quota de la clé Gemini : attendre une minute, la plateforme bascule sur l'IA incluse.

CATALOGUE DES DESTINATIONS
${catalogText}`;

    const callModel = async (model: string) =>
      fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'system', content: systemPrompt }, ...cleanHistory],
          response_format: {
            type: 'json_schema',
            json_schema: { name: 'assistant_reply', strict: true, schema },
          },
        }),
      });

    let resp = await callModel(MODEL_PRIMARY);
    if (resp.status === 429 || resp.status >= 500) {
      resp = await callModel(MODEL_FALLBACK);
    }

    if (!resp.ok) {
      const text = await resp.text();
      console.error(`assistant-chat gateway error [${resp.status}]: ${text}`);
      return jsonResponse({ error: 'Assistant indisponible', status: resp.status, details: text }, resp.status);
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content ?? '';
    let parsed: { reply?: string; actions?: CatalogItem[] } = {};
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = { reply: typeof raw === 'string' ? raw : '', actions: [] };
    }

    const allowed = new Set(catalog.map((c) => c.route));
    const actions = (parsed.actions ?? [])
      .filter((a) => a && typeof a.label === 'string' && typeof a.route === 'string' && allowed.has(a.route))
      .slice(0, 3);

    return jsonResponse({ reply: parsed.reply ?? '', actions });
  } catch (err) {
    console.error('assistant-chat error', err);
    return jsonResponse({ error: err instanceof Error ? err.message : 'Erreur inconnue' }, 500);
  }
});
