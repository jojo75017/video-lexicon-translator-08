
// Types liés aux images

export interface ImageAnalysis {
  url: string;
  hasAlt: boolean;
  altText?: string;
  alt?: string;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
  isOptimized?: boolean;
  optimizationSuggestions?: string[];
  dimensions?: any;
}

export interface ImageDetails extends ImageAnalysis {
  url: string;
  alt: string;
  width: number;
  height: number;
  size: number;
  format: string;
  hasAlt: boolean;
  lazyLoaded?: boolean;
  isDecorative?: boolean;
  needsOptimization?: boolean;
  estimatedSize?: string;
  index?: number;
}
