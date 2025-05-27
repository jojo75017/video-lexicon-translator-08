
export * from './Keyword';
export * from './InternalLinks';

export interface CompetitorData {
  domain: string;
  title: string;
  description: string;
  keywords: string[];
  ranking: number;
  traffic: number;
  authority: number;
}

export interface SocialMetricsProps {
  metrics: {
    facebook: number;
    twitter: number;
    pinterest: number;
    linkedin: number;
  };
}

export interface OrganicSearchProps {
  keywords: string[];
  totalKeywords: number;
  averagePosition: number;
  visibility: number;
}

export interface AnalysisOptions {
  includeKeywords?: boolean;
  includeCompetitors?: boolean;
  includeBacklinks?: boolean;
  depth?: number;
}
