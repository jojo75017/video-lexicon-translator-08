import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/** Recherche de photos libres de droits (Unsplash + Pixabay) avec les clés du projet. */
interface Photo { id: string; source: 'unsplash' | 'pixabay'; thumb: string; full: string; width: number; height: number; author: string; link: string; download?: string }

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const auth = req.headers.get('Authorization');
  if (!auth) return json({ error: 'Connectez-vous pour chercher des photos.' }, 401);
  const client = createClient(Deno.env.get('SUPABASE_URL') || '', Deno.env.get('SUPABASE_ANON_KEY') || '', { global: { headers: { Authorization: auth } } });
  const { data: u, error: ae } = await client.auth.getUser();
  if (ae || !u.user) return json({ error: 'Votre session a expiré. Reconnectez-vous.' }, 401);

  let body: { query?: unknown; orientation?: unknown; track?: unknown };
  try { body = await req.json(); } catch { return json({ error: 'Requête invalide.' }, 400); }
  const unsplashKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
  const pixabayKey = Deno.env.get('PIXABAY_API_KEY');

  // Suivi de téléchargement exigé par Unsplash quand une photo est choisie.
  if (typeof body.track === 'string') {
    if (unsplashKey && body.track.startsWith('https://api.unsplash.com/')) {
      await fetch(body.track, { headers: { Authorization: `Client-ID ${unsplashKey}` } }).catch(() => null);
    }
    return json({ ok: true });
  }

  const query = typeof body.query === 'string' ? body.query.trim().slice(0, 100) : '';
  if (!query) return json({ error: 'Indiquez des mots-clés.' }, 400);
  const orientation = body.orientation === 'landscape' ? 'landscape' : 'portrait';
  if (!unsplashKey && !pixabayKey) return json({ error: 'Aucune clé Unsplash ou Pixabay n’est configurée.' }, 503);

  const photos: Photo[] = [];
  const errors: string[] = [];
  const tasks: Promise<void>[] = [];
  if (unsplashKey) tasks.push((async () => {
    const r = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=${orientation}&content_filter=high`, { headers: { Authorization: `Client-ID ${unsplashKey}`, 'Accept-Version': 'v1' } });
    if (!r.ok) { errors.push(`Unsplash ${r.status}`); return; }
    const d = await r.json();
    for (const p of d.results ?? []) photos.push({ id: `u-${p.id}`, source: 'unsplash', thumb: p.urls?.small, full: p.urls?.regular ? `${p.urls.raw}&w=2400&q=85&fm=jpg` : p.urls?.full, width: p.width, height: p.height, author: p.user?.name ?? 'Unsplash', link: `${p.links?.html}?utm_source=ebookstudio&utm_medium=referral`, download: p.links?.download_location });
  })());
  if (pixabayKey) tasks.push((async () => {
    const r = await fetch(`https://pixabay.com/api/?key=${pixabayKey}&q=${encodeURIComponent(query)}&lang=fr&image_type=photo&orientation=${orientation === 'portrait' ? 'vertical' : 'horizontal'}&safesearch=true&per_page=12`);
    if (!r.ok) { errors.push(`Pixabay ${r.status}`); return; }
    const d = await r.json();
    for (const p of d.hits ?? []) photos.push({ id: `p-${p.id}`, source: 'pixabay', thumb: p.webformatURL, full: p.largeImageURL, width: p.imageWidth, height: p.imageHeight, author: p.user ?? 'Pixabay', link: p.pageURL });
  })());
  await Promise.all(tasks.map((t) => t.catch((e) => { errors.push(String(e?.message ?? e)); })));
  if (!photos.length && errors.length) return json({ error: `Recherche impossible (${errors.join(', ')}).` }, 502);
  return json({ photos });
});
