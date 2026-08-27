import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, jsonError } from '../_shared/cs-ai.ts';

interface CoverRequest {
  project_id: string;
  title: string;
  subtitle?: string;
  target_audience?: string;
  tone: string;
  language_code: string;
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

  const body = await req.json() as CoverRequest;
  const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
  if (!lovableApiKey) return jsonError('Backend IA non configuré', 500);

  const prompt =
    `Couverture de livre professionnelle, style maison d'édition, format portrait Kindle. ` +
    `Titre : « ${body.title} ». ` +
    (body.subtitle ? `Sous-titre : « ${body.subtitle} ». ` : '') +
    (body.target_audience ? `Public : ${body.target_audience}. ` : '') +
    `Ton : ${body.tone}. ` +
    `Texte du titre lisible, typographie soignée, pas de cartoon, photoréaliste. ` +
    `Langue du titre : ${body.language_code}.`;

  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/images/generations', {
      method: 'POST',
      headers: {
        'Lovable-API-Key': lovableApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-image-2',
        prompt,
        quality: 'low',
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`cover gen error ${response.status}: ${errText}`);
      if (response.status === 402) return jsonError('CREDITS_EXHAUSTED', 402);
      return jsonError(`Génération échouée (${response.status})`, 502);
    }

    // Lecture du stream SSE pour récupérer l'URL de l'image
    const text = await response.text();
    let imageUrl: string | null = null;
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      try {
        const evt = JSON.parse(trimmed.slice(5));
        if (evt.type === 'image.completed' && evt.image?.url) imageUrl = evt.image.url;
        if (evt.url) imageUrl = evt.url;
      } catch { /* ignore */ }
    }

    if (!imageUrl) return jsonError('Aucune image reçue', 502);

    // Télécharge l'image et la stocke dans le bucket contentstudio
    const imgRes = await fetch(imageUrl);
    const imgBlob = await imgRes.blob();
    const path = `${user.id}/${body.project_id}/cover-${Date.now()}.png`;
    const { error: uploadError } = await supabase.storage
      .from('contentstudio')
      .upload(path, imgBlob, { contentType: 'image/png' });

    if (uploadError) {
      console.error('upload cover', uploadError);
      return jsonError('Image générée mais stockage échoué', 500);
    }

    const { data: urlData } = supabase.storage.from('contentstudio').getPublicUrl(path);
    // Bucket privé → URL signée
    const { data: signed, error: signError } = await supabase.storage
      .from('contentstudio')
      .createSignedUrl(path, 3600);

    const finalUrl = signed?.signedUrl || urlData?.publicUrl || imageUrl;

    // Persiste l'URL sur le projet
    await supabase
      .from('cs_projects')
      .update({ cover_image_url: path, updated_at: new Date().toISOString() })
      .eq('id', body.project_id);

    return json({ cover_url: finalUrl, storage_path: path });
  } catch (e) {
    return jsonError(e.message, 500);
  }
});
