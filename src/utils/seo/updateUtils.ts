
// Définissez ici les types nécessaires pour vos mises à jour SEO

export interface SeoUpdate {
  type: 'info' | 'success' | 'warning';
  message: string;
  date?: string;
}

export interface StructureData {
  headings: Array<{
    level: number;
    text: string;
  }>;
  recommendations?: string[];
}

// Fonction pour obtenir les mises à jour quotidiennes
export const getDailyUpdates = (): SeoUpdate[] => {
  return [
    {
      type: 'success',
      message: 'Augmentation de 12% du trafic organique cette semaine',
      date: new Date().toLocaleDateString()
    },
    {
      type: 'warning',
      message: '3 pages avec un contenu dupliqué détectées',
      date: new Date(Date.now() - 86400000).toLocaleDateString()
    },
    {
      type: 'info',
      message: 'Nouvelle mise à jour de l\'algorithme de Google annoncée',
      date: new Date(Date.now() - 172800000).toLocaleDateString()
    },
    {
      type: 'success',
      message: '5 nouveaux backlinks de qualité détectés',
      date: new Date(Date.now() - 259200000).toLocaleDateString()
    }
  ];
};

// Fonction pour générer des données de structure lorsque l'analyse réelle échoue
export const getStructureData = (): StructureData => {
  console.log("Generating fallback structure data");
  return {
    headings: [
      { level: 1, text: "Page d'accueil" },
      { level: 2, text: "Nos services" },
      { level: 3, text: "Consultation SEO" },
      { level: 3, text: "Audit technique" },
      { level: 3, text: "Optimisation de contenu" },
      { level: 2, text: "À propos" },
      { level: 2, text: "Témoignages clients" },
      { level: 3, text: "Secteur e-commerce" },
      { level: 3, text: "Secteur éducation" },
      { level: 2, text: "Contactez-nous" }
    ],
    recommendations: [
      "Ajoutez un sous-titre H2 après le titre principal H1",
      "Évitez de sauter des niveaux dans la hiérarchie des titres",
      "Limitez le nombre de titres H1 à un seul par page",
      "Utilisez des mots-clés pertinents dans vos titres H2 et H3"
    ]
  };
};
