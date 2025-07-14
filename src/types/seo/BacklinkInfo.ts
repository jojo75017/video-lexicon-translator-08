
export interface BacklinkInfo {
  domain: string;
  url: string;
  anchor?: string;
  authority: number;
  isDoFollow: boolean;
  firstSeen?: string;
  lastSeen?: string;
  targetUrl?: string;
  linkType?: string;
}

export interface BrokenLink {
  url: string;
  anchor: string;
  status: number;
  page: string;
  type: 'internal' | 'external';
}
