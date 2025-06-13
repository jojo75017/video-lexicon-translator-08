
export const generateSeoTitle = (keyword: string): string => {
  const templates = [
    `${keyword} : Guide Complet 2024`,
    `Tout savoir sur ${keyword} - Guide Expert`,
    `${keyword} : Conseils et Astuces Pratiques`,
    `Guide ${keyword} : Stratégies Efficaces`,
    `${keyword} - Solutions et Recommandations`,
    `Maîtriser ${keyword} : Guide Professionnel`,
    `${keyword} : Méthodes Éprouvées et Conseils`,
    `Comment optimiser ${keyword} - Guide Détaillé`
  ];
  
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  return randomTemplate.length > 60 ? randomTemplate.substring(0, 57) + "..." : randomTemplate;
};
