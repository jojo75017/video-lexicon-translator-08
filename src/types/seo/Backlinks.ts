
export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  dofollow: boolean;
  authority?: number;
  isDofollow?: boolean;
  anchorText?: string;
}

export interface BrokenLink {
  url: string;
  statusCode?: number;
  status?: string;
  location?: string;
  text?: string;
}
