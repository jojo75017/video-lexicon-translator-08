
export const analyzeIndexability = (doc: Document) => {
  // Vérifier si le document contient du contenu réel
  if (!doc.body || doc.body.textContent?.trim().length === 0) {
    return {
      canIndex: false,
      indexablePages: 0,
      reasons: ['Document vide ou inaccessible'],
      recommendations: ['Vérifiez les erreurs CORS ou l\'accessibilité de l\'URL']
    };
  }

  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content');
  const noindexPresent = robotsMeta?.includes('noindex');
  
  // Recherche des éléments qui pourraient indiquer que la page ne doit pas être indexée
  const xRobotsTag = doc.querySelector('meta[name="x-robots-tag"]')?.getAttribute('content');
  const canonicalLink = doc.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const robotsTxt = false; // En réalité, cela nécessiterait de vérifier le fichier robots.txt
  
  // Compte le nombre de pages indexables
  const links = Array.from(doc.querySelectorAll('a[href]'));
  const internalLinks = links.filter(link => {
    const href = link.getAttribute('href');
    return href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:');
  });
  
  const reasons: string[] = [];
  const recommendations: string[] = [];
  
  if (noindexPresent) {
    reasons.push('La balise meta robots contient noindex');
    recommendations.push('Retirez noindex si vous souhaitez que la page soit indexée');
  }
  
  if (xRobotsTag && xRobotsTag.includes('noindex')) {
    reasons.push('La balise x-robots-tag contient noindex');
    recommendations.push('Vérifiez les en-têtes HTTP pour la présence de x-robots-tag: noindex');
  }
  
  if (canonicalLink && !canonicalLink.includes(window.location.hostname)) {
    reasons.push('La balise canonique pointe vers un autre domaine');
    recommendations.push('Assurez-vous que la balise canonique pointe vers votre propre domaine');
  }
  
  if (internalLinks.length < 5) {
    recommendations.push('Ajoutez plus de liens internes pour améliorer la découvrabilité');
  }
  
  return {
    canIndex: !noindexPresent && !(xRobotsTag && xRobotsTag.includes('noindex')),
    indexablePages: internalLinks.length,
    reasons,
    recommendations,
  };
};
