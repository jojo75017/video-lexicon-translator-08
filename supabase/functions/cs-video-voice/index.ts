import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cs-ai.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { json, jsonError } from '../_shared/cs-ai.ts';

interface VoiceRequest {
  chapter_id: string;
  project_id: string;
  video_title: string;
  script_hook: string;
  script_core: string;
  script_action: string;
  language_code: string;
}

const VOICE_ID_BY_LANG: Record<string, string> = {
  fr: 'EXAVITQu4vr4xnSDxMaL', // Sarah — français
  en: 'JBFqnCBsd6RMkjVDRZzb', // George
  es: 'EXAVITQu4vr4xnSDxMaL',
  de: 'EXAVITQu4vr4xnSDxMaL',
};

/** Découpe un texte long en segments < 5000 caractères sur les fins de phrase. */
function chunkText(text: string, maxLen = 4500): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).length > maxLen) {
      if (current) chunks.push(current.trim());
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text];
}

/** Concatène des ArrayBuffer MP3. */
function concatMp3(buffers: ArrayBuffer[]): Uint8Array {
  const total = buffers.reduce((sum, b) => sum + b.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const b of buffers) {
    out.set(new Uint8Array(b), offset);
    offset += b.byteLength;
  }
  return out;
}

/** Génère un VTT simple à partir des segments (durée approximative par segment). */
function buildVtt(segments: { text: string }[], wordsPerSecond = 2.5): string {
  const lines: string[] = ['WEBVTT', ''];
  let start = 0;
  segments.forEach((seg, i) => {
    const words = seg.text.split(/\s+/).length;
    const duration = Math.max(2, Math.round(words / wordsPerSecond));
    const end = start + duration;
    const fmt = (s: number) => {
      const m = Math.floor(s / 60);
      const sec = (s % 60).toFixed(0).padStart(2, '0');
      return `00:${String(m).padStart(2, '0')}:${sec}`;
    };
    lines.push(`${i + 1}`);
    lines.push(`${fmt(start)} --> ${fmt(end)}`);
    lines.push(seg.text);
    lines.push('');
    start = end;
  });
  return lines.join('\n');
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

  const body = await req.json() as VoiceRequest;
  // Voix off : IA intégrée (Lovable AI) par défaut. ElevenLabs seulement si une
  // vraie clé API est présente (les clés valides commencent par « sk_ » ; un ID
  // de clé est refusé par ElevenLabs avec une erreur d'authentification).
  const rawElevenKey = Deno.env.get('ELEVENLABS_API_KEY') || '';
  const elevenKey = rawElevenKey.startsWith('sk_') ? rawElevenKey : '';
  const lovableKey = Deno.env.get('LOVABLE_API_KEY') || '';
  if (!elevenKey && !lovableKey) return jsonError('Aucun moteur de voix off configuré côté serveur', 500);

  const voiceId = VOICE_ID_BY_LANG[body.language_code] || VOICE_ID_BY_LANG.fr;
  const fullScript = [body.script_hook, body.script_core, body.script_action]
    .filter(Boolean)
    .join('\n\n');

  const segments = chunkText(fullScript);
  const audioBuffers: ArrayBuffer[] = [];

  /** Synthèse d'un segment via la passerelle IA intégrée (MP3). */
  async function speakWithLovable(text: string): Promise<ArrayBuffer> {
    const res = await fetch('https://ai.gateway.lovable.dev/v1/audio/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini-tts',
        input: text,
        voice: 'alloy',
        response_format: 'mp3',
        instructions: 'Voix de formation professionnelle, chaleureuse, rythme posé, en français.',
      }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => '');
      console.error(`Lovable TTS ${res.status}: ${err.slice(0, 400)}`);
      throw new Error(
        res.status === 402
          ? 'Crédits IA épuisés : rechargez vos crédits pour générer la voix off.'
          : `Voix off échouée (${res.status}).`,
      );
    }
    return await res.arrayBuffer();
  }

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const previousText = i > 0 ? segments[i - 1].slice(0, 500) : undefined;
    const nextText = i < segments.length - 1 ? segments[i + 1].slice(0, 500) : undefined;

    try {
      if (!elevenKey) {
        audioBuffers.push(await speakWithLovable(seg));
        continue;
      }

      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': elevenKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: seg,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.4, use_speaker_boost: true },
            ...(previousText ? { previous_text: previousText } : {}),
            ...(nextText ? { next_text: nextText } : {}),
          }),
        },
      );
      if (!res.ok) {
        const err = await res.text();
        console.error(`ElevenLabs TTS ${res.status}: ${err.slice(0, 400)}`);
        if (!lovableKey) return jsonError(`Voix off échouée (${res.status})`, 502);
        audioBuffers.push(await speakWithLovable(seg));
        continue;
      }
      audioBuffers.push(await res.arrayBuffer());
    } catch (e) {
      return jsonError((e as Error).message || 'Voix off échouée', 502);
    }
  }


  const mp3 = concatMp3(audioBuffers);
  const mp3Path = `${user.id}/${body.project_id}/${body.chapter_id}/voice.mp3`;
  const vttPath = `${user.id}/${body.project_id}/${body.chapter_id}/subtitles.vtt`;

  const { error: mp3Err } = await supabase.storage
    .from('contentstudio')
    .upload(mp3Path, mp3.buffer, { contentType: 'audio/mpeg', upsert: true });
  if (mp3Err) return jsonError('Stockage MP3 échoué', 500);

  const vtt = buildVtt(segments.map((t) => ({ text: t })));
  const { error: vttErr } = await supabase.storage
    .from('contentstudio')
    .upload(vttPath, new TextEncoder().encode(vtt), { contentType: 'text/vtt', upsert: true });
  if (vttErr) return jsonError('Stockage sous-titres échoué', 500);

  const { data: audioSigned } = await supabase.storage.from('contentstudio').createSignedUrl(mp3Path, 3600);
  const { data: vttSigned } = await supabase.storage.from('contentstudio').createSignedUrl(vttPath, 3600);

  // Durée approximative (MP3 128kbps ~ 16000 bytes/sec)
  const durationSeconds = Math.round(mp3.byteLength / 16000);

  // Met à jour la leçon vidéo
  await supabase
    .from('cs_video_lessons')
    .update({
      audio_url: mp3Path,
      subtitle_vtt_url: vttPath,
      duration_seconds: durationSeconds,
      updated_at: new Date().toISOString(),
    })
    .eq('chapter_id', body.chapter_id);

  return json({
    audio_url: audioSigned?.signedUrl || null,
    subtitle_vtt_url: vttSigned?.signedUrl || null,
    duration_seconds: durationSeconds,
    audio_path: mp3Path,
    vtt_path: vttPath,
  });
});
