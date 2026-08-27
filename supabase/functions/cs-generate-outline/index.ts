import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { callLovableAIJson, json, jsonError } from '../_shared/cs-ai.ts';

interface OutlineRequest {
  title: string;
  subtitle?: string;
  target_audience?: string;
  tone: string;
  language_code: string;
  chapters_count: number;
}

interface OutlineChapter {
  chapter_number: number;
  title: string;
  key_takeaways: string[];
}

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

  const body = await req.json() as OutlineRequest;
  const chaptersCount = Math.min(Math.max(body.chapters_count || 10, 3), 40);

  const systemPrompt =
    'Tu es un architecte éditorial expert Amazon KDP. ' +
    `Langue : ${body.language_code}. Ton : ${body.tone}. ` +
    'Tu construis un plan de chapitres cohérent et progressif pour un livre.';

  const userPrompt =
    `Titre : ${body.title}\n` +
    (body.subtitle ? `Sous-titre : ${body.subtitle}\n` : '') +
    (body.target_audience ? `Public cible : ${body.target_audience}\n` : '') +
    `Nombre de chapitres souhaité : ${chaptersCount}\n\n` +
    `Génère un plan de ${chaptersCount} chapitres. ` +
    'Réponds avec un JSON de forme : ' +
    '{"chapters":[{"chapter_number":1,"title":"...","key_takeaways":["...","..."]}]}';

  try {
    const result = await callLovableAIJson<{ chapters: OutlineChapter[] }>(
      systemPrompt,
      userPrompt,
      4096,
    );
    const chapters = (result.chapters || []).slice(0, chaptersCount);
    return json({ chapters });
  } catch (e) {
    return jsonError(e.message, 500);
  }
});
