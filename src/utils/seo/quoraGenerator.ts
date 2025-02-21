
export const generateQuoraContent = (
  keyword: string,
  targetWordCount: number,
  includeLink?: string
) => {
  const quoraTitle = `Comprendre ${keyword} en 2024 : Guide Complet`;
  
  const quoraQuestion = `Quelles sont les meilleures pratiques pour optimiser ${keyword} en 2024 ?`;
  
  let quoraAnswer = `À l'ère du numérique, ${keyword} est devenu un élément essentiel pour toute stratégie marketing efficace. Les dernières tendances et analyses montrent que l'optimisation de ${keyword} peut considérablement améliorer la visibilité en ligne et le retour sur investissement.\n\n`;
  
  quoraAnswer += `Voici les points clés à considérer :\n\n`;
  quoraAnswer += `1. Analyse approfondie des données\n`;
  quoraAnswer += `2. Optimisation continue des performances\n`;
  quoraAnswer += `3. Adaptation aux nouvelles technologies\n\n`;
  
  if (includeLink) {
    quoraAnswer += `Pour plus d'informations détaillées, vous pouvez consulter ce guide complet : ${includeLink}`;
  }

  return {
    title: quoraTitle,
    question: quoraQuestion,
    answer: quoraAnswer
  };
};
