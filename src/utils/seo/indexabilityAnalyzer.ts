
export const analyzeIndexability = (doc: Document) => {
  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content');
  const noindexPresent = robotsMeta?.includes('noindex');
  
  // Compte le nombre de pages indexables
  const links = Array.from(doc.querySelectorAll('a[href]'));
  const internalLinks = links.filter(link => {
    const href = link.getAttribute('href');
    return href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:');
  });
  
  return {
    canIndex: !noindexPresent,
    indexablePages: internalLinks.length, // Ajout du nombre de pages indexables
    reasons: noindexPresent ? ['La balise meta robots contient noindex'] : [],
    recommendations: noindexPresent ? ['Retirez noindex si vous souhaitez que la page soit indexée'] : [],
  };
};

