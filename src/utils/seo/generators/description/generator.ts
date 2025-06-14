
export const generateBothDescriptions = (keyword: string) => {
  const shortDescriptions = [
    `Découvrez tout sur ${keyword} avec notre guide complet. Conseils pratiques, stratégies efficaces et solutions adaptées à vos besoins.`,
    `Apprenez les meilleures techniques pour ${keyword}. Guide expert avec exemples concrets et recommandations personnalisées.`,
    `Optimisez votre approche de ${keyword} grâce à nos conseils d'experts. Méthodes éprouvées et astuces pratiques incluses.`,
    `Maîtrisez ${keyword} avec notre guide détaillé. Stratégies, outils et conseils pour réussir efficacement.`
  ];

  const longDescriptions = [
    `Découvrez notre guide complet sur ${keyword} avec des conseils d'experts, des stratégies éprouvées et des solutions pratiques. Que vous soyez débutant ou expérimenté, vous trouverez toutes les informations nécessaires pour optimiser votre approche et obtenir des résultats concrets. Nos recommandations sont basées sur les meilleures pratiques du secteur et l'expérience terrain de nos spécialistes. Profitez de ressources exclusives, d'exemples concrets et d'outils performants pour réussir dans votre domaine.`,
    `Apprenez les techniques les plus efficaces concernant ${keyword} grâce à notre expertise reconnue. Ce guide détaillé vous accompagne étape par étape avec des méthodes testées, des cas pratiques et des conseils personnalisés selon votre niveau. Nos spécialistes partagent leurs secrets pour une mise en œuvre réussie, des erreurs à éviter et les opportunités à saisir. Accédez à une formation complète avec supports pratiques, checklist et outils indispensables pour exceller dans ce domaine.`
  ];

  const randomShort = shortDescriptions[Math.floor(Math.random() * shortDescriptions.length)];
  const randomLong = longDescriptions[Math.floor(Math.random() * longDescriptions.length)];

  return {
    short: randomShort.length > 155 ? randomShort.substring(0, 152) + "..." : randomShort,
    long: randomLong.length > 500 ? randomLong.substring(0, 497) + "..." : randomLong
  };
};

export const generateSeoDescription = (keyword: string): string => {
  const { short } = generateBothDescriptions(keyword);
  return short;
};

export const generateAIDescriptions = async (keyword: string, apiKey: string) => {
  // Simulation de l'API OpenAI pour la démo
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const { short, long } = generateBothDescriptions(keyword);
  return { short, long };
};
