
import { CompetitorComparison, KeywordWithMetrics } from '@/types/seo/CompetitorData';

export const getPositionColor = (position: number): string => {
  if (position <= 3) return 'bg-green-500 text-white';
  if (position <= 10) return 'bg-yellow-500 text-white';
  if (position <= 20) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'bg-green-500 text-white';
  if (score >= 60) return 'bg-yellow-500 text-white';
  if (score >= 40) return 'bg-orange-500 text-white';
  return 'bg-red-500 text-white';
};

export const createMockAnalysisResult = (yourSite: string, competitor1: string, competitor2: string): CompetitorComparison => {
  const mockKeywords: KeywordWithMetrics[] = [
    { keyword: 'guide complet', position: 5, volume: 8500, difficulty: 65, traffic: 450 },
    { keyword: 'meilleur choix', position: 8, volume: 6200, difficulty: 58, traffic: 320 },
    { keyword: 'comparatif détaillé', position: 12, volume: 4800, difficulty: 52, traffic: 280 },
    { keyword: 'conseils experts', position: 15, volume: 3400, difficulty: 45, traffic: 180 },
    { keyword: 'avis utilisateurs', position: 18, volume: 2900, difficulty: 41, traffic: 150 }
  ];

  const extractDomain = (url: string) => url.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');

  const yourDomain = extractDomain(yourSite);
  const comp1Domain = extractDomain(competitor1);
  const comp2Domain = extractDomain(competitor2);

  return {
    yourSite: {
      name: 'Votre site',
      url: yourSite,
      domain: yourDomain,
      score: 72,
      seoScore: 72,
      strengths: ['Contenu de qualité', 'Bonne structure technique'],
      weaknesses: ['Vitesse à améliorer', 'Maillage interne insuffisant'],
      keywords: mockKeywords.map(k => k.keyword),
      topKeywords: mockKeywords,
      ranking: Object.fromEntries(mockKeywords.map(k => [k.keyword, k.position])),
      organicTraffic: 25000,
      totalKeywords: 1500,
      backlinksCount: 850,
      domainAuthority: 45,
      site: yourSite
    },
    competitor1: {
      name: 'Concurrent leader',
      url: competitor1,
      domain: comp1Domain,
      score: 85,
      seoScore: 85,
      strengths: ['Autorité élevée', 'Excellent contenu', 'Backlinks de qualité'],
      keywords: mockKeywords.map(k => k.keyword),
      topKeywords: mockKeywords.map(k => ({ ...k, position: Math.max(1, k.position - 8) })),
      ranking: Object.fromEntries(mockKeywords.map(k => [k.keyword, Math.max(1, k.position - 8)])),
      organicTraffic: 45000,
      totalKeywords: 3200,
      backlinksCount: 2500,
      domainAuthority: 68,
      site: competitor1
    },
    competitor2: {
      name: 'Concurrent secondaire',
      url: competitor2,
      domain: comp2Domain,
      score: 78,
      seoScore: 78,
      strengths: ['Bon maillage interne', 'Contenu régulier'],
      keywords: mockKeywords.map(k => k.keyword),
      topKeywords: mockKeywords.map(k => ({ ...k, position: Math.max(1, k.position - 4) })),
      ranking: Object.fromEntries(mockKeywords.map(k => [k.keyword, Math.max(1, k.position - 4)])),
      organicTraffic: 32000,
      totalKeywords: 2100,
      backlinksCount: 1200,
      domainAuthority: 52,
      site: competitor2
    },
    opportunities: [
      {
        keyword: 'guide débutant',
        difficulty: 45,
        volume: 5400,
        yourPosition: 25,
        comp1Position: 3,
        comp2Position: 8,
        opportunity: 'Créer un guide pour débutants'
      },
      {
        keyword: 'tutoriel complet',
        difficulty: 38,
        volume: 4200,
        yourPosition: 0,
        comp1Position: 5,
        comp2Position: 12,
        opportunity: 'Développer des tutoriels détaillés'
      }
    ],
    actionPlan: [
      {
        priority: 'high',
        action: 'Optimiser le contenu principal',
        description: 'Enrichir vos pages principales avec plus de contenu de qualité',
        timeframe: '2-3 semaines',
        impact: 'Amélioration des positions de 5-10 places'
      },
      {
        priority: 'medium',
        action: 'Améliorer la vitesse de chargement',
        description: 'Optimiser les images et réduire le temps de chargement',
        timeframe: '1 semaine',
        impact: 'Amélioration du taux de conversion'
      }
    ],
    keywordGaps: [
      'guide débutant',
      'tutoriel avancé',
      'comparatif produits',
      'avis experts',
      'conseils pratiques'
    ],
    contentGaps: [
      'Articles de blog approfondis',
      'Pages de destination spécialisées',
      'Guides pratiques détaillés'
    ],
    technicalIssues: [
      'Optimisation Core Web Vitals',
      'Schema markup incomplet',
      'Images non optimisées'
    ],
    comparison: {
      keywordGaps: [
        'guide débutant',
        'tutoriel avancé',
        'comparatif produits',
        'avis experts',
        'conseils pratiques'
      ],
      opportunities: [
        'Créer un guide pour débutants',
        'Développer des tutoriels détaillés',
        'Améliorer le maillage interne',
        'Optimiser les images',
        'Créer du contenu longue traîne'
      ],
      strengthComparison: [
        { site: 'Votre site', strength: 72 },
        { site: 'Concurrent leader', strength: 85 },
        { site: 'Concurrent 2', strength: 78 }
      ],
      positionAnalysis: mockKeywords.map(keyword => ({
        keyword: keyword.keyword,
        yourPosition: keyword.position,
        comp1Position: Math.max(1, keyword.position - 8),
        comp2Position: Math.max(1, keyword.position - 4)
      }))
    }
  };
};
