
import { BacklinkInfo } from '@/types/seo';

export const analyzeBacklinks = () => {
  const backlinksCount = Math.floor(Math.random() * 15) + 5; // Entre 5 et 20 backlinks
  const backlinkDetails: BacklinkInfo[] = [];
  const domains = [
    'blog-marketing.fr',
    'actualites-web.com',
    'reference-digital.net',
    'conseils-seo.fr',
    'marketing-strategies.com'
  ];
  
  for (let i = 0; i < backlinksCount; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    backlinkDetails.push({
      url: `https://${domain}/article-${i + 1}`,
      domain: domain,
      authority: Math.floor(Math.random() * 30) + 10, // Entre 10-40
      isDoFollow: Math.random() > 0.3, // 70% de chance d'être dofollow
      anchorText: "Votre Site Web",
      firstSeen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() // Dans les 90 derniers jours
    });
  }

  const topBacklinkDomains = domains.map(domain => ({
    domain,
    count: Math.floor(Math.random() * 3) + 1 // Entre 1-4 backlinks par domaine
  }));

  return {
    backlinks: backlinksCount,
    backlinkDetails,
    topBacklinkDomains,
    doFollowBacklinks: Math.floor(backlinksCount * 0.7),
    noFollowBacklinks: Math.floor(backlinksCount * 0.3),
  };
};
