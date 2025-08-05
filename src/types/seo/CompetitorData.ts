
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
  detailedAnalysis?: {
    gapAnalysis: {
      contentGaps: Array<{
        topic: string;
        opportunity: string;
        searchVolume: number;
        competition: string;
      }>;
      keywordGaps: Array<{
        keyword: string;
        yourPosition: number | null;
        c1Position: number;
        c2Position: number;
        volume: number;
      }>;
      backlinkGaps: Array<{
        domain: string;
        authority: number;
        linkingToC1: boolean;
        linkingToC2: boolean;
        opportunity: string;
      }>;
    };
    contentStrategy: {
      competitorContent: Array<{
        type: string;
        c1: { frequency: string; avgLength: number; engagement: number };
        c2: { frequency: string; avgLength: number; engagement: number };
      }>;
      topPerformingContent: Array<{
        title: string;
        c1Performance: number;
        c2Performance: number;
        shares: number;
      }>;
    };
    technicalRecommendations: Array<{
      category: string;
      priority: string;
      recommendations: string[];
      impact: string;
      difficulty: string;
    }>;
    competitorStrengths: {
      competitor1: {
        strengths: Array<{ area: string; score: number; description: string }>;
        weaknesses: Array<{ area: string; score: number; description: string }>;
      };
      competitor2: {
        strengths: Array<{ area: string; score: number; description: string }>;
        weaknesses: Array<{ area: string; score: number; description: string }>;
      };
    };
    marketingIntelligence: {
      paidStrategy: {
        c1: {
          budget: string;
          keywords: number;
          avgCPC: number;
          platforms: string[];
          topAds: Array<{ keyword: string; position: number; cpc: number }>;
        };
        c2: {
          budget: string;
          keywords: number;
          avgCPC: number;
          platforms: string[];
          topAds: Array<{ keyword: string; position: number; cpc: number }>;
        };
      };
      contentMarketing: {
        c1: { score: number; emailList: string; newsletterFreq: string };
        c2: { score: number; emailList: string; newsletterFreq: string };
      };
      socialMedia: {
        c1: {
          platforms: { [key: string]: string };
          engagement: number;
          postingFreq: string;
        };
        c2: {
          platforms: { [key: string]: string };
          engagement: number;
          postingFreq: string;
        };
      };
    };
    trendsAnalysis: {
      trafficTrends: {
        c1: { trend: string; growth: number; seasonality: string; peakMonths: string[] };
        c2: { trend: string; growth: number; seasonality: string; peakMonths: string[] };
      };
      keywordTrends: Array<{
        keyword: string;
        trend: string;
        growth: number;
        volume: number;
      }>;
      contentTrends: Array<{
        format: string;
        growth: number;
        adoption: string;
      }>;
    };
    actionPlan: Array<{
      phase: string;
      priority: string;
      tasks: Array<{
        task: string;
        effort: string;
        impact: string;
      }>;
    }>;
  };
}
