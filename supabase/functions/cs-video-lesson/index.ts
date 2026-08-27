import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { callLovableAIJson, json, jsonError } from '../_shared/cs-ai.ts';

interface VideoLessonRequest {
  chapter_id: string;
  project_id: string;
  chapter_title: string;
  chapter_content: string;
  tone: string;
  language_code: string;
}

interface Slide {
  slideNumber: number;
  layout: 'title' | 'bullets' | 'comparison' | 'stat' | 'quote';
  title: string;
  bulletPoints?: string[];
  visualPrompt?: string;
}

interface VideoLesson {
  video_title: string;
  script_hook: string;
  script_core: string;
  script_action: string;
  slides: Slide[];
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

  const body = await req.json() as VideoLessonRequest;

  const systemPrompt =
    'Tu es un scénariste de formation vidéo expert, style Loquy / Masterclass. ' +
    `Langue : ${body.language_code}. Ton : ${body.tone}. ` +
    'Transforme un chapitre de livre en une leçon vidéo structurée.';

  const userPrompt =
    `Titre du chapitre : ${body.chapter_title}\n\n` +
    `Contenu du chapitre :\n${body.chapter_content.slice(0, 6000)}\n\n` +
    'Génère une leçon vidéo avec : un titre vidéo accrocheur, un script en 3 blocs ' +
    '(accroche / cœur / passage à l\'action) et 5 à 8 slides. ' +
    'Réponds avec un JSON de forme : ' +
    '{"video_title":"...","script_hook":"...","script_core":"...","script_action":"...","slides":[{"slideNumber":1,"layout":"title","title":"...","bulletPoints":["..."],"visualPrompt":"..."}]}';

  try {
    const lesson = await callLovableAIJson<VideoLesson>(systemPrompt, userPrompt, 4096);

    // Persiste la leçon vidéo (upsert sur chapter_id)
    const { data: existing } = await supabase
      .from('cs_video_lessons')
      .select('id')
      .eq('chapter_id', body.chapter_id)
      .maybeSingle();

    const payload = {
      chapter_id: body.chapter_id,
      video_title: lesson.video_title,
      script_hook: lesson.script_hook,
      script_core: lesson.script_core,
      script_action: lesson.script_action,
      slides_json: lesson.slides,
      updated_at: new Date().toISOString(),
    };

    if (existing?.id) {
      await supabase.from('cs_video_lessons').update(payload).eq('id', existing.id);
    } else {
      await supabase.from('cs_video_lessons').insert({ ...payload, created_at: new Date().toISOString() });
    }

    return json(lesson);
  } catch (e) {
    return jsonError(e.message, 500);
  }
});
