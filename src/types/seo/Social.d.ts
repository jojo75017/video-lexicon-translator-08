
// Types liés aux réseaux sociaux

export interface SocialMetrics {
  facebook: {
    likes: number;
    shares: number;
    comments: number;
    engagements?: number;
  };
  twitter: {
    tweets: number;
    retweets: number;
    likes: number;
    shares?: number;
    replies?: number;
  };
  linkedin: {
    shares: number;
    engagements: number;
  };
  pinterest: {
    pins: number;
    saves?: number;
  };
}

export interface SocialTags {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}
