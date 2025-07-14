
import { CompetitorComparison, CompetitorAnalysisResult } from "@/types/seo/CompetitorData";

export const generateSiteAnalysis = (url: string, type: 'your' | 'comp1' | 'comp2'): CompetitorAnalysisResult => {
  const isTravel = url.toLowerCase().includes('voyage') || url.toLowerCase().includes('travel');
  const domain = url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  
  const baseScores = { your: 58, comp1: 85, comp2: 76 };
  const baseTraffic = { your: 5500, comp1: 28000, comp2: 19500 };
  
  const travelKeywords = [
    { keyword: 'voyage organisé', position: Math.floor(Math.random() * 15) + 1, volume: 18500 },
    { keyword: 'destination voyage', position: Math.floor(Math.random() * 20) + 1, volume: 12400 },
    { keyword: 'séjour all inclusive', position: Math.floor(Math.random() * 25) + 1, volume: 9800 },
    { keyword: 'réservation hotel', position: Math.floor(Math.random() * 18) + 1, volume: 15200 },
    { keyword: 'guide voyage', position: Math.floor(Math.random() * 12) + 1, volume: 8900 }
  ];

  const genericKeywords = [
    { keyword: 'service principal', position: Math.floor(Math.random() * 20) + 1, volume: 12000 },
    { keyword: 'solution experte', position: Math.floor(Math.random() * 20) + 1, volume: 8900 },
    { keyword: 'conseil professionnel', position: Math.floor(Math.random() * 20) + 1, volume: 6500 },
    { keyword: 'accompagnement', position: Math.floor(Math.random() * 20) + 1, volume: 4200 },
    { keyword: 'expertise', position: Math.floor(Math.random() * 20) + 1, volume: 3800 }
  ];
  
  return {
    site: url,
    domain: domain,
    seoScore: baseScores[type] + Math.floor(Math.random() * 15),
    topKeywords: isTravel ? travelKeywords : genericKeywords,
    totalKeywords: Math.floor(Math.random() * 800) + 350,
    organicTraffic: baseTraffic[type] + Math.floor(Math.random() * 8000),
    backlinksCount: Math.floor(Math.random() * 3500) + 800,
    domainAuthority: Math.floor(Math.random() * 35) + 45,
    technicalSeo: {
      loadSpeed: Math.floor(Math.random() * 40) + 50,
      mobileOptimization: Math.floor(Math.random() * 25) + 70,
      sslCertificate: Math.random() > 0.1,
      structuredData: Math.random() > 0.2
    }
  };
};

export const generateKeywordGaps = (yourSite: string) => {
  const isTravel = yourSite.toLowerCase().includes('voyage') || yourSite.toLowerCase().includes('travel');
  
  if (isTravel) {
    return [
      'voyage dernière minute',
      'croisière méditerranée',
      'circuit organisé asie',
      'weekend romantique',
      'séjour spa détente',
      'voyage groupe famille',
      'excursion locale'
    ];
  }
  
  return [
    'solution avancée',
    'expertise technique',
    'conseil stratégique',
    'accompagnement personnalisé',
    'formation spécialisée'
  ];
};

export const generatePositionAnalysis = () => [
  { keyword: 'mot-clé principal 1', yourPosition: 18, comp1Position: 4, comp2Position: 9 },
  { keyword: 'mot-clé principal 2', yourPosition: 25, comp1Position: 6, comp2Position: 14 },
  { keyword: 'mot-clé principal 3', yourPosition: 12, comp1Position: 15, comp2Position: 7 },
  { keyword: 'mot-clé principal 4', yourPosition: 8, comp1Position: 3, comp2Position: 21 },
  { keyword: 'mot-clé principal 5', yourPosition: 32, comp1Position: 11, comp2Position: 16 }
];

export const generateOpportunities = (yourSite: string) => {
  const isTravel = yourSite.toLowerCase().includes('voyage') || yourSite.toLowerCase().includes('travel');
  
  if (isTravel) {
    return [
      'Créer du contenu sur les voyages dernière minute pour capturer 18k recherches/mois',
      'Optimiser les pages destinations avec des guides locaux détaillés',
      'Développer une section avis clients pour améliorer la confiance',
      'Améliorer le maillage interne entre destinations similaires',
      'Créer des landing pages saisonnières (été, hiver, printemps)',
      'Optimiser pour la recherche locale "voyage + ville"',
      'Développer du contenu vidéo pour les réseaux sociaux'
    ];
  }
  
  return [
    'Améliorer le contenu existant avec les mots-clés gaps identifiés',
    'Créer une stratégie de backlinks plus agressive',
    'Optimiser la vitesse de chargement (gain potentiel +15 positions)',
    'Développer du contenu longue traîne sur votre expertise',
    'Améliorer l\'UX mobile pour réduire le taux de rebond'
  ];
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600 bg-green-50';
  if (score >= 60) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

export const getPositionColor = (position: number) => {
  if (position <= 3) return 'text-green-600 bg-green-50';
  if (position <= 10) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
};

export const createMockAnalysisResult = (yourSite: string, competitor1: string, competitor2: string): CompetitorComparison => {
  return {
    yourSite: generateSiteAnalysis(yourSite, 'your'),
    competitor1: generateSiteAnalysis(competitor1, 'comp1'),
    competitor2: generateSiteAnalysis(competitor2, 'comp2'),
    comparison: {
      keywordGaps: generateKeywordGaps(yourSite),
      strengthComparison: [
        { site: yourSite, strength: Math.floor(Math.random() * 25) + 55 },
        { site: competitor1, strength: Math.floor(Math.random() * 25) + 70 },
        { site: competitor2, strength: Math.floor(Math.random() * 25) + 60 }
      ],
      positionAnalysis: generatePositionAnalysis(),
      opportunities: generateOpportunities(yourSite)
    }
  };
};
