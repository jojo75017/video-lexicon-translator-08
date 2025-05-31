
export interface MetaTagsAnalysis {
  hasTitle: boolean;
  hasDescription: boolean;
  hasKeywords?: boolean;
  hasOpenGraphTags?: boolean;
  hasTwitterCards?: boolean;
  titleLength?: number;
  descriptionLength?: number;
}
