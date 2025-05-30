
export interface MetaTagsAnalysis {
  title?: string;
  description?: string;
  keywords?: string[];
  hasMetaDescription: boolean;
  hasMetaKeywords: boolean;
  titleLength: number;
  descriptionLength: number;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  canonical?: string;
  robots?: string;
  viewport?: string;
  charset?: string;
}
