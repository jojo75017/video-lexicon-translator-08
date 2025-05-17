
export const analyzeSemanticStructure = (doc: Document) => {
  return ['article', 'aside', 'footer', 'header', 'main', 'nav', 'section']
    .reduce((acc, tag) => {
      acc[tag] = doc.getElementsByTagName(tag).length;
      return acc;
    }, {} as Record<string, number>);
};

export const analyzeReadability = (textContent: string) => {
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) return 50; // valeur par défaut
  
  return Math.min(100, Math.max(0, 100 - (
    sentences.reduce((acc, sentence) => acc + sentence.split(/\s+/).length, 0) / sentences.length - 15
  ) * 5));
};

export const analyzePageStructure = (doc: Document) => {
  const h1Elements = doc.querySelectorAll('h1');
  const h2Elements = doc.querySelectorAll('h2');
  const h3Elements = doc.querySelectorAll('h3');
  const h4Elements = doc.querySelectorAll('h4');
  const paragraphs = doc.querySelectorAll('p');
  const images = doc.querySelectorAll('img');
  const lists = doc.querySelectorAll('ul, ol');
  
  // Extract heading text
  const headings = {
    h1: Array.from(h1Elements).map(el => el.textContent || ''),
    h2: Array.from(h2Elements).map(el => el.textContent || ''),
    h3: Array.from(h3Elements).map(el => el.textContent || ''),
    h4: Array.from(h4Elements).map(el => el.textContent || '')
  };
  
  // Extract paragraph text (limited to first 200 characters)
  const paragraphTexts = Array.from(paragraphs).map(p => {
    const text = p.textContent || '';
    return text.length > 200 ? text.substring(0, 200) + '...' : text;
  });
  
  // Analyze word count
  const allText = Array.from(doc.body.querySelectorAll('*'))
    .filter(el => !['script', 'style', 'noscript', 'iframe'].includes(el.tagName.toLowerCase()))
    .map(el => el.textContent || '')
    .join(' ');
  
  const wordCount = allText.split(/\s+/).filter(Boolean).length;
  
  // Extract common phrases (3+ words that appear multiple times)
  const phrases: Record<string, number> = {};
  const words = allText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  for (let i = 0; i < words.length - 2; i++) {
    const phrase = words.slice(i, i + 3).join(' ');
    phrases[phrase] = (phrases[phrase] || 0) + 1;
  }
  
  const topPhrases = Object.entries(phrases)
    .filter(([_, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([phrase, count]) => ({ phrase, count }));
  
  // Extract questions from content
  const questions = paragraphTexts
    .filter(text => text.includes('?'))
    .flatMap(text => text.split(/[.!]/).filter(s => s.includes('?')))
    .map(q => q.trim())
    .filter(q => q.length > 10);

  // Analyze optimization status
  const optimizationStatus = {
    h1: {
      count: h1Elements.length,
      isOptimized: h1Elements.length === 1,
      message: h1Elements.length === 0 ? "Aucune balise H1 trouvée" : 
              h1Elements.length > 1 ? "Plusieurs balises H1 trouvées (1 seule recommandée)" : 
              "Bonne utilisation d'une seule balise H1"
    },
    h2: {
      count: h2Elements.length,
      isOptimized: h2Elements.length > 0,
      message: h2Elements.length === 0 ? "Aucune balise H2 trouvée" : 
              h2Elements.length > 5 ? "Nombreuses balises H2 trouvées" : 
              "Bonne utilisation des balises H2"
    },
    h3: {
      count: h3Elements.length,
      isOptimized: h3Elements.length > 0,
      message: h3Elements.length === 0 ? "Aucune balise H3 trouvée" : 
              "Bonne structure avec balises H3"
    },
    structure: {
      isOptimized: h1Elements.length === 1 && h2Elements.length > 0,
      message: h1Elements.length === 1 && h2Elements.length > 0 ? 
              "Structure hiérarchique correcte" : 
              "Structure hiérarchique à améliorer"
    },
    imgAlt: {
      count: Array.from(images).filter(img => !img.hasAttribute('alt') || img.getAttribute('alt') === '').length,
      isOptimized: Array.from(images).every(img => img.hasAttribute('alt') && img.getAttribute('alt') !== ''),
      message: Array.from(images).every(img => img.hasAttribute('alt') && img.getAttribute('alt') !== '') ?
              "Toutes les images ont un attribut alt" :
              `${Array.from(images).filter(img => !img.hasAttribute('alt') || img.getAttribute('alt') === '').length} image(s) sans attribut alt`
    }
  };
  
  return {
    headingCounts: {
      h1: h1Elements.length,
      h2: h2Elements.length,
      h3: h3Elements.length,
      h4: h4Elements.length
    },
    headings,
    paragraphCount: paragraphs.length,
    imageCount: images.length,
    listCount: lists.length,
    wordCount,
    topPhrases,
    questions: questions.slice(0, 10),
    contentDensity: wordCount / (doc.body.innerHTML.length || 1),
    textToHtmlRatio: allText.length / (doc.body.innerHTML.length || 1),
    optimizationStatus
  };
};

export const extractQuestionsFromContent = (text: string): string[] => {
  if (!text || typeof text !== 'string') return [];
  
  // Find sentences ending with question marks
  const questions = text
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => sentence.trim().endsWith('?'))
    .map(q => q.trim())
    .filter(q => q.length > 10);
  
  // Add some common question patterns if they're not already included
  const commonPatterns = [
    "what is", "how to", "why does", "when should", "where can", "who should"
  ];
  
  const keywordsFromText = text.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 4)
    .filter(w => !commonPatterns.some(p => w.includes(p)))
    .slice(0, 10);
  
  const generatedQuestions = keywordsFromText
    .map((keyword, index) => {
      const pattern = commonPatterns[index % commonPatterns.length];
      return `${pattern.charAt(0).toUpperCase() + pattern.slice(1)} ${keyword}?`;
    })
    .slice(0, 5);
  
  return [...questions, ...generatedQuestions].slice(0, 15);
};

export const calculateSeoROI = (
  traffic: number, 
  conversionRate: number, 
  avgOrderValue: number
) => {
  const monthlyVisitors = traffic;
  const monthlyConversions = monthlyVisitors * (conversionRate / 100);
  const monthlyRevenue = monthlyConversions * avgOrderValue;
  const yearlyRevenue = monthlyRevenue * 12;
  
  return {
    monthlyVisitors,
    monthlyConversions,
    monthlyRevenue,
    yearlyRevenue,
    roi: {
      threeMonths: monthlyRevenue * 3,
      sixMonths: monthlyRevenue * 6,
      oneYear: yearlyRevenue,
      twoYears: yearlyRevenue * 2
    }
  };
};

