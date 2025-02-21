
interface MetaTagsResult {
  tags: Record<string, string>;
  metaStatus: {
    hasSeoTitleTag: boolean;
    hasDescriptionTag: boolean;
    hasRobotsTag: boolean;
    hasCanonicalTag: boolean;
    hasOpenGraphTags: boolean;
    hasTwitterTags: boolean;
    hasViewportTag: boolean;
  };
}

export const analyzeMetaTags = (doc: Document): Record<string, string> => {
  const metaTags = Array.from(doc.getElementsByTagName('meta'));
  
  // Analyse détaillée des meta tags
  const analysis = metaTags.reduce((acc, meta) => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      acc[name] = content;
    }
    return acc;
  }, {} as Record<string, string>);

  // Vérification des balises essentielles
  const hasSeoTitleTag = doc.querySelector('title') !== null;
  const hasDescriptionTag = metaTags.some(tag => tag.getAttribute('name') === 'description');
  const hasRobotsTag = metaTags.some(tag => tag.getAttribute('name') === 'robots');
  const hasCanonicalTag = doc.querySelector('link[rel="canonical"]') !== null;
  const hasOpenGraphTags = metaTags.some(tag => tag.getAttribute('property')?.startsWith('og:'));
  const hasTwitterTags = metaTags.some(tag => tag.getAttribute('name')?.startsWith('twitter:'));
  const hasViewportTag = metaTags.some(tag => tag.getAttribute('name') === 'viewport');

  // Ajout des statuts dans l'analyse
  analysis['hasSeoTitleTag'] = String(hasSeoTitleTag);
  analysis['hasDescriptionTag'] = String(hasDescriptionTag);
  analysis['hasRobotsTag'] = String(hasRobotsTag);
  analysis['hasCanonicalTag'] = String(hasCanonicalTag);
  analysis['hasOpenGraphTags'] = String(hasOpenGraphTags);
  analysis['hasTwitterTags'] = String(hasTwitterTags);
  analysis['hasViewportTag'] = String(hasViewportTag);

  return analysis;
};

