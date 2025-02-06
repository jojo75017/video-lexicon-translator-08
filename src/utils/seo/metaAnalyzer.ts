
export const analyzeMetaTags = (doc: Document) => {
  return Array.from(doc.getElementsByTagName('meta')).reduce((acc, meta) => {
    const name = meta.getAttribute('name') || meta.getAttribute('property');
    const content = meta.getAttribute('content');
    if (name && content) {
      acc[name] = content;
    }
    return acc;
  }, {} as Record<string, string>);
};

