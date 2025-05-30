
export interface ImageDetails {
  url: string;
  alt?: string;
  title?: string;
  size?: string;
  width?: number;
  height?: number;
  format?: string;
  optimized?: boolean;
  loading?: 'lazy' | 'eager';
  hasAlt?: boolean;
}
