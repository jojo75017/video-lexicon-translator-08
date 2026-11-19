import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { readerSignupSchema } from './validation.ts';

const reply = (status: number, body: object) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return reply(405, { error: 'Méthode non autorisée.' });
  try {
    const raw = await req.text();
    if (raw.length > 2048) return reply(413, { error: 'Formulaire trop volumineux.' });
    let body;
    try { body = JSON.parse(raw); } catch { return reply(400, { error: 'Formulaire invalide.' }); }
    const parsed = readerSignupSchema.safeParse(body);
    if (!parsed.success) return reply(400, { error: 'Vérifiez votre adresse e-mail et votre consentement.' });
    if (parsed.data.website) return reply(200, { ok: true });
    const url = Deno.env.get('SUPABASE_URL');
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !key) return reply(503, { error: 'Inscription temporairement indisponible.' });
    const db = createClient(url, key);
    // Public collection only: no account changes, provider calls or email sending.
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('cf-connecting-ip') || 'unknown';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${key}:${ip}`));
    const bucket = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
    const { data: allowed, error: limitError } = await db.rpc('claim_book_reader_attempt', { p_key: bucket });
    if (limitError) return reply(503, { error: 'Inscription temporairement indisponible.' });
    if (!allowed) return reply(429, { error: 'Trop de tentatives. Réessayez dans une heure.' });
    const { error } = await db.from('book_reader_signups').upsert({
      book_slug: parsed.data.book_slug,
      email: parsed.data.email,
      first_name: parsed.data.first_name || null,
      consent_version: 'book-news-2026-11-19',
    }, { onConflict: 'book_slug,email', ignoreDuplicates: true });
    if (error) return reply(503, { error: 'L’inscription n’a pas été enregistrée. Réessayez plus tard.' });
    return reply(200, { ok: true });
  } catch {
    return reply(503, { error: 'Inscription temporairement indisponible.' });
  }
});