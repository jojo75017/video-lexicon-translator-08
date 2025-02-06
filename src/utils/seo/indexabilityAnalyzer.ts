
export const analyzeIndexability = (doc: Document) => {
  const robotsMeta = doc.querySelector('meta[name="robots"]')?.getAttribute('content');
  const noindexPresent = robotsMeta?.includes('noindex');
  
  return {
    canIndex: !noindexPresent,
    reasons: noindexPresent ? ['La balise meta robots contient noindex'] : [],
    recommendations: noindexPresent ? ['Retirez noindex si vous souhaitez que la page soit indexée'] : [],
  };
};

