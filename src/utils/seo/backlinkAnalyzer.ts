
import { BacklinkInfo } from '@/types/seo';

export const analyzeBacklinks = (domain: string): {
  backlinks: number;
  doFollowBacklinks: number;
  noFollowBacklinks: number;
  backlinkDetails: BacklinkInfo[];
  topBacklinkDomains: { domain: string; count: number }[];
} => {
  // Mock data for backlink analysis
  const totalBacklinks = Math.floor(Math.random() * 1000) + 100;
  const doFollowPercentage = Math.random() * 0.7 + 0.3; // Between 30% and 100%
  const doFollowBacklinks = Math.floor(totalBacklinks * doFollowPercentage);
  const noFollowBacklinks = totalBacklinks - doFollowBacklinks;
  
  const referringDomains = [
    'example.com', 'blog.example.com', 'wikipedia.org', 'medium.com', 
    'yourblog.com', 'industry-forum.com', 'news-site.com', 'partner-site.org'
  ];
  
  // Generate mock backlink details
  const backlinkDetails: BacklinkInfo[] = [];
  const domainCounts: Record<string, number> = {};
  
  for (let i = 0; i < Math.min(10, totalBacklinks); i++) {
    const randomDomain = referringDomains[Math.floor(Math.random() * referringDomains.length)];
    const isDoFollow = Math.random() > 0.3; // 70% chance of being dofollow
    
    if (!domainCounts[randomDomain]) {
      domainCounts[randomDomain] = 0;
    }
    domainCounts[randomDomain]++;
    
    backlinkDetails.push({
      domain: randomDomain,
      url: `https://${randomDomain}/page-${i + 1}`,
      anchorText: `Sample anchor text ${i + 1}`,
      followType: isDoFollow ? 'follow' : 'nofollow',
      authority: Math.floor(Math.random() * 90) + 10,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isDoFollow: isDoFollow,
      firstSeen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
  }
  
  // Generate top backlink domains
  const topBacklinkDomains = Object.entries(domainCounts)
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  return {
    backlinks: totalBacklinks,
    doFollowBacklinks,
    noFollowBacklinks,
    backlinkDetails,
    topBacklinkDomains
  };
};
