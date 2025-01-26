import { SeoAnalysis, ImageAnalysis } from '@/types/seo';

export const analyzeSeo = (doc: Document, url: string): SeoAnalysis => {
  // Analyse des images
  const images = Array.from(doc.getElementsByTagName('img'));
  const imagesDetails: ImageAnalysis[] = images.map(img => ({
    url: new URL(img.src, url).href,
    hasAlt: !!img.alt,
    alt: img.alt || undefined
  }));

  const keywords = Array.from(doc.querySelectorAll('meta[name="keywords"]'))
    .map(meta => meta.getAttribute('content')?.split(',').map(k => k.trim()))
    .flat()
    .filter(Boolean) as string[];

  const headings = ['h1', 'h2', 'h3'].reduce((acc, tag) => {
    const elements = Array.from(doc.getElementsByTagName(tag));
    return [...acc, ...elements.map((heading, index) => ({
      text: heading.textContent?.trim() || '',
      level: parseInt(tag.charAt(1)),
      position: index
    }))];
  }, [] as any[]);

  // Position Google spéciale pour aquarioslands.com
  let googlePosition = null;
  if (url.includes('aquarioslands.com')) {
    googlePosition = Math.floor(Math.random() * 10) + 1; // Position entre 1 et 10
  } else {
    googlePosition = Math.floor(Math.random() * 100) + 1;
  }

  // Simulation des métriques SEO avancées
  const authorityScore = Math.floor(Math.random() * 100);
  const organicTraffic = Math.floor(Math.random() * 100000);
  const backlinks = Math.floor(Math.random() * 10000);

  return {
    title: doc.title || "Pas de titre",
    description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    h1Count: doc.getElementsByTagName('h1').length,
    h2Count: doc.getElementsByTagName('h2').length,
    h3Count: doc.getElementsByTagName('h3').length,
    headings,
    imgCount: images.length,
    imgWithoutAlt: images.filter(img => !img.alt).length,
    imagesDetails,
    metaTagsCount: doc.getElementsByTagName('meta').length,
    canonicalUrl: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
    robotsMeta: doc.querySelector('meta[name="robots"]')?.getAttribute('content') || null,
    brokenLinks: 0,
    keywords,
    googlePosition,
    authorityScore,
    organicTraffic,
    backlinks
  };
};
