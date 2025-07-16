
export interface ImageDetails {
  url: string;
  alt: string;
  hasAlt: boolean;
  width: number;
  height: number;
  size: string;
  format: string;
  index: number;
  isDecorative?: boolean;
  needsOptimization?: boolean;
  lazyLoaded?: boolean;
  estimatedSize?: string;
}
