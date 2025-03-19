
import { ImageAnalysis, ImageDetails } from '@/types/seo';

export const analyzeImages = (doc: Document, baseUrl: string): { 
  imgCount: number; 
  imgWithoutAlt: number;
  imagesDetails: ImageDetails[];
} => {
  const images = Array.from(doc.querySelectorAll('img'));
  const imgCount = images.length;
  
  let imgWithoutAlt = 0;
  const imagesDetails: ImageDetails[] = [];
  
  images.forEach(img => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt');
    
    if (!alt) {
      imgWithoutAlt++;
    }
    
    // Build full URL if it's a relative path
    let fullUrl = src;
    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
      if (src.startsWith('/')) {
        try {
          const baseUrlObj = new URL(baseUrl);
          fullUrl = `${baseUrlObj.origin}${src}`;
        } catch (e) {
          fullUrl = src;
        }
      } else {
        fullUrl = `${baseUrl}/${src}`;
      }
    }
    
    // Create image details
    imagesDetails.push({
      url: fullUrl,
      alt: alt || null,
      dimensions: {
        width: img.naturalWidth || 0,
        height: img.naturalHeight || 0
      },
      size: 0, // Would require additional API calls to determine
      format: getImageFormatFromSrc(src),
      lazyLoaded: img.loading === 'lazy' || img.hasAttribute('data-src') || img.hasAttribute('data-lazyload'),
      compressed: false // Would require additional analysis
    });
  });
  
  return {
    imgCount,
    imgWithoutAlt,
    imagesDetails
  };
};

const getImageFormatFromSrc = (src: string): string => {
  if (!src) return 'unknown';
  if (src.startsWith('data:image/')) {
    const format = src.substring(11, src.indexOf(';'));
    return format || 'unknown';
  }
  
  const extension = src.split('.').pop()?.toLowerCase();
  if (!extension) return 'unknown';
  
  const knownFormats: Record<string, string> = {
    'jpg': 'jpeg',
    'jpeg': 'jpeg',
    'png': 'png',
    'gif': 'gif',
    'webp': 'webp',
    'svg': 'svg',
    'avif': 'avif'
  };
  
  return knownFormats[extension] || 'unknown';
};
