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
  /** Empreinte du fichier fournie par le stockage, utilisée pour masquer les copies identiques. */
  fingerprint?: string;
}

const sanitize = (value?: string, fallback = 'livre'): string => {
  const cleaned = (value || fallback)
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 50);
  return cleaned || fallback;
};

/** Root de stockage fiable : toujours l'ID auth quand une session existe (répare un root email obsolète). */
const resolveCoverRoot = async (): Promise<string | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      localStorage.setItem('ebook_storage_root', user.id);
      return user.id;
    }
  } catch {
    // ignore
  }
  return await resolveEbookStorageRoot();
};

/** Convertit une URL d'image (data:, blob:, distante) en Blob, avec repli canvas si le fetch est bloqué (CORS). */
const toBlob = async (imageUrl: string): Promise<Blob | null> => {
  try {
    const response = await fetch(imageUrl);
    if (response.ok) return await response.blob();
  } catch {
    // fetch bloqué → repli canvas
  }
  if (isDataImageUrl(imageUrl)) return null;
  try {
    return await new Promise<Blob | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((b) => resolve(b), 'image/png');
      };
      img.onerror = () => resolve(null);
      img.src = imageUrl;
    });
  } catch {
    return null;
  }
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

  const storageRoot = await resolveCoverRoot();
  if (!storageRoot) {
    console.warn('[coverLibrary] Aucun espace de stockage résolu : couverture non sauvegardée.');
    return imageUrl;
  }

  try {
    const blob = await toBlob(imageUrl);
    if (!blob) {
      console.warn('[coverLibrary] Image illisible pour la sauvegarde.');
      return imageUrl;
    }
    const mimeType = blob.type || 'image/png';
    const extension = (mimeType.split('/')[1] || 'png').replace('jpeg', 'jpg');
    const filePath = `${storageRoot}/${COVERS_FOLDER}/${Date.now()}__${format}__${sanitize(title)}.${extension}`;

    const { error } = await supabase.storage
      .from('ebook-images')
      .upload(filePath, blob, { contentType: mimeType, upsert: false });
    if (error) {
      console.warn('[coverLibrary] Upload refusé :', error.message);
      return imageUrl;
    }

    const { data } = supabase.storage.from('ebook-images').getPublicUrl(filePath);
    return data.publicUrl || imageUrl;
  } catch (err) {
    console.warn('[coverLibrary] Sauvegarde impossible :', err);
    return imageUrl;
  }
};


/**
 * Racines historiques (anciens espaces de stockage), en lecture seule :
 *  - liste éventuelle enregistrée localement ;
 *  - variante dérivée de l'email, utilisée par d'anciennes versions.
 */
const legacyRoots = async (): Promise<string[]> => {
  const roots = new Set<string>();
  try {
    const legacy = localStorage.getItem('ebook_storage_root_legacy');
    if (legacy) legacy.split(',').forEach((r) => r.trim() && roots.add(r.trim()));
  } catch {
    // ignore
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email;
    if (email) {
      const sanitized = email.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 60);
      if (sanitized) roots.add(sanitized);
    }
  } catch {
    // ignore
  }
  return [...roots];
};

const listCoversInRoot = async (storageRoot: string): Promise<SavedCover[]> => {
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
          fingerprint: typeof file.metadata?.eTag === 'string'
            ? file.metadata.eTag.replaceAll('"', '')
            : undefined,
        };
      });
  } catch {
    return [];
  }
};

/** Toutes les couvertures sauvegardées, espaces historiques inclus (plus récentes d'abord). */
export const listSavedCovers = async (): Promise<SavedCover[]> => {
  const storageRoot = await resolveCoverRoot();
  const roots = [storageRoot, ...(await legacyRoots())].filter(
    (r, i, arr): r is string => Boolean(r) && arr.indexOf(r) === i,
  );
  if (roots.length === 0) return [];

  const lists = await Promise.all(roots.map((root) => listCoversInRoot(root)));
  return lists
    .flat()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const deleteSavedCover = async (path: string): Promise<boolean> => {
  const { error } = await supabase.storage.from('ebook-images').remove([path]);
  return !error;
};
