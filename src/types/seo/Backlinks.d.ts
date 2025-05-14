
// Types liés aux backlinks

export interface BacklinkInfo {
  domain: string;
  url: string;
  anchor: string;
  doFollow: boolean;
  isDofollow?: boolean;
  domainAuthority?: number;
  authority?: number;
  firstSeen?: string;
  lastDetected?: string;
  followType?: string;
  date?: string;
}

export interface BrokenLink {
  url: string;
  anchor: string;
  statusCode: number;
}
