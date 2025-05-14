
export interface SiloStructure {
  name: string;
  mainPage: string;
  subPages: string[];
}

// Format interne : avant conversion pour le SEO report final
export interface PageData {
  url: string;
  title: string | null;
  incomingLinks: number;
  outgoingLinks: number;
  uniqueIncomingPages: Set<string>;
  uniqueOutgoingPages: Set<string>;
  depth: number;
  importance: number;
}
