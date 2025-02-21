
export const generateContentWithWordCount = (keyword: string, targetWordCount: number) => {
  const boldKeyword = `**${keyword}**`;
  
  const introductoryPhrases = [
    `Dans le monde professionnel d'aujourd'hui, ${boldKeyword} joue un rôle crucial.`,
    `L'émergence de ${boldKeyword} a transformé notre façon de travailler.`,
    `La maîtrise de ${boldKeyword} est devenue incontournable pour réussir.`,
    `Les innovations liées à ${boldKeyword} ne cessent de se multiplier.`
  ];

  const bodyPhrases = [
    `Les études récentes démontrent que ${boldKeyword} améliore significativement la productivité.`,
    `Les experts s'accordent sur l'importance croissante de ${boldKeyword} dans notre secteur.`,
    `L'adoption de ${boldKeyword} permet d'obtenir un avantage concurrentiel notable.`,
    `De plus en plus d'entreprises investissent dans ${boldKeyword} pour leur développement.`,
    `Les analyses montrent que ${boldKeyword} représente un facteur clé de succès.`,
    `La mise en place de ${boldKeyword} nécessite une stratégie bien planifiée.`,
    `Les retours d'expérience sur ${boldKeyword} sont très encourageants.`
  ];

  const bulletPoints = [
    `Les avantages stratégiques de ${boldKeyword}`,
    `Comment maximiser l'efficacité de ${boldKeyword}`,
    `Les meilleures pratiques pour implémenter ${boldKeyword}`,
    `Les tendances futures concernant ${boldKeyword}`,
    `L'impact mesurable de ${boldKeyword} sur les performances`,
    `Les facteurs clés de succès pour ${boldKeyword}`,
    `Les innovations récentes dans ${boldKeyword}`,
    `Comment optimiser l'utilisation de ${boldKeyword}`
  ];

  const generateBulletPoints = (count: number) => {
    const shuffled = [...bulletPoints].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(point => `- ${point}`).join('\n');
  };

  const generateParagraph = (phrases: string[], minWords: number) => {
    let content = '';
    const shuffledPhrases = [...phrases].sort(() => 0.5 - Math.random());
    
    while (content.split(/\s+/).length < minWords && shuffledPhrases.length > 0) {
      const phrase = shuffledPhrases.pop();
      if (phrase) {
        content += (content ? ' ' : '') + phrase;
      }
    }
    
    return content;
  };

  const introWords = Math.floor(targetWordCount * 0.2);
  const sectionWords = Math.floor((targetWordCount * 0.8) / 3);

  return {
    title: `Guide Complet : ${boldKeyword} - Tout ce que vous devez savoir`,
    intro: generateParagraph(introductoryPhrases, introWords),
    sections: [
      {
        heading: `Les Fondamentaux de ${boldKeyword}`,
        content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n${generateBulletPoints(3)}`
      },
      {
        heading: `Stratégies et Optimisation de ${boldKeyword}`,
        content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n${generateBulletPoints(3)}`
      },
      {
        heading: `Perspectives d'Avenir pour ${boldKeyword}`,
        content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n${generateBulletPoints(3)}`
      }
    ]
  };
};
