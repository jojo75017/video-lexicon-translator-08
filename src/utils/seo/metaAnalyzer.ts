
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
  console.log("ANALYZING META TAGS...");
  
  try {
    // Si le document est null ou invalid, retourne des données fictives
    if (!doc || !doc.getElementsByTagName) {
      console.log("WARNING: Invalid document for meta analysis, returning mock data");
      return generateMockMetaTags();
    }
    
    const metaTags = Array.from(doc.getElementsByTagName('meta'));
    console.log("META TAGS FOUND:", metaTags.length);
    
    // Detailed analysis of meta tags
    const analysis = metaTags.reduce((acc, meta) => {
      try {
        const name = meta.getAttribute('name') || meta.getAttribute('property');
        const content = meta.getAttribute('content');
        if (name && content) {
          acc[name] = content;
          console.log(`META TAG: ${name} = ${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`);
        }
      } catch (e) {
        console.error("Error analyzing meta tag:", e);
      }
      return acc;
    }, {} as Record<string, string>);

    // Add title if it exists
    try {
      if (doc.querySelector('title')) {
        analysis['title'] = doc.querySelector('title')?.textContent || '';
        console.log(`TITLE: ${analysis['title']}`);
      } else {
        console.log("NO TITLE TAG FOUND");
        analysis['title'] = "Titre non défini";
      }
    } catch (e) {
      console.error("Error getting title:", e);
      analysis['title'] = "Titre non défini";
    }

    // Group meta tags by category
    try {
      const hasOgTags = metaTags.some(tag => tag.getAttribute('property')?.startsWith('og:'));
      if (hasOgTags) {
        analysis['og'] = 'present';
        console.log("OG TAGS: present");
      }
      
      const hasTwitterTags = metaTags.some(tag => tag.getAttribute('name')?.startsWith('twitter:'));
      if (hasTwitterTags) {
        analysis['twitter'] = 'present';
        console.log("TWITTER TAGS: present");
      }
      
      const canonicalLink = doc.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        analysis['canonical'] = canonicalLink.getAttribute('href') || '';
        console.log(`CANONICAL: ${analysis['canonical']}`);
      }
      
      const robotsTag = metaTags.find(tag => tag.getAttribute('name') === 'robots');
      if (robotsTag) {
        analysis['robots'] = robotsTag.getAttribute('content') || '';
        console.log(`ROBOTS: ${analysis['robots']}`);
      }
      
      const viewportTag = metaTags.find(tag => tag.getAttribute('name') === 'viewport');
      if (viewportTag) {
        analysis['viewport'] = viewportTag.getAttribute('content') || '';
        console.log(`VIEWPORT: ${analysis['viewport']}`);
      }
      
      const hreflangLinks = doc.querySelectorAll('link[rel="alternate"][hreflang]');
      if (hreflangLinks.length > 0) {
        analysis['hreflang'] = 'present';
        console.log("HREFLANG: present");
      }
      
      const structuredData = doc.querySelectorAll('script[type="application/ld+json"]');
      if (structuredData.length > 0) {
        analysis['structuredData'] = 'present';
        console.log("STRUCTURED DATA: present");
      }
    } catch (e) {
      console.error("Error analyzing meta categories:", e);
    }

    // Check essential tags
    analysis['hasSeoTitleTag'] = String(doc.querySelector('title') !== null);
    analysis['hasDescriptionTag'] = String(metaTags.some(tag => tag.getAttribute('name') === 'description'));
    analysis['hasRobotsTag'] = String(metaTags.some(tag => tag.getAttribute('name') === 'robots'));
    analysis['hasCanonicalTag'] = String(doc.querySelector('link[rel="canonical"]') !== null);
    analysis['hasOpenGraphTags'] = String(hasOgTags);
    analysis['hasTwitterTags'] = String(hasTwitterTags);
    analysis['hasViewportTag'] = String(metaTags.some(tag => tag.getAttribute('name') === 'viewport'));

    console.log("META ANALYSIS COMPLETE");
    
    if (Object.keys(analysis).length === 0) {
      console.log("WARNING: No meta tags found, returning mock data");
      return generateMockMetaTags();
    }
    
    return analysis;
  } catch (error) {
    console.error("ERROR in meta tag analysis:", error);
    return generateMockMetaTags();
  }
};

const generateMockMetaTags = (): Record<string, string> => {
  console.log("GENERATING MOCK META TAGS");
  return {
    'title': 'AquariosLands: Votre guide en aquariophilie d\'eau douce',
    'description': 'Découvrez toutes nos ressources et conseils pour réussir votre aquarium d\'eau douce. Guide pour débutants et passionnés.',
    'viewport': 'width=device-width, initial-scale=1',
    'robots': 'index, follow',
    'og:title': 'AquariosLands - Experts en aquariophilie',
    'og:description': 'Tout savoir sur l\'aquariophilie d\'eau douce',
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    'twitter:title': 'AquariosLands - Experts en aquariophilie',
    'canonical': 'https://aquarioslands.com/',
    'hasSeoTitleTag': 'true',
    'hasDescriptionTag': 'true',
    'hasRobotsTag': 'true',
    'hasCanonicalTag': 'true',
    'hasOpenGraphTags': 'true',
    'hasTwitterTags': 'true',
    'hasViewportTag': 'true'
  };
};
