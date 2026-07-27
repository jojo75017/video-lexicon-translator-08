const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/** Réduit un HTML à du texte lisible : supprime scripts/styles/nav/footer, garde titres et paragraphes. */
function htmlToText(html: string): { title: string; content: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i);
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const title = (ogTitle?.[1] || h1?.[1] || titleMatch?.[1] || 'Article').replace(/<[^>]+>/g, '').trim();

  let body = html;
  // Isole <article> ou <main> quand présent (Readability-lite).
  const article = body.match(/<article[\s\S]*?<\/article>/i) || body.match(/<main[\s\S]*?<\/main>/i);
  if (article) body = article[0];

  body = body
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<(nav|footer|header|aside|form)[\s\S]*?<\/\1>/gi, '')
    .replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_m, l, t) => `\n\n${'#'.repeat(Math.min(3, Number(l)))} ${t.replace(/<[^>]+>/g, '').trim()}\n\n`)
    .replace(/<(p|div|li|br)[^>]*>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { title, content: body };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const { url } = await req.json().catch(() => ({}));
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return new Response(JSON.stringify({ error: 'URL invalide' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EbookStudioBot/1.0)', Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
    });
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: `La page a répondu ${resp.status}` }), { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const html = await resp.text();
    const { title, content } = htmlToText(html);
    if (content.length < 200) {
      return new Response(JSON.stringify({ error: 'Contenu trop court ou page dynamique (JavaScript requis).' }), { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ title, content }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Erreur inconnue' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
