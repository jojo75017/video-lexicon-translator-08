
export interface BacklinkInfo {
  url: string;
  domain: string;
  anchor: string;
  anchorText?: string;
  dofollow: boolean;
  isDofollow?: boolean; // Alias pour compatibilité
  authority?: number;
}

export interface BrokenLink {
  url: string;
  statusCode?: number;
  status?: string;
  location?: string;
  text?: string;
  anchor?: string; // Ajout pour compatibilité
}
