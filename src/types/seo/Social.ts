
export interface SocialTags {
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export interface SocialMetrics {
  shares?: number;
  likes?: number;
  comments?: number;
  platform?: string;
}
