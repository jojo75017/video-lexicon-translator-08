export interface MetaAnalysis {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  robots: string;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  hasOgTags: boolean;
  hasTwitterTags: boolean;
  otherTags: Array<{ name: string; content: string }>;
}

export const analyzeMetaTags = (doc: Document): MetaAnalysis => {
  console.log("Analyzing meta tags from document");
  
  // Extract title
  const titleElement = doc.querySelector('title');
  const title = titleElement ? titleElement.textContent : "Titre de la page non trouvé";
  console.log("Title:", title);

  // Initialize result object
  const result: MetaAnalysis = {
    title: title || "",
    description: "",
    keywords: [],
    canonical: "",
    robots: "",
    ogTags: {},
    twitterTags: {},
    hasOgTags: false,
    hasTwitterTags: false,
    otherTags: []
  };

  try {
    // Extract all meta tags
    const metaTags = Array.from(doc.querySelectorAll('meta'));
    console.log(`Found ${metaTags.length} meta tags`);

    metaTags.forEach(tag => {
      const name = tag.getAttribute('name');
      const property = tag.getAttribute('property');
      const content = tag.getAttribute('content') || "";
      
      // Description
      if (name === 'description') {
        result.description = content;
        console.log("Description:", content);
      }
      
      // Keywords
      else if (name === 'keywords') {
        result.keywords = content.split(',').map(keyword => keyword.trim());
        console.log("Keywords:", result.keywords);
      }
      
      // Robots
      else if (name === 'robots') {
        result.robots = content;
      }
      
      // Open Graph tags
      else if (property && property.startsWith('og:')) {
        const ogKey = property.substring(3); // Remove 'og:' prefix
        result.ogTags[ogKey] = content;
        result.hasOgTags = true;
      }
      
      // Twitter tags
      else if (name && name.startsWith('twitter:')) {
        const twitterKey = name.substring(8); // Remove 'twitter:' prefix
        result.twitterTags[twitterKey] = content;
        result.hasTwitterTags = true;
      }
      
      // Other meta tags
      else if (name && content) {
        result.otherTags.push({ name, content });
      }
    });

    // Extract canonical link
    const canonicalLink = doc.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      result.canonical = canonicalLink.getAttribute('href') || "";
      console.log("Canonical:", result.canonical);
    }
  } catch (error) {
    console.error("Error during meta tags analysis:", error);
    // Continue with partial results rather than failing completely
  }

  return result;
};
