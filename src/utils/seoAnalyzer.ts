import { SeoAnalysis, ImageAnalysis } from '@/types/seo';
import axios from 'axios';

const SEMRUSH_API_KEY = process.env.NEXT_PUBLIC_SEMRUSH_API_KEY;
const SEMRUSH_API_URL = 'https://api.semrush.com/analytics/v1/';

async function getSemrushMetrics(domain: string) {
  try {
    // Récupération des données d'autorité du domaine
    const authorityResponse = await axios.get(`${SEMRUSH_API_URL}?type=domain_ranks&key=${SEMRUSH_API_KEY}&export_columns=Ot,Ob,Ot&domain=${domain}&database=fr`);
    
    // Récupération du trafic organique
    const trafficResponse = await axios.get(`${SEMRUSH_API_URL}?type=domain_organic&key=${SEMRUSH_API_KEY}&export_columns=Tr&domain=${domain}&database=fr`);
    
    // Récupération des backlinks
    const backlinksResponse = await axios.get(`${SEMRUSH_API_URL}?type=backlinks_overview&key=${SEMRUSH_API_KEY}&export_columns=total&target=${domain}`);

    return {
      authorityScore: parseInt(authorityResponse.data.split('\n')[1].split(';')[0]),
      organicTraffic: parseInt(trafficResponse.data.split('\n')[1]),
      backlinks: parseInt(backlinksResponse.data.split('\n')[1])
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques SEMrush:', error);
    // En cas d'erreur, on retourne des valeurs par défaut
    return {
      authorityScore: 0,
      organicTraffic: 0,
      backlinks: 0
    };
  }
}

export const analyzeSeo = async (doc: Document, url: string): Promise<SeoAnalysis> => {
  // Extraction du domaine de l'URL
  const domain = new URL(url).hostname;

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

  // Récupération des métriques SEMrush
  const semrushMetrics = await getSemrushMetrics(domain);

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
    googlePosition: null,
    ...semrushMetrics
  };
};