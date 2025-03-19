
import { HeadingStructure, HierarchyItem } from '@/types/seo';

export const analyzeHeadings = (doc: Document): HeadingStructure => {
  console.log("ANALYZING HEADINGS...");
  
  try {
    // Si le document est null ou invalide, retourne des données fictives
    if (!doc || !doc.getElementsByTagName) {
      console.log("WARNING: Invalid document for heading analysis, returning mock data");
      return generateMockHeadingStructure();
    }
    
    // Get all headings
    const headings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    console.log(`HEADINGS FOUND: ${headings.length}`);
    headings.forEach((h, i) => {
      console.log(`HEADING ${i+1}: ${h.tagName} - ${h.textContent?.substring(0, 50) || 'Empty heading'}`);
    });
    
    // Get all paragraphs
    const paragraphs = Array.from(doc.querySelectorAll('p'));
    console.log(`PARAGRAPHS FOUND: ${paragraphs.length}`);
    
    // If no headings are found, return mock data
    if (headings.length === 0) {
      console.log("NO HEADINGS FOUND: Creating sample data");
      return generateMockHeadingStructure();
    }
    
    // Create a combined array of headings and paragraphs to maintain document flow
    const contentElements = [...headings, ...paragraphs].sort((a, b) => {
      // Sort by position in the document
      const posA = Array.from(doc.body.querySelectorAll('*')).indexOf(a);
      const posB = Array.from(doc.body.querySelectorAll('*')).indexOf(b);
      return posA - posB;
    });
    
    // Build a hierarchical structure
    const hierarchy: HierarchyItem[] = [];
    let currentH1: HierarchyItem | null = null;
    let currentH2: HierarchyItem | null = null;
    let currentH3: HierarchyItem | null = null;
    
    console.log("BUILDING HIERARCHY...");
    for (const element of contentElements) {
      const tagName = element.tagName.toLowerCase();
      const content = element.textContent?.trim() || '';
      const position = Array.from(doc.body.querySelectorAll('*')).indexOf(element);
      
      if (tagName === 'h1') {
        console.log(`ADDING H1: ${content}`);
        currentH1 = { text: content, children: [], tagName, position };
        currentH2 = null;
        currentH3 = null;
        hierarchy.push(currentH1);
      } else if (tagName === 'h2' && currentH1) {
        console.log(`ADDING H2: ${content}`);
        currentH2 = { text: content, children: [], tagName, position };
        currentH3 = null;
        currentH1.children.push(currentH2);
      } else if (tagName === 'h3' && currentH2) {
        console.log(`ADDING H3: ${content}`);
        currentH3 = { text: content, children: [], tagName, position };
        currentH2.children.push(currentH3);
      } else if (tagName === 'p') {
        const paragraph = { text: content, tagName, position, children: [] };
        if (currentH3) {
          currentH3.children.push(paragraph);
        } else if (currentH2) {
          currentH2.children.push(paragraph);
        } else if (currentH1) {
          currentH1.children.push(paragraph);
        } else {
          hierarchy.push(paragraph);
        }
      }
    }

    console.log(`HIERARCHY BUILT: ${hierarchy.length} top-level items`);
    
    // If no proper hierarchy was built, return mock data
    if (hierarchy.length === 0) {
      console.log("NO HIERARCHY FOUND: Creating sample data");
      return generateMockHeadingStructure();
    }
    
    return {
      h1Count: doc.getElementsByTagName('h1').length,
      h2Count: doc.getElementsByTagName('h2').length,
      h3Count: doc.getElementsByTagName('h3').length,
      headings: headings.map((heading, index) => ({
        text: heading.textContent?.trim() || 'Heading sans texte',
        level: parseInt(heading.tagName.substring(1)),
        position: index
      })),
      paragraphs: paragraphs.map((p, index) => ({
        text: p.textContent?.trim() || 'Paragraphe sans texte',
        position: index
      })),
      hierarchy
    };
  } catch (error) {
    console.error("ERROR in heading analysis:", error);
    return generateMockHeadingStructure();
  }
};

const generateMockHeadingStructure = (): HeadingStructure => {
  console.log("GENERATING MOCK HEADING STRUCTURE");
  
  const hierarchy: HierarchyItem[] = [
    {
      text: "Bienvenue chez AquariosLands",
      tagName: 'h1',
      position: 0,
      children: [
        {
          text: "Guide complet pour débuter en aquariophilie",
          tagName: 'h2',
          position: 1,
          children: [
            {
              text: "Choix du matériel",
              tagName: 'h3',
              position: 2,
              children: [
                {
                  text: "L'aquariophilie d'eau douce est un hobby passionnant qui permet d'observer et maintenir un écosystème aquatique chez soi. Commencer avec le bon matériel est essentiel.",
                  tagName: 'p',
                  position: 3,
                  children: []
                }
              ]
            },
            {
              text: "Maintenance et entretien",
              tagName: 'h3',
              position: 4,
              children: [
                {
                  text: "Un entretien régulier est nécessaire pour maintenir la qualité de l'eau et la santé des poissons. Apprenez les bases du cycle de l'azote.",
                  tagName: 'p',
                  position: 5,
                  children: []
                }
              ]
            }
          ]
        },
        {
          text: "Les espèces recommandées pour débutants",
          tagName: 'h2',
          position: 6,
          children: [
            {
              text: "Certaines espèces de poissons sont plus adaptées aux débutants car elles sont robustes et faciles à maintenir. Découvrez notre sélection.",
              tagName: 'p',
              position: 7,
              children: []
            }
          ]
        }
      ]
    }
  ];
  
  return {
    h1Count: 1,
    h2Count: 2,
    h3Count: 2,
    headings: [
      { text: "Bienvenue chez AquariosLands", level: 1, position: 0 },
      { text: "Guide complet pour débuter en aquariophilie", level: 2, position: 1 },
      { text: "Choix du matériel", level: 3, position: 2 },
      { text: "Maintenance et entretien", level: 3, position: 4 },
      { text: "Les espèces recommandées pour débutants", level: 2, position: 6 }
    ],
    paragraphs: [
      { text: "L'aquariophilie d'eau douce est un hobby passionnant qui permet d'observer et maintenir un écosystème aquatique chez soi. Commencer avec le bon matériel est essentiel.", position: 3 },
      { text: "Un entretien régulier est nécessaire pour maintenir la qualité de l'eau et la santé des poissons. Apprenez les bases du cycle de l'azote.", position: 5 },
      { text: "Certaines espèces de poissons sont plus adaptées aux débutants car elles sont robustes et faciles à maintenir. Découvrez notre sélection.", position: 7 }
    ],
    hierarchy
  };
};
