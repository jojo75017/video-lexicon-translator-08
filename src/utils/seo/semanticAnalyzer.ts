
export const analyzeSemanticStructure = (doc: Document) => {
  return ['article', 'aside', 'footer', 'header', 'main', 'nav', 'section']
    .reduce((acc, tag) => {
      acc[tag] = doc.getElementsByTagName(tag).length;
      return acc;
    }, {} as Record<string, number>);
};

export const analyzeReadability = (textContent: string) => {
  const sentences = textContent.split(/[.!?]+/);
  return Math.min(100, Math.max(0, 100 - (
    sentences.reduce((acc, sentence) => acc + sentence.split(/\s+/).length, 0) / sentences.length - 15
  ) * 5));
};
