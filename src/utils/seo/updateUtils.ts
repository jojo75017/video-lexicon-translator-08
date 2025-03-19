
export const getDailyUpdates = () => {
  console.log("FETCHING DAILY UPDATES");
  
  // Retourne immédiatement les mises à jour sans délai
  return [
    {
      type: 'success',
      message: 'Position moyenne améliorée de 2.3 positions'
    },
    {
      type: 'info',
      message: '3 nouveaux backlinks détectés'
    },
    {
      type: 'warning',
      message: 'Temps de chargement augmenté de 0.5 secondes'
    },
    {
      type: 'success',
      message: 'Score de performance mobile amélioré de 8 points'
    },
    {
      type: 'info',
      message: '12 nouvelles visites organiques'
    },
    {
      type: 'success',
      message: 'Analyse de structure terminée avec succès'
    }
  ];
};

export const getSeoUpdates = () => {
  console.log("FETCHING SEO UPDATES");
  
  // Retourne immédiatement les résultats sans délai
  return {
    lastUpdated: new Date().toISOString(),
    keywordRankings: [
      { keyword: 'aquarium eau douce', position: 12, change: -2 },
      { keyword: 'poisson aquarium', position: 8, change: 0 },
      { keyword: 'entretien aquarium', position: 15, change: 3 },
      { keyword: 'filtre aquarium', position: 22, change: -5 },
      { keyword: 'plante aquatique', position: 18, change: -1 }
    ],
    trafficStats: {
      organic: { value: 458, change: 12 },
      direct: { value: 215, change: -5 },
      referral: { value: 87, change: 2 },
      social: { value: 134, change: 8 }
    },
    technicalIssues: {
      errors: 3,
      warnings: 8,
      info: 12,
      fixed: 5
    }
  };
};

// Nouvelle fonction pour générer immédiatement des données de structure SEO
export const getStructureData = () => {
  console.log("GENERATING STRUCTURE DATA");
  
  return {
    headings: [
      { text: "Bienvenue chez AquariosLands", level: 1, position: 1 },
      { text: "Explorez AquariosLands : Votre expert", level: 2, position: 2 },
      { text: "Qualité de l'eau et filtration", level: 3, position: 3 },
      { text: "Choix des poissons adaptés", level: 3, position: 4 },
      { text: "Plantes et décoration naturelle", level: 3, position: 5 },
      { text: "Problèmes courants & solutions", level: 2, position: 8 },
      { text: "Témoignages de nos lecteurs", level: 2, position: 10 }
    ],
    paragraphs: [
      { text: "Le site AquariosLands vous propose des conseils pour gérer votre aquarium...", position: 1.5 },
      { text: "Découvrez comment maintenir une eau de qualité pour vos poissons...", position: 3.5 },
      { text: "Apprenez à choisir les poissons adaptés à votre aquarium...", position: 4.5 },
      { text: "Les plantes aquatiques ajoutent non seulement une touche esthétique...", position: 5.5 }
    ],
    recommendations: [
      "Assurez-vous d'avoir un seul titre H1 par page pour une meilleure structure",
      "Utilisez des H2 et H3 de manière hiérarchique pour organiser votre contenu",
      "Incluez des mots-clés importants dans vos titres et sous-titres",
      "Gardez une structure cohérente sur l'ensemble de votre site"
    ]
  };
};
