
// Types liés aux balises meta

export interface MetaTagsAnalysis {
  hasTitleTag: boolean;
  hasDescriptionTag: boolean;
  hasCanonical: boolean;
  hasRobotsTag: boolean;
  hasOpenGraphTags: boolean;
  hasTwitterTags?: boolean;
  titleLength: number;
  descriptionLength: number;
  canonicalUrl: string | null;
  robotsContent: string | null;
  title?: string;
  description?: string;
  keywords?: string[];
  hasFavicon?: boolean;
  socialTags?: Record<string, string>;
}
