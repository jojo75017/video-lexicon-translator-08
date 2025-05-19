
export interface DomainSuggestion {
  domain: string;
  available: boolean;
  price?: string;
  score: number;
  reason?: string;
  aiGenerated?: boolean;
  categoryRelevance?: number;
  brandability?: number;
  memorability?: number;
  seoFriendliness?: number;
  trademarkedRisk?: 'low' | 'medium' | 'high';
}
