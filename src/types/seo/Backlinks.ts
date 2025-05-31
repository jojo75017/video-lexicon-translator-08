
export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  authority: number;
  isDoFollow: boolean;
  isSpam?: boolean;
  dateFound?: string;
}
