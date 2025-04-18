
export interface PinterestImage {
  id: string;
  title: string;
  description?: string;
  url?: string;
  src?: string;
  width?: number;
  height?: number;
  source?: string;
  tags?: string[];
  uploadedAt?: string;
  authorName?: string;
  authorUrl?: string;
}

export interface PinterestPin {
  title: string;
  description: string;
  globalDescription: string;
  hashtags: string[];
  tags: string[];
  callToAction: string;
  image: PinterestImage | null;
  uploadedImage: PinterestImage | null;
  design: any;
  showHashtags: boolean;
}
