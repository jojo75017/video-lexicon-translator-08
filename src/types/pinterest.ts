
export interface PinterestImage {
  id: string;
  url: string;
  title: string;
  category: 'monde' | 'europe' | 'france';
  country?: string;
  region?: string;
}

export interface PinterestDesign {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  overlayStyle: 'none' | 'gradient' | 'solid' | 'frame';
  titleFont: string;
  descriptionFont: string;
}

export interface PinterestPin {
  title: string;
  description: string;
  hashtags: string[];
  callToAction: string;
  image: PinterestImage | null;
  uploadedImage: string | null;
  design: PinterestDesign;
}
