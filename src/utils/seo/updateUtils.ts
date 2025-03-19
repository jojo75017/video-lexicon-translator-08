
export const getStructureData = () => {
  return {
    headings: [
      { level: "h1", text: "Page d'accueil" },
      { level: "h2", text: "Services" },
      { level: "h2", text: "À propos" },
      { level: "h3", text: "Notre équipe" },
      { level: "h3", text: "Notre mission" },
      { level: "h2", text: "Contact" }
    ],
    recommendations: [
      "Utilisez une seule balise H1 par page",
      "Structurez vos H2 et H3 de manière hiérarchique",
      "Ajoutez des mots-clés pertinents dans vos titres",
      "Assurez-vous que votre structure est cohérente"
    ]
  };
};

export const getMetricsData = () => {
  return {
    traffic: {
      organic: 1250,
      direct: 830,
      referral: 420,
      social: 340,
      total: 2840
    },
    conversion: {
      rate: 3.2,
      total: 91
    },
    rankings: {
      topKeywords: [
        { keyword: "référencement site web", position: 3 },
        { keyword: "seo optimisation", position: 5 },
        { keyword: "analyse seo", position: 8 }
      ]
    },
    performance: {
      mobile: 82,
      desktop: 89,
      pagespeed: 86
    }
  };
};
