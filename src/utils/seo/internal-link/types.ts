
import { InternalLinkAnalysis, InternalLinkRecommendation } from '@/types/seo';

export interface SiloStructure {
  name: string;
  mainPage: string;
  subPages: string[];
}

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
