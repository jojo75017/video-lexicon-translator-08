
import { ImageAnalysis } from '@/types/seo';

export const analyzeImages = (doc: Document, url: string): {
  imgCount: number;
  imgWithoutAlt: number;
  imagesDetails: ImageAnalysis[];
} => {
  const images = Array.from(doc.getElementsByTagName('img'));
  const imagesDetails = images.map(img => ({
    url: new URL(img.src, url).href,
    hasAlt: !!img.alt,
    alt: img.alt || undefined,
  }));

  return {
    imgCount: images.length,
    imgWithoutAlt: images.filter(img => !img.alt).length,
    imagesDetails,
  };
};
