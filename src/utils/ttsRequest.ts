import { supabase } from '@/integrations/supabase/client';
import { cleanForAudio } from '@/utils/textCleaner';
import { splitTextForTts } from '@/utils/ttsChunker';

const SAFE_TTS_CHUNK_SIZE = 1400;
const MIN_AUDIO_BLOB_BYTES = 512;
const DEFAULT_MAX_FAILURES = 2;

export interface TtsRequestResult {
  audioBlobs: Blob[];
  errors: string[];
  totalChunks: number;
  completedAllChunks: boolean;
}

const parseErrorMessage = async (response: Response) => {
  const errorText = await response.text();

  try {
    const parsed = JSON.parse(errorText);
    return parsed.error || parsed.message || `Erreur ${response.status}`;
  } catch {
    return errorText || `Erreur ${response.status}`;
  }
};

export async function requestTtsAudioChunks({
  text,
  niche,
  voiceName,
  maxFailures = DEFAULT_MAX_FAILURES,
}: {
  text: string;
  niche?: string;
  voiceName?: string;
  maxFailures?: number;
}): Promise<TtsRequestResult> {
  if (!text?.trim()) {
    throw new Error('Aucun texte à synthétiser');
  }

  const cleanedText = cleanForAudio(text);
  const chunks = splitTextForTts(cleanedText, SAFE_TTS_CHUNK_SIZE);
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

  const audioBlobs: Blob[] = [];
  const errors: string[] = [];
  let completedAllChunks = true;

  for (let index = 0; index < chunks.length; index += 1) {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/azure-speech-tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: chunks[index],
          niche,
          voiceName,
        }),
      });

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response));
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('audio/mpeg')) {
        throw new Error('Le service audio a renvoyé une réponse invalide');
      }

      const audioBlob = await response.blob();
      if (audioBlob.size < MIN_AUDIO_BLOB_BYTES) {
        throw new Error('Le segment audio reçu est vide');
      }

      audioBlobs.push(audioBlob);
    } catch (error) {
      completedAllChunks = false;
      errors.push(error instanceof Error ? error.message : 'Erreur audio inconnue');

      if (errors.length >= maxFailures) {
        break;
      }
    }
  }

  if (audioBlobs.length === 0) {
    throw new Error(errors[0] || 'Aucun segment audio généré');
  }

  return {
    audioBlobs,
    errors,
    totalChunks: chunks.length,
    completedAllChunks,
  };
}

export function combineMp3Blobs(blobs: Blob[]): Blob {
  return new Blob(blobs, { type: 'audio/mpeg' });
}