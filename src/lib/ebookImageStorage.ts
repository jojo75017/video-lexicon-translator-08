import { supabase } from '@/integrations/supabase/client';

const sanitizeStorageSegment = (value?: string, fallback = 'image'): string => {
  const cleaned = (value || fallback)
    .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 60);

  return cleaned || fallback;
};

const getStoredSubscriberEmail = (): string | null => {
  const saved = localStorage.getItem('subscriberData');
  if (!saved) return null;

  try {
    const data = JSON.parse(saved);
    return data?.email || null;
  } catch {
    return null;
  }
};

export const isDataImageUrl = (url?: string | null): boolean => {
  return Boolean(url?.startsWith('data:image/'));
};

export const resolveEbookStorageRoot = async (subscriberEmail?: string): Promise<string | null> => {
  const persistedRoot = localStorage.getItem('ebook_storage_root');
  if (persistedRoot) return persistedRoot;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      localStorage.setItem('ebook_storage_root', user.id);
      return user.id;
    }
  } catch {
    // ignore auth lookup errors
  }

  const fallbackEmail = subscriberEmail || getStoredSubscriberEmail();
  if (!fallbackEmail) return null;

  const sanitizedEmail = fallbackEmail.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 60);
  if (!sanitizedEmail) return null;

  localStorage.setItem('ebook_storage_root', sanitizedEmail);
  return sanitizedEmail;
};

export const persistEbookImageToLibrary = async ({
  imageUrl,
  ebookTitle,
  chapterTitle,
  subscriberEmail,
}: {
  imageUrl: string;
  ebookTitle?: string;
  chapterTitle?: string;
  subscriberEmail?: string;
}): Promise<string> => {
  if (!imageUrl) return imageUrl;
  if (!isDataImageUrl(imageUrl)) return imageUrl;

  const storageRoot = await resolveEbookStorageRoot(subscriberEmail);
  if (!storageRoot) return imageUrl;

  const folderName = sanitizeStorageSegment(ebookTitle, 'Sans-titre');
  const safeChapterTitle = sanitizeStorageSegment(chapterTitle, 'image');

  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error('Impossible de préparer l’image pour la bibliothèque');
  }

  const blob = await response.blob();
  const mimeType = blob.type || 'image/png';
  const extension = mimeType.split('/')[1] || 'png';
  const filePath = `${storageRoot}/${folderName}/${Date.now()}-${safeChapterTitle}.${extension}`;

  const { error } = await supabase.storage
    .from('ebook-images')
    .upload(filePath, blob, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from('ebook-images').getPublicUrl(filePath);
  return data.publicUrl;
};