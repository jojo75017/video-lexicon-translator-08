
export interface MetaTagsAnalysis {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  viewport: string;
  charset: string;
  robots: string;
  canonical: string;
  hasCanonical: boolean;
  titleLength: number;
  descriptionLength: number;
  issues: string[];
  suggestions: string[];
}
