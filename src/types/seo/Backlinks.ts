
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

export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  anchorText?: string;
  authority: number;
  isDoFollow: boolean;
  dofollow?: boolean;
  isDofollow?: boolean;
  dateFound?: string;
}

export interface BrokenLink {
  url: string;
  anchor: string;
  statusCode: number;
  lastChecked: string;
  pageUrl: string;
  status: number;
  text: string;
  location: string;
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
