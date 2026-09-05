import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cs-ai.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { callLovableAI, json, jsonError } from '../_shared/cs-ai.ts';

interface WriteRequest {
  project_id: string;
  chapter_id: string;
  chapter_title: string;
  chapter_number: number;
  tone: string;
  language_code: string;
  previous_context?: string;
  /** 'long' allonge les chapitres (outil Ebook Version Longue). */
  target_length?: 'standard' | 'long';
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

  const body = await req.json() as WriteRequest;

  const systemPrompt =
    'Tu es un auteur professionnel expert Amazon KDP. ' +
    'Rédige le chapitre complet en Markdown strict. ' +
    `Langue : ${body.language_code}. Ton : ${body.tone}. ` +
    'Inclus des sections claires, des exemples concrets et un encadré « À retenir » à la fin. ' +
    (body.target_length === 'long'
      ? 'Le chapitre doit faire entre 2500 et 4000 mots. '
      : 'Le chapitre doit faire entre 1500 et 3000 mots. ') +
    'Termine toujours par une phrase complète se terminant par un point.';

  const userPrompt =
    (body.previous_context ? `Contexte du chapitre précédent :\n${body.previous_context}\n\n` : '') +
    `Rédige le chapitre ${body.chapter_number} : ${body.chapter_title}`;

  try {
    const content = await callLovableAI(systemPrompt, userPrompt, 8192);

    // Marque le chapitre comme complété en base
    const { error: updateError } = await supabase
      .from('cs_chapters')
      .update({ content_markdown: content, status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', body.chapter_id);
    if (updateError) console.error('update chapter', updateError);

    return json({ content });
  } catch (e) {
    return jsonError(e.message, 500);
  }
});
