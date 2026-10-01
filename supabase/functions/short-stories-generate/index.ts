// Agent générateur d'histoires courtes & contes illustrés pour KDP.
// Retourne N histoires { title, synopsis, content, illustrationPromptEn, moral } via Lovable AI Gateway.
// - Mémoire anti-doublon : reçoit les titres/synopsis déjà écrits et interdit de les reprendre.
// - Réponse maintenue ouverte (espaces de maintien) pour éviter les coupures réseau sur les longs lots.
// Option generateImages : génère aussi l'illustration via le gateway image.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const GATEWAY = 'https://ai.gateway.lovable.dev/v1/responses';
const MODEL = 'openai/gpt-6-astra';

interface Body {
  bookTitle: string;
  targetAge: '3-6' | '7-12' | 'adultes';
  theme?: string;
  tone?: string;
  count: number;
  wordsPerStory?: number;
  characterBible?: string;
  preset?: string;
  generateImages?: boolean;
  startIndex?: number;
  existingStories?: { title?: string; synopsis?: string }[];
}

type Story = {
  numero: number;
  title: string;
  synopsis: string;
  content: string;
  illustrationPromptEn: string;
  moral: string;
  imageUrl?: string;
};

class GatewayError extends Error {
  constructor(message: string, public status: number) { super(message); }
}

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const auth = req.headers.get('Authorization');
  if (!auth) return json({ error: 'Auth requis' }, 401);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anon = Deno.env.get('SUPABASE_ANON_KEY')!;
  const lovableKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableKey) return json({ error: 'LOVABLE_API_KEY manquante' }, 500);

  const authed = createClient(supabaseUrl, anon, { global: { headers: { Authorization: auth } } });
  const { data: userData } = await authed.auth.getUser();
  if (!userData?.user) return json({ error: 'Non authentifié' }, 401);

  let body: Body;
  try { body = (await req.json()) as Body; } catch { return json({ error: 'Requête invalide' }, 400); }

  // Réponse JSON précédée d'espaces de maintien : la connexion reste active pendant le calcul.
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const keepAlive = setInterval(() => {
        try { controller.enqueue(encoder.encode(' ')); } catch { /* fermé */ }
      }, 10_000);
      let payload: unknown;
      try {
        payload = { stories: await generateStories(body, lovableKey) };
      } catch (e) {
        const status = e instanceof GatewayError ? e.status : 500;
        payload = { error: (e as Error).message, status };
      } finally {
        clearInterval(keepAlive);
      }
      controller.enqueue(encoder.encode(JSON.stringify(payload)));
      controller.close();
    },
  });

  return new Response(stream, {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

async function generateStories(body: Body, lovableKey: string): Promise<Story[]> {
  const count = Math.max(1, Math.min(10, Number(body.count) || 5));
  const words = Math.max(50, Math.min(2500, Number(body.wordsPerStory) || 250));
  const targetAge = body.targetAge || '3-6';
  const generateImages = !!body.generateImages;
  const startIndex = Math.max(0, Number(body.startIndex) || 0);
  const existing = (Array.isArray(body.existingStories) ? body.existingStories : [])
    .filter((s) => s && typeof s.title === 'string' && s.title.trim())
    .slice(-40)
    .map((s) => ({ title: String(s.title).slice(0, 160), synopsis: String(s.synopsis ?? '').slice(0, 240) }));

  const ageBlock = targetAge === '3-6'
    ? `Public : maternelle 3-6 ans. Histoires du soir très courtes, rassurantes, positives, avec une petite leçon de vie douce. Phrases simples, vocabulaire adapté à l'âge. Environ ${words} mots (±15%).`
    : targetAge === '7-12'
      ? `Public : jeunesse 7-12 ans. Contes aventureux ou mystérieux, personnages attachants, rebondissements adaptés. Environ ${words} mots (±15%).`
      : `Public : adultes. Nouvelles, contes philosophiques, feel-good ou réflexifs. Environ ${words} mots (±15%).`;

  const toneBlock = body.tone ? `\nTON À RESPECTER STRICTEMENT : ${body.tone}` : '';
  const themeBlock = body.theme ? `\nThème / fil rouge du livre : ${body.theme}` : '';
  const charBlock = body.characterBible ? `\nPersonnage(s) récurrent(s) : ${body.characterBible}` : '';
  const presetBlock = body.preset ? `\nPreset éditorial : ${body.preset}` : '';

  const memoryBlock = existing.length
    ? `\n\nHISTOIRES DÉJÀ ÉCRITES DANS CE LIVRE (INTERDIT de les reprendre, même reformulées) :
${existing.map((s, i) => `${i + 1}. ${s.title}${s.synopsis ? ` — ${s.synopsis}` : ''}`).join('\n')}

Règles anti-doublon :
- Aucun titre identique ou proche (pas de variante avec les mêmes mots-clés : même objet, même lieu, même événement).
- Chaque nouvelle histoire doit avoir un lieu principal, un enjeu et un événement absents de la liste ci-dessus.
- Explore des situations nouvelles autour du thème plutôt que de répéter les scènes évidentes.`
    : '';

  const instructions = `Tu es un auteur de contes et d'histoires courtes pour le marché KDP francophone.
${ageBlock}
Chaque histoire doit être entièrement en français. INTERDICTIONS : latin, pseudo-langues, mots inventés, mots étrangers décoratifs.
Chaque histoire se termine par une phrase complète avec un point.
Réponds UNIQUEMENT en JSON valide, sans texte autour, sous la forme:
{"stories":[{"title":"...","synopsis":"...","content":"...","illustrationPromptEn":"...","moral":"..."}, ...]}
- title : titre court, accrocheur, en français, unique dans le livre.
- synopsis : 1-2 phrases décrivant UNE scène visuelle claire (lieu, action, émotion) — servira à l'illustration.
- content : le texte complet de l'histoire (~${words} mots), prêt à imprimer, sans titre répété.
- illustrationPromptEn : prompt optimisé en anglais pour générer une illustration de l'histoire (style line art / coloriage ou scène narrative selon le contexte), 30-60 mots.
- moral : une courte morale ou message positif (1 phrase).${toneBlock}`;

  const input = `Livre : "${body.bookTitle || 'Histoires courtes & contes illustrés'}"${themeBlock}${charBlock}${presetBlock}

Génère exactement ${count} histoires DIFFÉRENTES entre elles et cohérentes avec le livre.
Elles seront numérotées à partir de ${startIndex + 1} dans le sommaire final.
Varie les lieux, les situations et les émotions. Texte 100 % français.${memoryBlock}`;

  const raw = await callResponses(lovableKey, instructions, input);
  const m = raw.match(/\{[\s\S]*\}/);
  if (!m) throw new GatewayError('Réponse IA illisible — ce lot va être relancé.', 502);

  let parsed: { stories?: { title: string; synopsis: string; content?: string; illustrationPromptEn?: string; moral?: string }[] };
  try { parsed = JSON.parse(m[0]); } catch { throw new GatewayError('Réponse IA incomplète — ce lot va être relancé.', 502); }

  const seen = new Set(existing.map((s) => normalize(s.title)));
  const fresh = (parsed.stories || []).filter((s) => {
    if (!s?.title || !s?.synopsis) return false;
    const key = normalize(s.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  let stories: Story[] = fresh.slice(0, count).map((s, i) => ({
    numero: startIndex + i + 1,
    title: s.title,
    synopsis: s.synopsis,
    content: s.content || '',
    illustrationPromptEn: s.illustrationPromptEn || '',
    moral: s.moral || '',
  }));

  if (generateImages && stories.length > 0) {
    stories = await Promise.all(stories.map(async (s) => {
      if (!s.illustrationPromptEn) return { ...s, imageUrl: '' };
      try {
        const imgRes = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${lovableKey}` },
          body: JSON.stringify({ model: 'google/gemini-3.1-flash-image', prompt: s.illustrationPromptEn, n: 1, size: '1024x1024' }),
        });
        if (!imgRes.ok) return { ...s, imageUrl: '' };
        const imgJ = await imgRes.json();
        return { ...s, imageUrl: imgJ?.data?.[0]?.url || '' };
      } catch {
        return { ...s, imageUrl: '' };
      }
    }));
  }

  return stories;
}

/** Appel en continu à la passerelle IA ; renvoie le texte final assemblé. */
async function callResponses(apiKey: string, instructions: string, input: string): Promise<string> {
  const res = await fetch(GATEWAY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': apiKey, 'X-Lovable-AIG-SDK': 'fetch' },
    body: JSON.stringify({
      model: MODEL,
      instructions,
      input,
      stream: true,
      store: false,
      reasoning: { effort: 'low', summary: 'auto' },
      include: ['reasoning.encrypted_content'],
    }),
  });

  if (!res.ok || !res.body) {
    const txt = await res.text().catch(() => '');
    let msg = txt.slice(0, 300);
    try { msg = JSON.parse(txt)?.error?.message ?? JSON.parse(txt)?.message ?? msg; } catch { /* brut */ }
    const fr = res.status === 429
      ? 'Trop de demandes en même temps, nouvelle tentative dans quelques secondes.'
      : res.status === 402
        ? 'Crédits IA épuisés sur l’espace de travail.'
        : `Service IA indisponible (${res.status}) : ${msg}`;
    throw new GatewayError(fr, res.status);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let text = '';
  let finalText = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx: number;
    while ((idx = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const dataLine = frame.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).trim()).join('');
      if (!dataLine || dataLine === '[DONE]') continue;
      let evt: any;
      try { evt = JSON.parse(dataLine); } catch { continue; }
      if (evt.type === 'response.output_text.delta' && typeof evt.delta === 'string') text += evt.delta;
      else if (evt.type === 'response.output_text.done' && typeof evt.text === 'string') finalText += evt.text;
      else if (evt.type === 'response.failed' || evt.type === 'error') {
        const msg = evt.response?.error?.message ?? evt.error?.message ?? evt.message ?? 'Erreur IA';
        throw new GatewayError(`Erreur IA : ${msg}`, 502);
      } else if (evt.type === 'response.refusal.done' || evt.type === 'response.refusal.delta') {
        throw new GatewayError('Le service IA a refusé cette demande.', 403);
      }
    }
  }
  const out = (finalText || text).trim();
  if (!out) throw new GatewayError('Réponse IA vide — ce lot va être relancé.', 502);
  return out;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
