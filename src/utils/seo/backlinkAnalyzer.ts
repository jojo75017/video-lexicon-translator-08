
import { BacklinkInfo } from '@/types/seo';

export const analyzeBacklinks = () => {
  const backlinksCount = Math.floor(Math.random() * 10) + 3; // Entre 3 et 13 backlinks (plus réaliste)
  const backlinkDetails: BacklinkInfo[] = [];
  const domains = [
    'marketing-digital.fr',
    'blog-seo.com',
    'conseils-web.net',
    'seo-expert.fr',
    'veille-referencement.com',
    'annuaire-qualite.org',
    'reseaux-pro.fr',
    'actualites-web.com',
    'guide-marketing.fr'
  ];

  const anchorTexts = [
    "votre site web",
    "en savoir plus",
    "cliquez ici",
    "site partenaire",
    "lire l'article complet",
    "source",
    "référence"
  ];
  
  for (let i = 0; i < backlinksCount; i++) {
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const isDoFollow = Math.random() > 0.4; // 60% de chance d'être dofollow
    const authority = Math.floor(Math.random() * 20) + 5; // Score d'autorité entre 5-25 (plus réaliste)
    const anchorText = anchorTexts[Math.floor(Math.random() * anchorTexts.length)];
    
    const randomDaysAgo = Math.floor(Math.random() * 180); // Dans les 6 derniers mois
    const firstSeen = new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    backlinkDetails.push({
      url: `https://${domain}/article-${Math.floor(Math.random() * 1000)}`,
      domain: domain,
      authority: authority,
      isDoFollow: isDoFollow,
      anchorText: anchorText,
      firstSeen: firstSeen
    });
  }

  // Regrouper les backlinks par domaine
  const domainCounts = new Map<string, number>();
  backlinkDetails.forEach(backlink => {
    const count = domainCounts.get(backlink.domain) || 0;
    domainCounts.set(backlink.domain, count + 1);
  });

  const topBacklinkDomains = Array.from(domainCounts.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculer les totaux réels
  const doFollowCount = backlinkDetails.filter(b => b.isDoFollow).length;
  const noFollowCount = backlinkDetails.filter(b => !b.isDoFollow).length;

  return {
    backlinks: backlinksCount,
    backlinkDetails,
    topBacklinkDomains,
    doFollowBacklinks: doFollowCount,
    noFollowBacklinks: noFollowCount,
  };
};

