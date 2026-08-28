import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { callLovableAIJson, corsHeaders, json, jsonError } from '../_shared/cs-ai.ts';

interface ImportRequest {
  text: string;
  source_kind: 'book' | 'video' | 'article';
  language_code?: string;
}

interface ImportResult {
  title: string;
  subtitle: string;
  target_audience: string;
  tone: 'professional' | 'inspiring' | 'informative' | 'storytelling';
}

/** Déduit les métadonnées d'un projet ContentStudio depuis un contenu importé. */
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return jsonError('Méthode non autorisée', 405);

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return jsonError('Non authentifié', 401);

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY') || Deno.env.get('SUPABASE_PUBLISHABLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (authError || !user) return jsonError('Session invalide', 401);

  const body = await req.json() as ImportRequest;
  const text = (body.text || '').slice(0, 12000);
  if (text.trim().length < 100) return jsonError('Contenu importé trop court.', 400);

  const kindLabel = body.source_kind === 'video'
    ? 'une transcription de vidéo'
    : body.source_kind === 'article'
      ? 'un article de blog'
      : 'un manuscrit de livre';

  try {
    const result = await callLovableAIJson<ImportResult>(
      'Tu es un éditeur Amazon KDP. Tu analyses un contenu importé et proposes les métadonnées ' +
        `d'un projet éditorial. Langue : ${body.language_code || 'fr'}.`,
      `Voici ${kindLabel} :\n\n"""${text}"""\n\n` +
        'Réponds avec un JSON de forme : ' +
        '{"title":"...","subtitle":"...","target_audience":"...","tone":"professional|inspiring|informative|storytelling"}',
      1024,
    );
    return json({
      title: (result.title || '').slice(0, 160),
      subtitle: (result.subtitle || '').slice(0, 200),
      target_audience: (result.target_audience || '').slice(0, 200),
      tone: result.tone || 'informative',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erreur inconnue';
    if (msg.includes('CREDITS_EXHAUSTED')) return jsonError('Crédits IA épuisés.', 402);
    console.error('cs-import-source', msg);
    return jsonError(`Analyse impossible : ${msg}`, 500);
  }
});
