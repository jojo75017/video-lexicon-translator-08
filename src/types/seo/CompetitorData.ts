
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
  topKeywords: string[];
  gaps: string[];
  backlinks?: number;
  authority?: number;
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
  };
  competitor1: {
    name: string;
    url: string;
    score: number;
    strengths: string[];
    keywords: string[];
    ranking: { [keyword: string]: number };
  };
  competitor2: {
    name: string;
    url: string;
    score: number;
    strengths: string[];
    keywords: string[];
    ranking: { [keyword: string]: number };
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
}
