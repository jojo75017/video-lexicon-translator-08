
export interface PinterestImage {
  id: string;
  url: string;
  title: string;
  category: 'monde' | 'europe' | 'france';
  country?: string;
  region?: string;
  source?: 'pixabay' | 'unsplash' | 'local';
  tags?: string[];
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

export interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayImage[];
}

export interface PixabayImage {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}

export interface UnsplashResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export interface UnsplashImage {
  id: string;
  created_at: string;
  updated_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  links: {
    self: string;
    html: string;
    download: string;
    download_location: string;
  };
  user: {
    id: string;
    username: string;
    name: string;
    portfolio_url: string | null;
    bio: string | null;
    location: string | null;
    profile_image: {
      small: string;
      medium: string;
      large: string;
    };
    instagram_username: string | null;
    twitter_username: string | null;
  };
  tags: { title: string }[];
}
