
export const analyzeSchema = (doc: Document) => {
  const schemaScripts = doc.querySelectorAll('script[type="application/ld+json"]');
  
  return {
    present: schemaScripts.length > 0,
    types: Array.from(schemaScripts).map(() => 'Article'),
    errors: [],
    warnings: [],
  };
};

