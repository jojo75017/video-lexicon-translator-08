
export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  authority: number;
  isDoFollow: boolean;
  isSpam?: boolean;
  dateFound?: string;
}

export interface BrokenLink {
  url: string;
  statusCode?: number;
  status?: string;
  location?: string;
  text?: string;
}
