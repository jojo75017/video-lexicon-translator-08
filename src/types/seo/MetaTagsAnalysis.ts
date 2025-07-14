
export interface MetaTagsAnalysis {
  hasTitle: boolean;
  hasDescription: boolean;
  hasRobotsTag: boolean;
  hasOpenGraphTags: boolean;
  hasTwitterTags?: boolean;
  titleLength: number;
  descriptionLength: number;
  canonicalUrl: string | null;
  robotsContent: string | null;
}
