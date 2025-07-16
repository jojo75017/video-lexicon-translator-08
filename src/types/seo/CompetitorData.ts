
export interface CompetitorData {
  name: string;
  url: string;
  domain: string;
  title?: string;
  description?: string;
  ranking?: number;
  traffic?: number;
  strength: number;
  organic_traffic: number;
  estimatedTraffic: number;
  keywords: string[];
  topKeywords: KeywordWithMetrics[];
  gaps: string[];
  backlinks?: number;
  authority?: number;
  seoScore?: number;
  organicTraffic?: number;
  totalKeywords?: number;
  backlinksCount?: number;
  domainAuthority?: number;
  site?: string;
}

export interface KeywordWithMetrics {
  keyword: string;
  position: number;
  volume: number;
  difficulty: number;
  traffic: number;
}

export interface SerpResult {
  title: string;
  url: string;
  description: string;
  position: number;
  domain?: string;
}

export interface CompetitorComparison {
  yourSite: {
    name: string;
    url: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
    keywords: string[];
    ranking: { [keyword: string]: number };
    seoScore: number;
    domain: string;
    organicTraffic: number;
    totalKeywords: number;
    backlinksCount: number;
    domainAuthority: number;
    site: string;
    topKeywords: KeywordWithMetrics[];
  };
  competitor1: {
    name: string;
    url: string;
    score: number;
    strengths: string[];
    keywords: string[];
    ranking: { [keyword: string]: number };
    seoScore: number;
    domain: string;
    organicTraffic: number;
    totalKeywords: number;
    backlinksCount: number;
    domainAuthority: number;
    site: string;
    topKeywords: KeywordWithMetrics[];
  };
  competitor2: {
    name: string;
    url: string;
    score: number;
    strengths: string[];
    keywords: string[];
    ranking: { [keyword: string]: number };
    seoScore: number;
    domain: string;
    organicTraffic: number;
    totalKeywords: number;
    backlinksCount: number;
    domainAuthority: number;
    site: string;
    topKeywords: KeywordWithMetrics[];
  };
  opportunities: Array<{
    keyword: string;
    difficulty: number;
    volume: number;
    yourPosition: number;
    comp1Position: number;
    comp2Position: number;
    opportunity: string;
  }>;
  actionPlan: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    description: string;
    timeframe: string;
    impact: string;
  }>;
  keywordGaps: string[];
  contentGaps: string[];
  technicalIssues: string[];
  commonKeywords: Array<{
    keyword: string;
    volume: number;
    yourPosition: number;
    competitor1Position: number;
    competitor2Position: number;
  }>;
  comparison: {
    keywordGaps: string[];
    opportunities: string[];
    strengthComparison: Array<{
      site: string;
      strength: number;
    }>;
    positionAnalysis: Array<{
      keyword: string;
      yourPosition: number;
      comp1Position: number;
      comp2Position: number;
    }>;
  };
}
