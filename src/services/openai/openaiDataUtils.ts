
import { CompetitorData, SerpResult } from '@/types/seo/Keyword';

/**
 * Validates URL format
 */
export const validateUrl = (url: string): boolean => {
  try {
    if (!url) return false;
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch (e) {
    return false;
  }
};

/**
 * Validate competitor data to ensure it meets our requirements
 */
export const validateCompetitorData = (competitors: any[]): CompetitorData[] => {
  if (!competitors || competitors.length === 0) {
    return generateFallbackData("").competitors;
  }
  
  return competitors.map(comp => ({
    name: comp.name || 'Concurrent',
    url: validateUrl(comp.url) ? comp.url : `https://example-${Math.floor(Math.random() * 1000)}.com`,
    strength: typeof comp.strength === 'number' ? comp.strength : Math.floor(Math.random() * 100),
    organic_traffic: typeof comp.organic_traffic === 'number' ? comp.organic_traffic : Math.floor(Math.random() * 50000 + 1000),
    keywords: typeof comp.keywords === 'number' ? comp.keywords : Math.floor(Math.random() * 5000 + 500)
  })).slice(0, 5);
};

/**
 * Validate SERP results to ensure they meet our requirements
 */
export const validateSerpResults = (serps: any[]): SerpResult[] => {
  if (!serps || serps.length === 0) {
    return generateFallbackData("").serps;
  }
  
  return serps.map((serp, index) => ({
    title: serp.title || 'Résultat de recherche',
    url: validateUrl(serp.url) ? serp.url : `https://example-${Math.floor(Math.random() * 1000)}.com/page-${index}`,
    description: serp.description || 'Description non disponible pour ce résultat de recherche.',
    position: typeof serp.position === 'number' ? serp.position : index + 1
  })).slice(0, 10);
};

/**
 * Generate fallback competitor data when the API fails
 */
export const generateFallbackData = (keyword: string): { competitors: CompetitorData[], serps: SerpResult[] } => {
  const keywordBase = keyword.split(' ')[0] || 'exemple';
  
  const competitors: CompetitorData[] = [
    {
      name: `Guide${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}.fr`,
      url: `https://www.guide${keywordBase.toLowerCase()}.fr`,
      strength: Math.floor(Math.random() * 40 + 60),
      organic_traffic: Math.floor(Math.random() * 50000 + 10000),
      keywords: Math.floor(Math.random() * 5000 + 1000)
    },
    {
      name: `${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}Expert.com`,
      url: `https://www.${keywordBase.toLowerCase()}expert.com`,
      strength: Math.floor(Math.random() * 30 + 50),
      organic_traffic: Math.floor(Math.random() * 40000 + 8000),
      keywords: Math.floor(Math.random() * 4000 + 800)
    },
    {
      name: `Meilleur${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}.fr`,
      url: `https://www.meilleur${keywordBase.toLowerCase()}.fr`,
      strength: Math.floor(Math.random() * 30 + 40),
      organic_traffic: Math.floor(Math.random() * 30000 + 5000),
      keywords: Math.floor(Math.random() * 3000 + 600)
    },
    {
      name: `${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}Pro.com`,
      url: `https://www.${keywordBase.toLowerCase()}pro.com`,
      strength: Math.floor(Math.random() * 20 + 40),
      organic_traffic: Math.floor(Math.random() * 25000 + 3000),
      keywords: Math.floor(Math.random() * 2500 + 500)
    },
    {
      name: `Top${keywordBase.charAt(0).toUpperCase() + keywordBase.slice(1)}.com`,
      url: `https://www.top${keywordBase.toLowerCase()}.com`,
      strength: Math.floor(Math.random() * 20 + 30),
      organic_traffic: Math.floor(Math.random() * 20000 + 2000),
      keywords: Math.floor(Math.random() * 2000 + 400)
    }
  ];

  const serps: SerpResult[] = [
    {
      title: `${keyword} - Guide complet et conseils`,
      url: `https://www.guide${keywordBase.toLowerCase()}.fr/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Découvrez tout ce que vous devez savoir sur ${keyword}. Guide complet, conseils d'experts et astuces pour réussir.`,
      position: 1
    },
    {
      title: `Les meilleurs ${keyword} en ${new Date().getFullYear()} - Comparatif complet`,
      url: `https://www.meilleur${keywordBase.toLowerCase()}.fr/comparatif-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Comparatif des meilleurs ${keyword} de l'année. Avis, tests et conseils pour faire le bon choix.`,
      position: 2
    },
    {
      title: `${keyword}: tout ce qu'il faut savoir - ${keywordBase}Expert`,
      url: `https://www.${keywordBase.toLowerCase()}expert.com/guide/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Guide complet sur ${keyword}. Découvrez nos conseils d'experts pour optimiser votre expérience.`,
      position: 3
    },
    {
      title: `${keyword} pas cher - Les meilleures offres`,
      url: `https://www.bons-plans-${keywordBase.toLowerCase()}.com/${keyword.replace(/\s+/g, '-').toLowerCase()}-pas-cher`,
      description: `Économisez sur votre ${keyword} avec nos conseils et bons plans. Offres mises à jour quotidiennement.`,
      position: 4
    },
    {
      title: `Avis sur les ${keyword} - Test complet`,
      url: `https://www.avis-${keywordBase.toLowerCase()}.fr/test-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Avis détaillés et tests des ${keyword}. Découvrez les avantages, inconvénients et retours d'expérience.`,
      position: 5
    },
    {
      title: `Comment choisir son ${keyword} ? Guide d'achat`,
      url: `https://www.conseils-${keywordBase.toLowerCase()}.com/guide-achat-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Guide d'achat pour bien choisir votre ${keyword}. Critères de sélection, comparatifs et conseils personnalisés.`,
      position: 6
    },
    {
      title: `${keyword} - Wikipédia`,
      url: `https://fr.wikipedia.org/wiki/${keyword.replace(/\s+/g, '_')}`,
      description: `${keyword} désigne... Découvrez l'histoire, les caractéristiques et l'évolution du concept de ${keyword} dans cet article.`,
      position: 7
    },
    {
      title: `${keyword.charAt(0).toUpperCase() + keyword.slice(1)} | Amazon.fr`,
      url: `https://www.amazon.fr/s?k=${keyword.replace(/\s+/g, '+')}`,
      description: `Achetez ${keyword} sur Amazon.fr. Livraison rapide et prix bas garantis. Grand choix parmi des milliers de produits.`,
      position: 8
    },
    {
      title: `Les tendances ${keyword} en ${new Date().getFullYear()}`,
      url: `https://www.tendances-${keywordBase.toLowerCase()}.fr/${new Date().getFullYear()}/${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Découvrez les dernières tendances ${keyword} pour cette année. Innovations, nouveautés et évolutions à connaître.`,
      position: 9
    },
    {
      title: `Formation ${keyword} - Apprenez avec des experts`,
      url: `https://www.formation-${keywordBase.toLowerCase()}.com/cours-${keyword.replace(/\s+/g, '-').toLowerCase()}`,
      description: `Formez-vous au ${keyword} avec nos cours en ligne. Formation certifiante dispensée par des experts du domaine.`,
      position: 10
    }
  ];
  
  return { competitors, serps };
};
