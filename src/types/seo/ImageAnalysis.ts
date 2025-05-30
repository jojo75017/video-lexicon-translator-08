
export interface ImageAnalysis {
  url: string;
  alt?: string;
  title?: string;
  size?: string;
  width?: number;
  height?: number;
  format?: string;
  optimized?: boolean;
  loading?: 'lazy' | 'eager';
}

export interface ImageDetail extends ImageAnalysis {}
