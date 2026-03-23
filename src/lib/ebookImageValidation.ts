const PLACEHOLDER_HOSTS = [/placehold\.co/i, /via\.placeholder\.com/i, /dummyimage\.com/i];

const placeholderCheckCache = new Map<string, Promise<boolean>>();

export const isExternalPlaceholderUrl = (url: string): boolean => {
  if (!url) return false;
  return PLACEHOLDER_HOSTS.some((pattern) => pattern.test(url));
};

export const isSuspiciousRasterPlaceholder = (url: string, contentType?: string | null): boolean => {
  if (!url || !contentType) return false;

  const looksLikeRasterFile = /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url);
  return looksLikeRasterFile && contentType.toLowerCase().includes('image/svg+xml');
};

export const detectPlaceholderImage = async (url: string): Promise<boolean> => {
  if (!url) return true;

  if (url.startsWith('data:image/')) {
    return false;
  }

  if (isExternalPlaceholderUrl(url)) {
    return true;
  }

  const cached = placeholderCheckCache.get(url);
  if (cached) return cached;

  const checkPromise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) return false;

      const contentType = response.headers.get('content-type');
      if (!isSuspiciousRasterPlaceholder(url, contentType)) {
        return false;
      }

      const svgText = await response.text();
      return /<svg/i.test(svgText) && /(placehold|dummyimage|fill="#e5e7eb"|fill="#ffffff")/i.test(svgText);
    } catch {
      return false;
    }
  })();

  placeholderCheckCache.set(url, checkPromise);
  return checkPromise;
};