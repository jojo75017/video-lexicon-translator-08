
export const generateContentWithWordCount = (keyword: string, targetWordCount: number) => {
  const boldKeyword = `**${keyword}**`;
  
  const bulletPoints = [
    `L'importance de ${boldKeyword} dans le contexte actuel`,
    `Les meilleures pratiques pour utiliser ${boldKeyword}`,
    `Comment optimiser ${boldKeyword} pour de meilleurs résultats`,
    `Les avantages concurrentiels de ${boldKeyword}`,
    `Les dernières tendances concernant ${boldKeyword}`,
    `Les outils essentiels pour gérer ${boldKeyword}`,
    `Les stratégies avancées pour ${boldKeyword}`,
    `L'impact de ${boldKeyword} sur votre performance`
  ];

  const phrases = [
    `Une approche innovante de ${boldKeyword} permet d'obtenir des résultats remarquables.`,
    `Les experts du domaine recommandent fortement l'utilisation de ${boldKeyword} pour optimiser les performances.`,
    `L'impact de ${boldKeyword} sur le marché actuel est indéniable.`,
    `Les dernières études montrent que ${boldKeyword} devient de plus en plus important dans notre secteur.`
  ];

  const generateBulletPoints = (count: number) => {
    const shuffled = [...bulletPoints].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(point => `- ${point}`).join('\n');
  };

  const generateParagraph = (targetWords: number, includeBullets: boolean = false) => {
    let content = '';
    let currentWords = 0;

    while (currentWords < targetWords * 0.6) {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      content += ' ' + randomPhrase;
      currentWords = content.split(/\s+/).length;
    }

    if (includeBullets) {
      content += '\n\n' + generateBulletPoints(3) + '\n\n';
      const remainingWords = targetWords - currentWords;
      
      if (remainingWords > 0) {
        content += phrases[Math.floor(Math.random() * phrases.length)];
      }
    }

    return content.trim();
  };

  const introWords = Math.floor(targetWordCount * 0.2);
  const sectionWords = Math.floor((targetWordCount * 0.8) / 3);

  return {
    title: `Guide Complet : ${boldKeyword} - Tout ce que vous devez savoir`,
    intro: generateParagraph(introWords),
    sections: [
      {
        heading: `Les Fondamentaux de ${boldKeyword}`,
        content: generateParagraph(sectionWords, true)
      },
      {
        heading: `Optimisation et Stratégies pour ${boldKeyword}`,
        content: generateParagraph(sectionWords, true)
      },
      {
        heading: `L'Avenir de ${boldKeyword}`,
        content: generateParagraph(sectionWords, true)
      }
    ]
  };
};
