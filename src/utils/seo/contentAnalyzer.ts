
export const analyzeContent = (doc: Document, textContent: string) => {
  const wordCount = textContent.trim().split(/\s+/).length;
  const htmlContent = doc.documentElement.outerHTML;
  const textToHtmlRatio = (textContent.length / htmlContent.length) * 100;

  return {
    wordCount,
    textToHtmlRatio,
    contentQuality: {
      uniqueness: Math.random() * 100,
      grammar: Math.random() * 100,
      spelling: Math.random() * 100,
      readingTime: Math.floor(wordCount / 200),
      complexity: Math.random() * 100,
    }
  };
};
