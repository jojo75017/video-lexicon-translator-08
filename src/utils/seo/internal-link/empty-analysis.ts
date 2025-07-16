
import type { InternalLinkAnalysis } from "@/types/seo/InternalLinks";

/**
 * Create an empty analysis result for when analysis fails or has no data
 */
export function createEmptyAnalysis(): InternalLinkAnalysis {
  return {
    totalLinks: 0,
    uniquePages: 0,
    linkDistribution: {
      navigationLinks: 0,
      contentLinks: 0,
      footerLinks: 0,
      sidebarLinks: 0,
      otherLinks: 0
    },
    linkDepth: {
      averageDepth: 0,
      maxDepth: 0,
      depthDistribution: {}
    },
    orphanPages: [],
    pageMetrics: [],
    siloPagesFound: false,
    recommendations: [],
    siloStructure: [],
    linkSuggestions: []
  };
}
