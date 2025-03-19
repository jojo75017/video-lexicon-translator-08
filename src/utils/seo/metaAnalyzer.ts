
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
  
  // Detailed analysis of meta tags
  const analysis = metaTags.reduce((acc, meta) => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      acc[name] = content;
    }
    return acc;
  }, {} as Record<string, string>);

  // Add title if it exists
  if (doc.querySelector('title')) {
    analysis['title'] = doc.querySelector('title')?.textContent || '';
  }

  // Group meta tags by category
  if (metaTags.some(tag => tag.getAttribute('property')?.startsWith('og:'))) {
    analysis['og'] = 'present';
  }
  
  if (metaTags.some(tag => tag.getAttribute('name')?.startsWith('twitter:'))) {
    analysis['twitter'] = 'present';
  }
  
  if (doc.querySelector('link[rel="canonical"]')) {
    analysis['canonical'] = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
  }
  
  if (metaTags.some(tag => tag.getAttribute('name') === 'robots')) {
    analysis['robots'] = metaTags.find(tag => tag.getAttribute('name') === 'robots')?.getAttribute('content') || '';
  }
  
  if (metaTags.some(tag => tag.getAttribute('name') === 'viewport')) {
    analysis['viewport'] = metaTags.find(tag => tag.getAttribute('name') === 'viewport')?.getAttribute('content') || '';
  }
  
  if (doc.querySelector('link[rel="alternate"][hreflang]')) {
    analysis['hreflang'] = 'present';
  }
  
  if (doc.querySelector('script[type="application/ld+json"]')) {
    analysis['structuredData'] = 'present';
  }

  // Check essential tags
  analysis['hasSeoTitleTag'] = String(doc.querySelector('title') !== null);
  analysis['hasDescriptionTag'] = String(metaTags.some(tag => tag.getAttribute('name') === 'description'));
  analysis['hasRobotsTag'] = String(metaTags.some(tag => tag.getAttribute('name') === 'robots'));
  analysis['hasCanonicalTag'] = String(doc.querySelector('link[rel="canonical"]') !== null);
  analysis['hasOpenGraphTags'] = String(metaTags.some(tag => tag.getAttribute('property')?.startsWith('og:')));
  analysis['hasTwitterTags'] = String(metaTags.some(tag => tag.getAttribute('name')?.startsWith('twitter:')));
  analysis['hasViewportTag'] = String(metaTags.some(tag => tag.getAttribute('name') === 'viewport'));

  return analysis;
};
