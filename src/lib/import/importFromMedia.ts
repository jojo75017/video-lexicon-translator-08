import { supabase } from '@/integrations/supabase/client';
import { buildManuscriptFromText } from './buildManuscriptFromText';
import type { Manuscript } from '@/lib/bookperfect/types';

/** Convertit un fichier en base64 (côté client). Limite pratique : ~20 Mo. */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
    reader.readAsDataURL(file);
  });
}

export async function importFromMediaFile(file: File): Promise<Manuscript> {
  if (file.size > 20 * 1024 * 1024) {
    throw new Error("Fichier trop volumineux (max 20 Mo). Découpez l'audio en segments plus courts.");
  }
  const base64 = await fileToBase64(file);
  const { data, error } = await supabase.functions.invoke('import-from-media', {
    body: { fileName: file.name, mimeType: file.type || 'audio/mpeg', base64 },
  });
  if (error) throw new Error(error.message || "La transcription a échoué.");
  const text: string = data?.transcript || '';
  if (!text) throw new Error("Aucune transcription reçue.");
  return buildManuscriptFromText(text, file.name.replace(/\.[a-z0-9]+$/i, '.md'));
}
