
export const socialContentTemplates = {
  facebook: [
    {
      title: "Découvrez notre nouvelle collection",
      description: "Nous sommes ravis de vous présenter notre dernière collection. Des designs uniques qui vous inspireront.",
      hashtags: ['design', 'inspiration', 'nouveaute', 'collection', 'facebook']
    },
    {
      title: "Nouveauté exclusive",
      description: "Une collection qui raconte une histoire. Chaque pièce est un voyage, chaque design une aventure.",
      hashtags: ['exclusivite', 'design', 'tendance', 'collection', 'facebook']
    }
  ],
  instagram: [
    {
      title: "✨ Nouveau sur Instagram",
      description: "Nouvelle collection disponible 🎉 Des pièces uniques qui vous ressemblent 💫",
      hashtags: ['design', 'inspiration', 'nouveaute', 'collection', 'instagram']
    },
    {
      title: "🔥 Coup de cœur du moment",
      description: "Une sélection qui capture l'essence de votre style personnel. Laissez-vous inspirer ! 🌟",
      hashtags: ['styleunique', 'tendance', 'lookbook', 'inspiration', 'instagram']
    }
  ]
} as const;

export type SocialPlatform = keyof typeof socialContentTemplates;
