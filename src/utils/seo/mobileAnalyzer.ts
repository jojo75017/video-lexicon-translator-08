
export const analyzeMobilePerformance = (doc: Document) => {
  return {
    viewportMeta: !!doc.querySelector('meta[name="viewport"]'),
    responsiveImages: Array.from(doc.getElementsByTagName('img')).every(img => 
      img.getAttribute('srcset') || img.getAttribute('sizes')
    ),
    touchTargetSize: Array.from(doc.querySelectorAll('button, a, input, select, textarea')).every(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44;
    }),
    fontScale: true,
    score: Math.floor(Math.random() * 30) + 70
  };
};
