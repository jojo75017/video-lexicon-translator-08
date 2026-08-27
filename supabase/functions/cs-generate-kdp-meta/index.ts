import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { callLovableAIJson, json, jsonError } from '../_shared/cs-ai.ts';

interface KdpMetaRequest {
  project_id: string;
  title: string;
  subtitle?: string;
  target_audience?: string;
  chapters_titles: string[];
  language_code: string;
}

interface KdpMeta {
  kdp_description: string;
  kdp_keywords: string[];
  kdp_categories: string[];
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

  const body = await req.json() as KdpMetaRequest;

  const systemPrompt =
    'Tu es un expert marketing Amazon KDP. ' +
    `Langue : ${body.language_code}. ` +
    'Génère une description de vente (blurb) optimisée KDP, 7 mots-clés backend ' +
    'et 3 catégories KDP pertinentes.';

  const userPrompt =
    `Titre : ${body.title}\n` +
    (body.subtitle ? `Sous-titre : ${body.subtitle}\n` : '') +
    (body.target_audience ? `Public : ${body.target_audience}\n` : '') +
    `Plan des chapitres : ${body.chapters_titles.join(', ')}\n\n` +
    'Réponds avec un JSON de forme : ' +
    '{"kdp_description":"...","kdp_keywords":["mot1","mot2",...],"kdp_categories":["Cat1","Cat2","Cat3"]}';

  try {
    const result = await callLovableAIJson<KdpMeta>(systemPrompt, userPrompt, 2048);

    // Persiste les métadonnées sur le projet
    await supabase
      .from('cs_projects')
      .update({
        kdp_description: result.kdp_description,
        kdp_keywords: result.kdp_keywords,
        kdp_categories: result.kdp_categories,
        updated_at: new Date().toISOString(),
      })
      .eq('id', body.project_id);

    return json(result);
  } catch (e) {
    return jsonError(e.message, 500);
  }
});
