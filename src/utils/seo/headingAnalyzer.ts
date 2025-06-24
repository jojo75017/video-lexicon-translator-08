
export interface HeadingStructure {
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4Count: number;
  h5Count: number;
  h6Count: number;
  headings: Array<{
    level: number;
    text: string;
  }>;
}

export const analyzeHeadings = (doc: Document): HeadingStructure => {
  const headings: Array<{ level: number; text: string }> = [];
  
  // Compter et collecter tous les titres
  for (let i = 1; i <= 6; i++) {
    const elements = doc.querySelectorAll(`h${i}`);
    elements.forEach(element => {
      const text = element.textContent?.trim() || '';
      if (text) {
        headings.push({
          level: i,
          text: text.substring(0, 100) // Limiter la longueur
        });
      }
    });
  }
  
  return {
    h1Count: doc.querySelectorAll('h1').length,
    h2Count: doc.querySelectorAll('h2').length,
    h3Count: doc.querySelectorAll('h3').length,
    h4Count: doc.querySelectorAll('h4').length,
    h5Count: doc.querySelectorAll('h5').length,
    h6Count: doc.querySelectorAll('h6').length,
    headings: headings.sort((a, b) => a.level - b.level)
  };
};
