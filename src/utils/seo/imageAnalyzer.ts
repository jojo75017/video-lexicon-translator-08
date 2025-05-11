
import { ImageDetails } from '@/types/seo';

/**
 * Analyzes images from HTML content
 * @param htmlContent - The HTML content containing images
 * @returns An array of ImageDetails objects
 */
export const analyzeImages = (htmlContent: string): ImageDetails[] => {
  if (!htmlContent) return [];

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const images = Array.from(doc.querySelectorAll('img'));

  return images.map((img, index) => {
    const src = img.getAttribute('src') || '';
    const alt = img.getAttribute('alt') || '';
    const hasAlt = !!alt;
    const width = img.getAttribute('width') || null;
    const height = img.getAttribute('height') || null;
    
    // Get parent element classes for context
    const parentClasses = img.parentElement?.getAttribute('class') || '';
    
    // Check if it seems to be a decorative image
    const isLikelyDecorative = 
      src.includes('icon') || 
      src.includes('logo') || 
      parentClasses.includes('icon') || 
      parentClasses.includes('logo') ||
      img.width < 50 || 
      img.height < 50;
    
    // Calculate approximate file size based on dimensions (very rough estimate)
    const estimatedSizeKB = img.naturalWidth && img.naturalHeight ? 
      Math.round((img.naturalWidth * img.naturalHeight) / 1024) : 0;
      
    // Check if image might need optimization (large images)
    const mightNeedOptimization = estimatedSizeKB > 100;
    
    return {
      url: src,
      alt,
      hasAlt,
      width: width ? parseInt(width) : null,
      height: height ? parseInt(height) : null,
      isDecorative: isLikelyDecorative,
      needsOptimization: mightNeedOptimization,
      estimatedSize: estimatedSizeKB > 0 ? `~${estimatedSizeKB} KB` : 'Unknown',
      lazyLoaded: img.getAttribute('loading') === 'lazy',
      index
    };
  });
};

/**
 * Checks if images are optimized for size and loading
 */
export const checkImageOptimization = (images: ImageDetails[]) => {
  const totalImages = images.length;
  
  if (totalImages === 0) {
    return {
      score: 100,
      optimizedImages: 0,
      unoptimizedImages: 0,
      totalSize: 0,
      potentialSavings: 0,
      missingAltCount: 0
    };
  }
  
  const missingAlt = images.filter(img => !img.hasAlt && !img.isDecorative).length;
  const unoptimized = images.filter(img => img.needsOptimization).length;
  const notLazyLoaded = images.filter(img => !img.lazyLoaded).length;
  
  // Calculate score based on optimization factors
  const altFactor = totalImages > 0 ? (totalImages - missingAlt) / totalImages : 1;
  const optimizationFactor = totalImages > 0 ? (totalImages - unoptimized) / totalImages : 1;
  const lazyFactor = totalImages > 0 ? (totalImages - notLazyLoaded) / totalImages : 1;
  
  const score = Math.round((altFactor * 0.4 + optimizationFactor * 0.4 + lazyFactor * 0.2) * 100);
  
  return {
    score,
    optimizedImages: totalImages - unoptimized,
    unoptimizedImages: unoptimized,
    totalImages,
    missingAltCount: missingAlt,
    lazyLoadedCount: totalImages - notLazyLoaded
  };
};
