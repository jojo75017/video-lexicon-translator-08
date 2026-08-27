import { supabase } from '@/integrations/supabase/client';
import { isDataImageUrl, resolveEbookStorageRoot } from '@/lib/ebookImageStorage';

const COVERS_FOLDER = 'Couvertures';

export type SavedCoverFormat = 'kindle' | 'paperback';

export interface SavedCover {
  url: string;
  path: string;
  format: SavedCoverFormat;
  title: string;
  createdAt: string;
}

const sanitize = (value?: string, fallback = 'livre'): string => {
  const cleaned = (value || fallback)
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return cleaned || fallback;
};

/**
 * Sauvegarde durable d'une couverture générée dans la bibliothèque de l'abonné.
 * Retourne l'URL publique persistante (ou l'URL d'origine si la sauvegarde échoue).
 */
export const persistCoverToLibrary = async ({
  imageUrl,
  title,
  format,
}: {
  imageUrl: string;
  title?: string;
  format: SavedCoverFormat;
}): Promise<string> => {
  if (!imageUrl) return imageUrl;

  const storageRoot = await resolveEbookStorageRoot();
  if (!storageRoot) return imageUrl;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return imageUrl;
    const blob = await response.blob();
    const mimeType = blob.type || 'image/png';
    const extension = (mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const filePath = `${storageRoot}/${COVERS_FOLDER}/${Date.now()}__${format}__${sanitize(title)}.${extension}`;

    const { error } = await supabase.storage
      .from('ebook-images')
      .upload(filePath, blob, { contentType: mimeType, upsert: false });
    if (error) return imageUrl;

    const { data } = supabase.storage.from('ebook-images').getPublicUrl(filePath);
    return data.publicUrl || imageUrl;
  } catch {
    return isDataImageUrl(imageUrl) ? imageUrl : imageUrl;
  }
};

/** Récupère toutes les couvertures déjà générées et sauvegardées (les plus récentes d'abord). */
export const listSavedCovers = async (): Promise<SavedCover[]> => {
  const storageRoot = await resolveEbookStorageRoot();
  if (!storageRoot) return [];

  try {
    const { data, error } = await supabase.storage
      .from('ebook-images')
      .list(`${storageRoot}/${COVERS_FOLDER}`, {
        limit: 100,
        sortBy: { column: 'name', order: 'desc' },
      });
    if (error || !data) return [];

    return data
      .filter((file) => file.name && !file.name.startsWith('.'))
      .map((file) => {
        const path = `${storageRoot}/${COVERS_FOLDER}/${file.name}`;
        const [stamp, formatPart, ...rest] = file.name.replace(/\.[a-z0-9]+$/i, '').split('__');
        const format: SavedCoverFormat = formatPart === 'paperback' ? 'paperback' : 'kindle';
        const { data: pub } = supabase.storage.from('ebook-images').getPublicUrl(path);
        return {
          url: pub.publicUrl,
          path,
          format,
          title: (rest.join('__') || '').replace(/-/g, ' '),
          createdAt: file.created_at || new Date(Number(stamp) || Date.now()).toISOString(),
        };
      });
  } catch {
    return [];
  }
};

export const deleteSavedCover = async (path: string): Promise<boolean> => {
  const { error } = await supabase.storage.from('ebook-images').remove([path]);
  return !error;
};
