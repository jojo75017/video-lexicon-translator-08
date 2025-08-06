
export const socialContentTemplates = {
  pinterest: [
    {
      title: "🌟 Idée Pinterest incontournable",
      description: "Découvrez cette idée créative qui va transformer votre quotidien ! Parfait pour inspirer votre communauté 📌",
      hashtags: ['pinterest', 'inspiration', 'idees', 'creatif', 'tendance']
    },
    {
      title: "💡 Inspiration du jour",
      description: "Une sélection spéciale pour éveiller votre créativité. Enregistrez cette épingle pour plus tard ! ✨",
      hashtags: ['inspiration', 'creativite', 'pinterest', 'idees', 'motivation']
    }
  ],
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
  ],
  linkedin: [
    {
      title: "Innovation et Excellence",
      description: "Découvrez comment notre approche innovante transforme l'industrie. Une vision professionnelle pour l'avenir.",
      hashtags: ['innovation', 'excellence', 'professionnel', 'industrie', 'linkedin']
    },
    {
      title: "Leadership et Vision",
      description: "Partager notre expertise et notre vision du marché. Ensemble, construisons l'avenir de notre secteur.",
      hashtags: ['leadership', 'vision', 'expertise', 'marche', 'linkedin']
    }
  ]
} as const;

export type SocialPlatform = keyof typeof socialContentTemplates;
