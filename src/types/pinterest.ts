export interface PinterestImage {
  id: string;
  url: string;
  title: string;
  category: 'monde' | 'europe' | 'france';
  country?: string;
  region?: string;
  source?: 'pixabay' | 'unsplash' | 'freepik' | 'pexels' | 'local';
  tags?: string[];
  fallbackUrl?: string; // URL de secours en cas de problème
  verified?: boolean;    // Indique si l'image a été vérifiée pour la cohérence
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
  tags: string[];  // Étiquettes
  callToAction: string;
  image: PinterestImage | null;
  uploadedImage: string | null;
  design: PinterestDesign;
  showHashtags?: boolean; // New optional property
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

// Ajout de constantes pour les images de secours fiables
export const RELIABLE_FALLBACK_IMAGES = {
  monde: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?q=80&w=2071&auto=format&fit=crop',
  europe: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=2070&auto=format&fit=crop',
  france: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1488229297570-58520851e868?q=80&w=2069&auto=format&fit=crop'
};

// Constantes pour la vérification de la cohérence
export const FRANCE_LOCATIONS = [
  'paris', 'marseille', 'lyon', 'nice', 'toulouse', 'bordeaux', 'lille', 'strasbourg', 'montpellier',
  'dijon', 'nantes', 'bretagne', 'normandie', 'provence', 'alpes', 'corse', 'côte d\'azur', 'rhône'
];

export const EUROPE_LOCATIONS = [
  'rome', 'berlin', 'barcelone', 'madrid', 'lisbonne', 'athènes', 'amsterdam', 'londres', 'venise',
  'prague', 'vienne', 'budapest', 'dubrovnik', 'munich', 'copenhague', 'stockholm', 'oslo', 'milan',
  'florence', 'dublin', 'bruxelles', 'édimbourg', 'porto', 'cracovie', 'zurich', 'genève'
];

export const WORLD_LOCATIONS = [
  'new york', 'tokyo', 'sydney', 'dubai', 'rio de janeiro', 'miami', 'san francisco', 'los angeles',
  'chicago', 'pékin', 'shanghai', 'hong kong', 'bangkok', 'delhi', 'mumbai', 'singapour', 'mexico',
  'le caire', 'istanbul', 'cape town', 'marrakech', 'toronto', 'vancouver', 'montréal', 'québec'
];
