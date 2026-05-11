// Simple persistent cache for AI-generated educational illustrations.
// Avoids regenerating the same image when the page/chapter signature is unchanged.

const STORAGE_KEY = 'edu_image_cache_v1';
const MAX_ENTRIES = 200;

type CacheMap = Record<string, { url: string; ts: number }>;

const read = (): CacheMap => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const write = (map: CacheMap) => {
  try {
    const entries = Object.entries(map);
    if (entries.length > MAX_ENTRIES) {
      entries.sort((a, b) => b[1].ts - a[1].ts);
      const trimmed = Object.fromEntries(entries.slice(0, MAX_ENTRIES));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    }
  } catch {
    // ignore quota errors
  }
};

export const buildImageCacheKey = (parts: Array<string | undefined | null>): string => {
  return parts
    .map(p => (p || '').toString().trim().toLowerCase())
    .join('||');
};

export const getCachedImage = (key: string): string | null => {
  if (!key) return null;
  const map = read();
  return map[key]?.url || null;
};

export const setCachedImage = (key: string, url: string): void => {
  if (!key || !url) return;
  const map = read();
  map[key] = { url, ts: Date.now() };
  write(map);
};

export const clearImageCache = () => {
  try { localStorage.removeItem(STORAGE_KEY); } catch {}
};
