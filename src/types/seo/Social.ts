
export interface SocialTags {
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

export interface SocialMetrics {
  facebook?: {
    shares?: number;
    comments?: number;
    likes?: number;
  };
  twitter?: {
    tweets?: number;
    retweets?: number;
    likes: number;
    shares?: number;
    replies?: number;
  };
  pinterest?: {
    pins?: number;
    saves?: number;
  };
  linkedin?: {
    shares?: number;
    engagements?: number;
  };
}
