import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
}

async function readResponseText(response: Response): Promise<string> {
  if (!response.body) return '';
  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  let output = '';
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    for (const line of chunk.value.split('\n')) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw || raw === '[DONE]') continue;
      try {
        const event = JSON.parse(raw);
        if (event.type === 'error') throw new Error(event.error?.message || 'Erreur IA');
        if (event.type === 'response.output_text.delta' && typeof event.delta === 'string') output += event.delta;
      } catch (error) {
        if (error instanceof SyntaxError) continue;
        throw error;
      }
    }
  }
  return output;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const authorization = req.headers.get('Authorization');
    if (!authorization) return json({ error: 'Connexion requise.' }, 401);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const client = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data } = await client.auth.getUser();
    if (!data.user) return json({ error: 'Session expirée.' }, 401);
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) return json({ error: 'Le moteur d’écriture n’est pas configuré.' }, 500);

    const body = await req.json();
    const pageCount = [16, 20, 24, 28, 30].includes(Number(body.pageCount)) ? Number(body.pageCount) : 24;
    if (!body.title || !body.pitch || !Array.isArray(body.characters) || body.characters.length === 0) return json({ error: 'Titre, histoire et personnage requis.' }, 400);
    const prompt = `Tu es un auteur et directeur artistique français spécialisé dans les vrais albums illustrés pour enfants de ${body.targetAge || '3-6 ans'}.
Crée UNE SEULE HISTOIRE CONTINUE intitulée « ${body.title} », découpée en exactement ${pageCount} pages intérieures.
Pitch imposé: ${body.pitch}
Message ou morale: ${body.moral || 'une fin positive et rassurante'}
Personnages: ${JSON.stringify(body.characters)}

Règles strictes:
- français naturel uniquement;
- 1 à 3 phrases courtes par page, adaptées à la lecture à voix haute;
- progression chronologique sans ellipse incompréhensible;
- début, problème, péripéties graduelles, résolution et fin rassurante;
- chaque scène décrit précisément le décor, l’action, l’émotion, la lumière et les personnages présents;
- aucun nouveau personnage principal non demandé;
- les vêtements, couleurs et signes distinctifs ne changent jamais;
- chaque page apporte une action nouvelle, sans répétition;
- retourne uniquement un JSON valide, sans markdown.

Format exact: {"pages":[{"pageNumber":1,"text":"...","scene":"...","characters":["Nom exact"]}]}
Le tableau pages doit contenir exactement ${pageCount} objets numérotés de 1 à ${pageCount}.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': apiKey,
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        input: prompt,
        stream: true,
        store: false,
        reasoning: { effort: 'medium', summary: 'auto' },
        include: ['reasoning.encrypted_content'],
      }),
    });
    if (!response.ok) {
      const details = await response.text();
      return json({ error: details.slice(0, 500) || 'La création des pages a échoué.' }, response.status);
    }
    const text = await readResponseText(response);
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return json({ error: 'Le découpage reçu est illisible. Relancez la création.' }, 502);
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed.pages) || parsed.pages.length !== pageCount) return json({ error: `Le moteur a produit ${parsed.pages?.length || 0} pages au lieu de ${pageCount}. Relancez la création.` }, 502);
    return json({ pages: parsed.pages });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Erreur inconnue.' }, 500);
  }
});