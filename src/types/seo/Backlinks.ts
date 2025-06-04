
export interface BacklinkData {
  url: string;
  domain: string;
  anchor: string;
  anchorText: string;
  authority: number;
  isDoFollow: boolean;
  dofollow: boolean;
  isDofollow: boolean;
  isSpam?: boolean;
  dateFound?: string;
  isEuropean: boolean;
}

export interface BrokenLink {
  url: string;
  anchor: string;
  statusCode: number;
  lastChecked: string;
  pageUrl: string;
}

export interface BacklinkAnalysis {
  totalBacklinks: number;
  uniqueDomains: number;
  averageAuthority: number;
  dofollowPercentage: number;
  spamScore: number;
  trends: {
    newBacklinks: number;
    lostBacklinks: number;
    period: string;
  };
}
