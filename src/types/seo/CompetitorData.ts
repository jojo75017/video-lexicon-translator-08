
export interface CompetitorData {
  name: string;
  url: string;
  domain: string;
  title: string;
  description: string;
  ranking: number;
  traffic: number;
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
  yourSite: CompetitorAnalysisResult;
  competitor1: CompetitorAnalysisResult;
  competitor2: CompetitorAnalysisResult;
  comparison: {
    keywordGaps: string[];
    strengthComparison: { site: string; strength: number; }[];
    positionAnalysis: { keyword: string; yourPosition: number; comp1Position: number; comp2Position: number; }[];
    opportunities: string[];
  };
}

export interface CompetitorAnalysisResult {
  site: string;
  domain: string;
  seoScore: number;
  topKeywords: { keyword: string; position: number; volume: number; }[];
  totalKeywords: number;
  organicTraffic: number;
  backlinksCount: number;
  domainAuthority: number;
  technicalSeo: {
    loadSpeed: number;
    mobileOptimization: number;
    sslCertificate: boolean;
    structuredData: boolean;
  };
}
