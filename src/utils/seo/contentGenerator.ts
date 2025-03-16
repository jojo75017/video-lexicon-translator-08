
export const generateContentWithWordCount = (keyword: string, targetWordCount: number) => {
  const boldKeyword = `<strong>${keyword}</strong>`;

  const introductoryPhrases = [
    `Dans un marché en constante évolution, ${boldKeyword} représente un enjeu majeur.`,
    `À l'heure où la compétitivité est cruciale, ${boldKeyword} fait la différence.`,
    `L'expertise en ${boldKeyword} devient un atout indispensable.`,
    `Les dernières avancées concernant ${boldKeyword} transforment notre secteur.`,
    `Face aux défis actuels, la maîtrise de ${boldKeyword} est déterminante.`,
    `L'impact grandissant de ${boldKeyword} ne peut plus être ignoré.`
  ];

  const bodyPhrases = [
    `Les statistiques démontrent une <em>croissance significative</em> liée à ${boldKeyword}.`,
    `Les professionnels reconnaissent l'<em>importance stratégique</em> de ${boldKeyword}.`,
    `L'investissement dans ${boldKeyword} génère des <strong>résultats mesurables</strong>.`,
    `Les organisations leaders misent sur ${boldKeyword} pour se démarquer.`,
    `La recherche et développement autour de ${boldKeyword} s'intensifie.`,
    `L'adoption de ${boldKeyword} s'accompagne d'<strong>avantages concurrentiels</strong>.`,
    `Les retours d'expérience positifs sur ${boldKeyword} se multiplient.`,
    `Les innovations liées à ${boldKeyword} ouvrent de <em>nouvelles perspectives</em>.`,
    `L'intégration de ${boldKeyword} nécessite une approche méthodique.`,
    `Le développement de ${boldKeyword} suit une progression constante.`
  ];

  const contextPhrases = [
    `Dans un contexte économique exigeant,`,
    `Face aux enjeux actuels du marché,`,
    `Dans une perspective d'innovation continue,`,
    `Considérant les tendances émergentes,`,
    `Au regard des évolutions technologiques,`
  ];

  const transitionPhrases = [
    `<strong>Par ailleurs</strong>,`,
    `<em>En outre</em>,`,
    `De plus,`,
    `Il est important de noter que`,
    `À cela s'ajoute que`
  ];

  const bulletPoints = [
    `Optimisation des processus grâce à ${boldKeyword}`,
    `Impact mesurable de ${boldKeyword} sur la performance`,
    `Solutions innovantes proposées par ${boldKeyword}`,
    `Intégration stratégique de ${boldKeyword}`,
    `Développement durable avec ${boldKeyword}`,
    `Avantages compétitifs de ${boldKeyword}`,
    `Perspectives d'évolution de ${boldKeyword}`,
    `Bonnes pratiques pour ${boldKeyword}`,
    `Retour sur investissement de ${boldKeyword}`,
    `Facteurs clés de succès pour ${boldKeyword}`
  ];

  const generateBulletPoints = (count: number) => {
    const shuffled = [...bulletPoints].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(point => `<li>${point}</li>`).join('\n');
  };

  const generateParagraph = (phrases: string[], minWords: number, useContext = true) => {
    let content = '';
    const shuffledPhrases = [...phrases].sort(() => 0.5 - Math.random());
    const shuffledContext = [...contextPhrases].sort(() => 0.5 - Math.random());
    const shuffledTransitions = [...transitionPhrases].sort(() => 0.5 - Math.random());
    
    if (useContext && shuffledContext.length > 0) {
      content = `<p>${shuffledContext[0]} `;
    } else {
      content = '<p>';
    }
    
    let phraseIndex = 0;
    while (content.split(/\s+/).length < minWords && (phraseIndex < shuffledPhrases.length)) {
      if (phraseIndex > 0 && shuffledTransitions.length > 0) {
        content += ' ' + shuffledTransitions[phraseIndex % shuffledTransitions.length] + ' ';
      }
      content += shuffledPhrases[phraseIndex];
      phraseIndex++;
    }
    
    return content + '</p>';
  };

  const introWords = Math.max(Math.floor(targetWordCount * 0.2), 30);
  const sectionWords = Math.max(Math.floor((targetWordCount - introWords) / 3), 50);

  return {
    title: `${boldKeyword} : Guide Complet et Stratégies Efficaces`,
    intro: generateParagraph(introductoryPhrases, introWords),
    sections: [
      {
        heading: `<h2>Les Fondamentaux de ${boldKeyword}</h2>`,
        content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n<ul class="list-disc pl-6 my-4">\n${generateBulletPoints(3)}\n</ul>`
      },
      {
        heading: `<h2>Optimisation et Mise en Œuvre de ${boldKeyword}</h2>`,
        content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n<ul class="list-disc pl-6 my-4">\n${generateBulletPoints(3)}\n</ul>`
      },
      {
        heading: `<h2>Tendances et Innovations pour ${boldKeyword}</h2>`,
        content: `${generateParagraph(bodyPhrases, sectionWords)}\n\n<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic bg-primary/5">\nL'innovation continue dans le domaine de ${boldKeyword} est un facteur clé pour maintenir un avantage compétitif sur le long terme.\n</blockquote>\n\n<ul class="list-disc pl-6 my-4">\n${generateBulletPoints(3)}\n</ul>`
      }
    ]
  };
};
