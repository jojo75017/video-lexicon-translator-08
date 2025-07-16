
import { CompetitorData, SerpResult } from '@/types/seo/CompetitorData';

export const validateCompetitorData = (data: any[]): CompetitorData[] => {
  if (!Array.isArray(data)) return [];
  
  return data.map((item: any) => ({
    name: item.name || 'Unknown',
    url: item.url || '',
    domain: item.domain || item.name || 'unknown.com',
    title: item.title || `${item.name} - Page principale`,
    description: item.description || `Description de ${item.name}`,
    ranking: item.ranking || Math.floor(Math.random() * 10) + 1,
    traffic: item.traffic || item.organic_traffic || item.estimatedTraffic || 0,
    strength: item.strength || 50,
    organic_traffic: item.organic_traffic || item.estimatedTraffic || 0,
    estimatedTraffic: item.estimatedTraffic || item.organic_traffic || 0,
    keywords: Array.isArray(item.keywords) ? item.keywords : [],
    topKeywords: Array.isArray(item.topKeywords) ? item.topKeywords : [],
    gaps: Array.isArray(item.gaps) ? item.gaps : [],
    backlinks: item.backlinks || Math.floor(Math.random() * 1000),
    authority: item.authority || Math.floor(Math.random() * 100)
  }));
};

export const validateSerpResults = (data: any[]): SerpResult[] => {
  if (!Array.isArray(data)) return [];
  
  return data.map((item: any, index: number) => ({
    title: item.title || `Résultat ${index + 1}`,
    url: item.url || `https://example${index + 1}.com`,
    description: item.description || `Description du résultat ${index + 1}`,
    position: item.position || index + 1,
    domain: item.domain || `example${index + 1}.com`
  }));
};

export const generateFallbackData = (keyword: string) => {
  const competitors: CompetitorData[] = [
    {
      name: 'site-concurrent-1.com',
      url: 'https://site-concurrent-1.com',
      domain: 'site-concurrent-1.com',
      title: `${keyword} - Guide Expert`,
      description: `Guide complet sur ${keyword} avec conseils d'experts`,
      ranking: 1,
      traffic: 15000,
      strength: 85,
      organic_traffic: 15000,
      estimatedTraffic: 15000,
      keywords: [`${keyword}`, `${keyword} guide`, `${keyword} conseil`],
      topKeywords: [`${keyword}`, `${keyword} guide`],
      gaps: [`${keyword} avancé`, `${keyword} professionnel`],
      backlinks: 2500,
      authority: 82
    },
    {
      name: 'expert-concurrent-2.com',
      url: 'https://expert-concurrent-2.com',
      domain: 'expert-concurrent-2.com',
      title: `${keyword} - Solutions Professionnelles`,
      description: `Solutions professionnelles pour ${keyword}`,
      ranking: 2,
      traffic: 12000,
      strength: 78,
      organic_traffic: 12000,
      estimatedTraffic: 12000,
      keywords: [`${keyword} pro`, `${keyword} expert`, `${keyword} formation`],
      topKeywords: [`${keyword} pro`, `${keyword} expert`],
      gaps: [`${keyword} débutant`, `${keyword} facile`],
      backlinks: 1800,
      authority: 75
    }
  ];

  const serps: SerpResult[] = [
    {
      title: `${keyword} - Guide complet 2024`,
      url: 'https://site-concurrent-1.com/guide',
      description: `Découvrez tout sur ${keyword} avec notre guide complet`,
      position: 1,
      domain: 'site-concurrent-1.com'
    },
    {
      title: `${keyword} - Solutions expertes`,
      url: 'https://expert-concurrent-2.com/solutions',
      description: `Solutions professionnelles pour maîtriser ${keyword}`,
      position: 2,
      domain: 'expert-concurrent-2.com'
    }
  ];

  return { competitors, serps };
};
