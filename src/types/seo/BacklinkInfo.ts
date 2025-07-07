
export interface BacklinkInfo {
  domain: string;
  url: string;
  anchor: string;
  authority: number;
  isDoFollow: boolean;
  dofollow?: boolean; // For backward compatibility
}
