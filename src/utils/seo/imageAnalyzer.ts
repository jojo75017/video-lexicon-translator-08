
import { ImageDetails } from '@/types/seo/ImageDetails';

export const analyzeImages = (html: string): {images: ImageDetails[], totalImages: number, imagesWithoutAlt: number, oversizedImages: number} => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const images = Array.from(doc.querySelectorAll('img'));

  const imageDetails: ImageDetails[] = images.map((img, index) => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const width = parseInt(img.getAttribute('width') || '0');
    const height = parseInt(img.getAttribute('height') || '0');
    
    // Estimation de la taille basée sur les dimensions
    const estimatedBytes = width * height * 3; // Estimation simple
    const estimatedSize = estimatedBytes > 1000000 ? `${(estimatedBytes / 1000000).toFixed(1)}MB` : `${Math.round(estimatedBytes / 1000)}KB`;
    
    return {
      url: src,
      alt: alt,
      hasAlt: alt.length > 0,
      width: width,
      height: height,
      isDecorative: alt === '' && img.getAttribute('role') === 'presentation',
      needsOptimization: estimatedBytes > 500000, // > 500KB
      estimatedSize: estimatedSize,
      lazyLoaded: img.getAttribute('loading') === 'lazy',
      index: index,
      size: estimatedSize,
      format: getImageFormat(src)
    };
  });

  const imagesWithoutAlt = imageDetails.filter(img => !img.hasAlt && !img.isDecorative).length;
  const oversizedImages = imageDetails.filter(img => img.needsOptimization).length;

  return {
    images: imageDetails,
    totalImages: imageDetails.length,
    imagesWithoutAlt,
    oversizedImages
  };
};

const getImageFormat = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  return extension || 'unknown';
};

export const getImageOptimizationSuggestions = (images: ImageDetails[]) => {
  const suggestions = [];
  
  images.forEach(img => {
    if (!img.hasAlt && !img.isDecorative) {
      suggestions.push(`Ajouter un attribut alt pour l'image: ${img.url}`);
    }
    
    if (img.needsOptimization) {
      suggestions.push(`Optimiser la taille de l'image: ${img.url} (${img.estimatedSize})`);
    }
    
    if (!img.lazyLoaded && img.index > 2) {
      suggestions.push(`Ajouter le lazy loading pour: ${img.url}`);
    }
  });
  
  return suggestions;
};
