
export interface SocialMetrics {
  facebook: {
    shares: number;
    comments: number;
    likes: number;
  };
  twitter: {
    tweets: number;
    retweets: number;
    likes: number;
    shares: number;
    replies: number;
  };
  pinterest: {
    pins: number;
    saves: number;
  };
  linkedin: {
    shares: number;
    engagements: number;
  };
}

export interface SocialTags {
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl?: string;
  ogType?: string;
  ogSiteName?: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCreator?: string;
  twitterSite?: string;
}
