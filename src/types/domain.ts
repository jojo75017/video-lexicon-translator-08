
export interface DomainSuggestion {
  domain: string;
  available: boolean;
  price?: string;
  score: number;
  reason?: string;
}
